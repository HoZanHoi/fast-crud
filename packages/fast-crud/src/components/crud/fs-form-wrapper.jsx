import { ref, resolveComponent, computed, nextTick } from "vue";
import FsButton from "../basic/fs-button";
import traceUtil from "../../utils/util.trace";
import _ from "lodash-es";
import { useI18n } from "../../local";
import "./fs-form-wrapper.less";
export default {
  name: "FsFormWrapper",
  // eslint-disable-next-line vue/no-unused-components
  components: { FsButton },
  props: {
    slots: {},
  },
  emits: [
    "reset",
    "submit",
    "validationError",
    "value-change",
    "open",
    "opened",
    "closed",
  ],
  setup(props, ctx) {
    traceUtil.trace("fs-form-wrapper");
    const { t } = useI18n();
    const formWrapperOpen = ref(false);
    const formWrapperIs = ref();
    const formOptions = ref();
    const formWrapper = ref();
    const formRef = ref();
    const loading = ref(false);

    const emitOnClosed = ref();
    const emitOnOpened = ref();
    const open = (opts) => {
      const { wrapper } = opts;
      if (wrapper.onOpen) {
        wrapper.onOpen(opts);
      }
      formWrapper.value = {
        ..._.omit(wrapper, "onOpen", "onClosed", "onOpened"),
      };
      delete formWrapper.value.is;
      formWrapperIs.value = opts.wrapper.is;
      formOptions.value = {
        ..._.omit(opts, "wrapper"),
      };

      // 打开表单对话框
      formWrapperOpen.value = true;

      // 发射打开事件
      function buildEvent() {
        return {
          wrapper: formWrapper.value,
          options: formOptions.value,
          formRef: formRef.value,
        };
      }

      emitOnClosed.value = () => {
        if (wrapper.onClosed) {
          wrapper.onClosed(buildEvent());
        }
      };
      emitOnOpened.value = () => {
        if (wrapper.onOpened) {
          wrapper.onOpened(buildEvent());
        }
      };

      nextTick(() => {
        onOpened();
      });
    };
    const close = () => {
      formWrapperOpen.value = false;
    };
    const onClosed = () => {
      formOptions.value = null;
      if (emitOnClosed.value) {
        emitOnClosed.value();
      }
    };

    const onOpened = () => {
      if (emitOnOpened.value) {
        emitOnOpened.value();
      }
    };

    const onValueChange = (e) => {
      ctx.emit("value-change", e);
    };

    async function submit() {
      loading.value = true;
      try {
        await formRef.value.submit();
        close();
      } catch (e) {
        console.warn("submit error", e);
      } finally {
        loading.value = false;
      }
    }

    function getFormData() {
      return formRef.value.getFormData();
    }
    function setFormData(form) {
      formRef.value = form;
    }

    const computedButtons = computed(() => {
      // TODO i18n
      const defBtns = {
        cancel: {
          text: t("fs.form.cancel"),
          onClick: () => {
            close();
          },
        },
        ok: {
          text: t("fs.form.ok"),
          type: "primary",
          onClick: () => {
            submit();
          },
          loading: loading.value,
        },
      };
      return _.merge(defBtns, formWrapper.value.buttons);
    });

    return {
      close,
      onClosed,
      onOpened,
      open,
      formOptions,
      formWrapperIs,
      formWrapperOpen,
      formWrapper,
      formRef,
      submit,
      computedButtons,
      loading,
      getFormData,
      setFormData,
      onValueChange,
    };
  },
  render() {
    if (!this.formWrapper) {
      return null;
    }
    let children = {};
    const _slots = { ...this.$slots, ...this.slots };
    const slotsRender = (key, scope, slots = _slots) => {
      if (!slots[key]) {
        return null;
      }
      return slots[key](scope);
    };
    const scope = { _self: this, ...this.formOptions };
    if (this.formOptions) {
      children = {
        default: () => {
          const buttons = [];
          _.forEach(this.computedButtons, (item) => {
            if (item.show === false) {
              return;
            }
            buttons.push(<fs-button {...item} />);
          });
          return (
            <div>
              {slotsRender("form-body-before", scope)}
              <fs-form
                ref="formRef"
                {...this.formOptions}
                onValueChange={this.onValueChange}
              />
              {slotsRender("form-body-after", scope)}
              <div className="fs-form-footer-btns">
                {slotsRender("form-footer-prefix", scope)}
                {buttons}
                {slotsRender("form-footer-append", scope)}
              </div>
            </div>
          );
        },
      };
    }

    const is = this.formWrapperIs || "el-dialog";

    const visible = this.$fsui.formWrapper.visible;
    const vModel = {
      [visible]: this.formWrapperOpen,
      ["onUpdate:" + visible]: (value) => {
        this.formWrapperOpen = value;
      },
    };
    const vClosed = this.$fsui.formWrapper.buildOnClosedBind(is, this.onClosed);
    const vCustomClass = {
      [this.$fsui.formWrapper.customClass]:
        "fs-form-wrapper " + this.formWrapper.customClass,
    };

    const formWrapperComp = resolveComponent(is);
    return (
      <formWrapperComp
        {...vCustomClass}
        {...this.formWrapper}
        {...vModel}
        {...vClosed}
        v-slots={children}
      />
    );
  },
};
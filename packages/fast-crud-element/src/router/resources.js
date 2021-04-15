import Layout from "../layout/layout.vue";
import LayoutPass from "../layout/layout-pass.vue";
import _ from "lodash-es";

const modules = import.meta.glob("/src/views/**/*.vue");
console.log(" modules", modules);
const resources = [
  {
    title: "首页",
    name: "index",
    path: "/index",
    component: "/home/index.vue"
  },
  {
    title: "核心特性",
    name: "basis",
    path: "/basis",
    redirect: "/basis/dict",
    children: [
      {
        title: "动态计算",
        path: "/basis/compute",
        component: "/basis/compute/index.vue"
      }
    ]
  },
  {
    title: "数据字典",
    name: "dict",
    path: "/dict",
    redirect: "/dict/single",
    children: [
      {
        title: "单例",
        path: "/dict/single",
        component: "/dict/single/index.vue"
      },
      {
        title: "分发复制",
        path: "/dict/cloneable",
        component: "/dict/cloneable/index.vue"
      },
      {
        title: "原型复制",
        path: "/dict/prototype",
        component: "/dict/prototype/index.vue"
      }
    ]
  },
  {
    title: "组件示例",
    name: "component",
    path: "/component",
    redirect: "/component/text",
    children: [
      {
        title: "文本输入(input)",
        path: "/component/text",
        component: "/component/text/index.vue"
      },
      {
        title: "选择(select)",
        path: "/component/select",
        component: "/component/select/index.vue"
      },
      {
        title: "级联(cascader)",
        path: "/component/cascader",
        component: "/component/cascader/index.vue"
      },
      {
        title: "多选(checkbox)",
        path: "/component/checkbox",
        component: "/component/checkbox/index.vue"
      },
      {
        title: "单选(radio)",
        path: "/component/radio",
        component: "/component/radio/index.vue"
      },
      {
        title: "开关(switch)",
        path: "/component/switch",
        component: "/component/switch/index.vue"
      },
      {
        title: "日期时间(date)",
        path: "/component/date",
        component: "/component/date/index.vue"
      },
      {
        title: "按钮链接",
        path: "/component/button",
        component: "/component/button/index.vue"
      },
      {
        title: "数字",
        path: "/component/number",
        component: "/component/number/index.vue"
      },
      {
        title: "树形选择",
        path: "/component/tree",
        component: "/component/tree/index.vue"
      },
      {
        title: "图片裁剪上传",
        path: "/component/uploader/cropper",
        component: "/component/uploader/cropper/index.vue"
      },
      {
        title: "表单本地上传",
        path: "/component/uploader/form",
        component: "/component/uploader/form/index.vue"
      },
      {
        title: "阿里云oss上传",
        path: "/component/uploader/alioss",
        component: "/component/uploader/alioss/index.vue"
      },
      {
        title: "腾讯云cos上传",
        path: "/component/uploader/cos",
        component: "/component/uploader/cos/index.vue"
      },
      {
        title: "七牛云上传",
        path: "/component/uploader/qiniu",
        component: "/component/uploader/qiniu/index.vue"
      }
    ]
  },
  {
    title: "Form表单",
    name: "form",
    path: "/form",
    redirect: "/form/text",
    children: [
      {
        title: "表单Grid布局",
        path: "/form/layout-grid",
        component: "/form/layout-grid/index.vue"
      },
      {
        title: "表单Flex布局",
        path: "/form/layout-flex",
        component: "/form/layout-flex/index.vue"
      },
      {
        title: "表单动态布局",
        path: "/form/layout",
        component: "/form/layout/index.vue"
      },
      {
        title: "表单校验",
        path: "/form/validation",
        component: "/form/validation/index.vue"
      },
      {
        title: "抽屉表单",
        path: "/form/drawer",
        component: "/form/drawer/index.vue"
      },
      {
        title: "表单分组",
        path: "/form/group",
        component: "/form/group/index.vue"
      },
      {
        title: "表单分组(tabs)",
        path: "/form/group-tabs",
        component: "/form/group-tabs/index.vue"
      },
      {
        title: "自定义表单",
        path: "/form/custom-form",
        component: "/form/custom-form/index.vue"
      },
      {
        title: "独立使用表单",
        path: "/form/independent",
        component: "/form/independent/index.vue"
      }
    ]
  },
  {
    title: "特性示例",
    path: "feature",
    children: [
      {
        title: "操作列按钮折叠",
        path: "/feature/dropdown",
        component: "/feature/dropdown/index.vue"
      },
      {
        title: "可选择",
        path: "/feature/checkable",
        component: "/feature/checkable/index.vue"
      },
      {
        title: "批量删除",
        path: "/feature/batch-delete",
        component: "/feature/batch-delete/index.vue"
      }
    ]
  },
  {
    title: "插槽",
    path: "slots",
    children: [
      {
        title: "布局插槽",
        path: "/slots/layout",
        component: "/slots/layout/index.vue"
      },
      {
        title: "查询字段插槽",
        path: "/slots/search",
        component: "/slots/search/index.vue"
      },
      {
        title: "单元格插槽",
        path: "/slots/cell",
        component: "/slots/cell/index.vue"
      },
      {
        title: "表单字段插槽",
        path: "/slots/form-item",
        component: "/slots/form-item/index.vue"
      },
      {
        title: "表单插槽",
        path: "/slots/form",
        component: "/slots/form/index.vue"
      }
    ]
  },
  {
    title: "复杂需求",
    path: "advanced",
    children: [
      {
        title: "选择联动",
        path: "/advanced/linkage",
        component: "/advanced/linkage/index.vue"
      },
      {
        title: "嵌套子表格",
        path: "/advanced/nest",
        component: "/advanced/nest/index.vue"
      }
    ]
  }
];

function createRouters(adminRouters) {
  return [
    {
      path: "/",
      name: "/",
      component: Layout,
      redirect: "index",
      children: adminRouters
    }
  ];
}

let index = 0;
function transformOneResource(resource) {
  const menu = _.cloneDeep(resource);
  let route;
  if (resource.type !== "menu") {
    route = _.cloneDeep(resource);
    if (route.component) {
      const path = "/src/views" + route.component;
      route.component = modules[path];
    } else {
      route.component = LayoutPass;
    }
  }

  return {
    menu,
    route
  };
}

const buildMenusAndRouters = (resources) => {
  const routes = [];
  const menus = [];

  for (const item of resources) {
    const { menu, route } = transformOneResource(item);
    routes.push(route);
    menus.push(menu);

    if (item.children) {
      if (item.children.length > 0) {
        const ret = buildMenusAndRouters(item.children);
        menu.children = ret.menus;
        route.children = ret.routes;
      }
    }
  }
  return {
    routes,
    menus
  };
};

function setIndex(menus) {
  for (const menu of menus) {
    menu.index = index;
    index++;
    if (menu.children && menu.children.length > 0) {
      setIndex(menu.children);
    }
  }
}

const ret = buildMenusAndRouters(resources);
const adminRoutes = ret.routes;
const adminMenus = ret.menus;
setIndex(adminMenus);
export const menus = adminMenus;

export const routes = createRouters(adminRoutes);

console.log("menus:", menus, "routes", routes);
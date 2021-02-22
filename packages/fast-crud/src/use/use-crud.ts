import defaultCrudOptions from './default-crud-options'
import _ from 'lodash-es'
import { reactive, nextTick } from 'vue'
import logger from '../utils/util.log'
import typesUtil from '../utils/util.types'
import { ElMessageBox, ElNotification } from 'element-plus'

export interface CrudOptions{
  table?: {};
  columns?: {};
  data?: [];
  rowHandle?: {};
  search?: {};
  toolbar?: {};
  actionbar?: {};
  form?: {};
  addForm?: {};
  editForm?: {};
  viewForm?: {};
  pagination?: {};
  request?: {};
}

export default function (ctx) {
  const options: CrudOptions = ctx.options
  const crudRef = ctx.crudRef
  let crudOptions = {}
  let columns = {}

  async function doRefresh () {
    const pagination = crudOptions.pagination
    let page
    if (pagination) {
      page = { currentPage: pagination.currentPage, pageSize: pagination.pageSize }
    }
    const searchFormData = {}
    if (crudRef.value) {
      crudRef.value.getSearchFormData()
    }
    let query = { page, form: searchFormData }
    if (crudOptions.request.transformQuery) {
      query = crudOptions.request.transformQuery(query)
    }

    crudOptions.table.loading = true
    let pageRes
    try {
      pageRes = await crudOptions.request.pageRequest(query)
    } finally {
      crudOptions.table.loading = false
    }
    if (pageRes == null) {
      logger.warn('pageRequest返回结果不能为空')
      return
    }
    if (crudOptions.request.transformRes) {
      pageRes = crudOptions.request.transformRes({ res: pageRes, query })
    }
    let { currentPage = page.currentPage, pageSize = page.pageSize, total, records } = pageRes
    if (records == null) {
      logger.warn('pageRequest返回结构不正确，请配置transform，期望：{currentPage, pageSize, total, records:[]},实际返回：', pageRes)
      return
    }
    crudOptions.data = records || (records = [])
    if (pagination) {
      pagination.currentPage = currentPage
      pagination.pageSize = pageSize
      pagination.total = total || records.length
    }
  }

  function doPageTurn (no: number) {
    crudOptions.pagination.currentPage = no
  }
  /**
   *
   * @param opts = {
   *   form
   *   goFirstPage =true
   *   mergeForm=false
   * }
   */
  async function doSearch (opts) {
    opts = _.merge({ goFirstPage: true }, opts)
    if (opts.goFirstPage) {
      doPageTurn(1)
    }
    if (opts.form && crudRef.value) {
      crudRef.value.setSearchFormData(opts)
    }

    await doRefresh()
  }

  function usePagination () {
    return {
      pagination: {
        onSizeChange (event) {
          crudOptions.pagination.pageSize = event
          doRefresh()
        },
        onCurrentChange (event) {
          crudOptions.pagination.currentPage = event
          doRefresh()
        }
      }
    }
  }

  function useFormSubmit () {
    return {
      editForm: {
        async doSubmit (context) {
          await crudOptions.request.editRequest(context)
          doRefresh()
        }
      },
      addForm: {
        async doSubmit (context) {
          await crudOptions.request.addRequest(context)
          doRefresh()
        }
      }
    }
  }

  function useRemove () {
    return {
      rowHandle: {
        remove: {
          click: async function (context) {
            // TODO i18n
            try {
              await ElMessageBox.confirm('确定要删除此记录吗?', '提示', {
                type: 'warning'
              })
            } catch (e) {
              logger.info('用户取消删除')
              return
            }
            await crudOptions.request.delRequest(context.row.id)
            ElNotification({
              type: 'success',
              message: '删除成功!'
            })
            await doRefresh()
          }
        }
      }
    }
  }

  function useSearch () {
    return {
      search: {
        doSearch
      }
    }
  }

  function useEvent () {
    return {
      onUpdate (e) {
        logger.debug('onUpdate', e)
        if (e.key === 'columns') {
          _.forEach(crudOptions.columns, (value, key) => {
            delete crudOptions.columns[key]
          })
          nextTick(() => {
            crudOptions.columns = e
          })
          return
        }
        console.log('crudOptions', crudOptions)
        _.set(crudOptions, e.key, e.value)
      },
      onRefresh () {
        doRefresh()
      }
    }
  }
  function setCrudOptions (pageOptions: CrudOptions) {
    const userOptions = _.merge(
      defaultCrudOptions.defaultOptions,
      usePagination(),
      useFormSubmit(),
      useRemove(),
      useSearch(),
      useEvent(),
      _.cloneDeep(defaultCrudOptions.commonOptions(ctx)),
      pageOptions
    )

    // 分散 合并到不同的维度
    const cellColumns = {}
    const formColumns = {}
    const addFormColumns = {}
    const editFormColumns = {}
    const viewFormColumns = {}
    const searchColumns = {}

    function mergeFromForm (targetColumns, item, key, mergeSrc) {
      const formColumn = _.cloneDeep(item[mergeSrc]) || {}
      formColumn.label = item.label
      formColumn.key = key
      targetColumns[key] = formColumn
    }
    function eachColumns (columns, columnParentColumns = cellColumns) {
      _.forEach(columns, (item, key) => {
        // types merge
        if (item.type) {
          const typeOptions = typesUtil.getType(item.type)
          if (typeOptions) {
            item = _.merge({}, typeOptions, item)
          }
        }
        // copy dict

        if (item.dict) {
          if (item.column?.component) {
            item.column.component.dict = _.cloneDeep(item.dict)
          }
          if (item.form?.component) {
            item.form.component.dict = _.cloneDeep(item.dict)
          }
          console.log('item.dict', item)
        }

        const cellColumn = item.column || {}
        cellColumn.label = item.label
        cellColumn.key = key
        columnParentColumns[key] = cellColumn
        if (item.children) {
          eachColumns(item.children, cellColumn.children = {})
          return
        }
        mergeFromForm(formColumns, item, key, 'form')
        mergeFromForm(addFormColumns, item, key, 'addForm')
        mergeFromForm(editFormColumns, item, key, 'editForm')
        mergeFromForm(viewFormColumns, item, key, 'viewForm')
        mergeFromForm(searchColumns, item, key, 'search')
      })
    }

    eachColumns(userOptions.columns)

    // 分置合并
    userOptions.form = _.merge(_.cloneDeep(userOptions.form), { columns: formColumns })
    userOptions.editForm = _.merge(_.cloneDeep(userOptions.form), { columns: editFormColumns }, userOptions.editForm)
    userOptions.addForm = _.merge(_.cloneDeep(userOptions.form), { columns: addFormColumns }, userOptions.addForm)
    userOptions.viewForm = _.merge(_.cloneDeep(userOptions.form), { columns: viewFormColumns }, userOptions.viewForm)
    userOptions.search = _.merge({ columns: userOptions.form.columns }, { columns: searchColumns }, userOptions.search)
    userOptions.columns = cellColumns

    // 单独处理viewForm的component
    _.forEach(userOptions.viewForm.columns, (value) => {
      if (!value.component) {
        value.component = {}
      }
      value.component.disabled = true
    })
    // 与默认配置合并
    const temp = userOptions.columns
    delete userOptions.columns
    crudOptions = reactive(userOptions)

    columns = reactive(temp)

    logger.info('fast-crud inited:', crudOptions)
  }

  setCrudOptions(options)

  return {
    doRefresh,
    doPageTurn,
    doSearch,
    setCrudOptions,
    crudOptions,
    columns
  }
}

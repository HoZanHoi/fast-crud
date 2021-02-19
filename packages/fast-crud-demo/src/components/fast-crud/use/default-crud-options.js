export default {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  commonOptions (ctx) {
  },
  defaultOptions: {
    addForm: {
      wrapper: {
        title: '添加'
      }
    },
    editForm: {
      wrapper: {
        title: '编辑'
      }
    },
    rowHandle: {
      label: '操作'
    },
    pagination: {
      background: true,
      pageSize: 20,
      pageSizes: [5, 10, 20, 50],
      layout: 'total, sizes, prev, pager, next, jumper'
    },
    table: {

    },
    actionbar: {
      buttons: {
        add: {
          type: 'primary',
          text: '添加'
        }
      }
    }
  }
}

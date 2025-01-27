
# search【查询框】
更多参数见：[FsSearch](/api/components/crud/search/index.md)



## show
* 说明：显示或隐藏查询框
* 类型：Boolean
* 默认：`true`

## buttons
* 说明：按钮配置
* 类型：Object
* 默认： {search:{},reset:{}}
* 相关：[按钮组配置](../common-options.md#buttons)
* 示例：
```json
{//crudOptions.search.buttons
    search:{
        ...FsButton, //fs-button组件的参数
        order:1, //排序，越小越靠前
        show:true,//是否显示此按钮
        click(){} //点击事件，默认触发查询
    },
    reset:{...同上},// 重置按钮
    custom:{...同上}//可以自定义
}
```
[FsButton](../common-options)


## buttonsPosition
* 说明：按钮位置 (已废弃)
* 类型：string，可选【default，bottom】
* 默认：`default`


## columns
* 说明：查询字段配置
* 类型：Object
* 默认： {}
* 示例：


## columns[key][对应ui组件的配置]
* 说明：支持对应ui库的form-item组件的配置
* 支持：el-form-item,a-form-item,n-form-item的配置
* 类型：Object
* 备注：此属性无需配置，`useCrud`后会从`crudOptions.columns[key].search`中复制过来,你只需要配置各个字段的`search`即可


## columns[key].component
* 说明：查询字段组件配置
* 类型：Object
参考组件配置[component](../common-options.md)

## doSearch
* 说明：触发查询
* 类型：async Function(context)
* 

## options
* 说明：表单参数
* 类型：Object
* 支持：el-form,a-form的参数


## container
* 说明：布局容器，支持search自定义布局
* 类型：Object
* 默认： {is:'fs-search-layout-default'}
* 参考： [fs-search-layout-default](https://github.com/fast-crud/fast-crud/blob/main/packages/fast-crud/src/components/search/layout-default.vue)
```js
const crudOptions = {
    search:{
        container:{
            is:'your-custom-layout-component-name',
            collpase:true, //是否展开，你布局组件中定义的props
            'onUpdate:collpase':(value)=>{
              crudBiding.value.search.container.collpase = value  
            },
            action:{
                label:"操作", //查询按钮前缀
                col:{ span: 4} //查询按钮所占格子宽度
            },
            col:{ span:4}, // 默认列宽度配置
            collapseButton:{ //展开按钮配置
                // fs-button 属性
            }
        },
    }
}

```



## 更多参数
* 说明：更多参数见：[FsSearch](/api/components/crud/search/index.md)组件文档

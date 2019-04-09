# bp-table
基于iview开发的表格组件[WIP]
todo:单元格中组件、远程搜索以及分页。。。
## 用法

```javascript
import Vue from 'vue';
import BpTable from 'bptable';
Vue.use(BpTable);
```
```vue
<template>
    <div id="app">
        <bptable :option="option" :list="list" :column="column" :data="data">
        </bptable>
    </div>
</template>
<script lang="ts">
// ...
</script>
```
```typescript
export interface ListOption<T> {
    rowKey: string; // 唯一键
    showColumnFilter?: boolean;
    action?: boolean;
    pageSize?: number; // 每页显示数量L
    pageSizes?: number[]; // 每页显示数量选项
    exportExcel?: boolean; // 是否显示导出按钮
    disablePagination?: boolean; // 显示分页

    // iview 原生参数
    stripe?: boolean; // 斑马纹
    border?: boolean; // 是否显示纵向边框
}
```
column对象中可以使用iview-table的render函数。  
为column中每一个对象添加filter属性可以开启列搜索框。
```javascript
            {
                title: 'Age',
                key: 'age',
                filter: {
                    type: 'Input',
                    stype: 'text',
                    placeholder: '请输入年龄',
                },
            },
            {
                title: 'Address',
                key: 'address',
            },
            {
                title: 'Action',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h: any, params: any) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.show(params);
                                },
                            },
                        }, 'View'),
                    ]);
                },
            },
```
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


# bp-table
基于iview开发的表格组件[WIP]
todo:单元格中组件等。。。  

![version](https://img.shields.io/badge/version-v0.2.0-brightgreen.svg?style=flat-square)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

## 用法

```javascript
import Vue from 'vue';
import BpTable from 'bptable';
Vue.use(BpTable);
```
```vue
<template>
    <div id="app">
        <bptable :option="option" :column="column" :data="data" :pageParams="pageParams">
        </bptable>
        <!--当option中sync参数为true时，需要在传入data同时传入分页参数-->
    </div>
</template>
<script lang="ts">
// ...
</script>
```
option结构：
```typescript
export interface ListOption<T> {
    rowKey: string; // 唯一键
    sync:boolean; // false：本地搜索加分页；true：远程搜索加分页（会返回事件）
    showColumnFilter?: boolean;
    action?: boolean;
    pageSize?: number; // 每页显示数量
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


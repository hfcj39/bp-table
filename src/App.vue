<template>
    <div id="app">
        <bptable :option="option"
                 :column="column"
                 :data="data"
                 :pageParams="page"
                 @on-selection-change="selectionChange"
                 @on-global-search="globalSearch"
                 @on-export-data="exportData"
                 @on-column-search="columnSearch"
                 @on-page-change="pageChange"
        >
            <p>这里是插槽内容</p>
        </bptable>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {ListOption} from '@/components/interface';

    // todo 多选

    @Component
    export default class App extends Vue {
        private option: ListOption<any> = {
            rowKey: 'id',
            sync: true,
            pageSizes: [10, 20, 50, 100, 200],
            exportExcel: true,
            stripe: true,
            border: true,
            showColumnFilter: true,
        };
        private column = [
            {
                title: '多选',
                type: 'selection',
                width: 60,
                align: 'center',
            },
            {
                title: 'Name',
                key: 'name',
                filter: {
                    type: 'Input',
                    stype: 'text',
                    placeholder: '请输入姓名',
                },
            },
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
        ];
        private data = [
            {
                name: 'John Brown',
                age: 18,
                address: 'New York No. 1 Lake Park',
                date: '2016-10-03',
            },
            {
                name: 'Jim Green',
                age: 24,
                address: 'London No. 1 Lake Park',
                date: '2016-10-01',
            },
            {
                name: 'Joe Black',
                age: 30,
                address: 'Sydney No. 1 Lake Park',
                date: '2016-10-02',
            },
            {
                name: 'Jon Snow',
                age: 26,
                address: 'Ottawa No. 2 Lake Park',
                date: '2016-10-04',
            },
        ];
        private page = {
            total: 100,
            currentPage: 1,
        };

        private show(index: number) {
            console.log(index);
        }

        private selectionChange(arr: any[]) {
            console.log(arr);
        }

        private globalSearch(payload: string) {
            console.log('searchGlobal', payload);
        }

        private exportData(opt: string) {
            console.log('export', opt);
        }

        private columnSearch(obj: any) {
            console.log('columnSearch', obj);
        }

        private pageChange(obj: any) {
            console.log('changePage', obj);
        }
    }
</script>

<style>
    #app {
        margin: 20px;
    }
</style>

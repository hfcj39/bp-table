<template>
    <div class="bp-table">
        <div class="table-header">
            <!--全局搜索组件-->
            <Input search placeholder="请输入要搜索的内容" @on-search="handleGlobalSearch"/>
            <!--插槽-->
            <slot></slot>
            <!--导出组件-->
            <div v-if="option.exportExcel">
                <Dropdown @on-click="exportData" style="margin-left: 20px">
                    <Button>
                        导出CSV
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="origin">
                            <Icon type="ios-download-outline"></Icon>
                            导出全部数据
                        </DropdownItem>
                        <DropdownItem name="current">
                            <Icon type="ios-download-outline"></Icon>
                            导出显示数据
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <!--过滤器组件-->
        <div class="column-list" v-if="option.showColumnFilter">
            <span>显示在表格中的列：</span>
            <CheckboxGroup size="small" v-model="tableColumnsChecked" @on-change="fillTableColumns">
                <Checkbox :ref="'check' + index"
                          v-for="(item, index) in column"
                          :label="item.key" :key="item.key"
                ><span> {{item.title}}</span></Checkbox>
            </CheckboxGroup>
        </div>
        <!--表格本体-->
        <Table :columns="filteredColumns"
               :data="showedData"
               :stripe="option.stripe"
               :border="option.border"
               :loading="isLoading"
               @on-selection-change="onSelectionChange"
               ref="table"
        ></Table>
        <!--分页组件-->
        <div class="table-footer" v-if="!option.disablePagination">
            <Page :total="total"
                  :page-size="selectedSize"
                  :page-size-opts="option.pageSizes"
                  :current.sync="current"
                  show-sizer
                  show-elevator
                  @on-change="handlePageChange"
                  @on-page-size-change="handlePageSizeChange"
                  show-total/>
        </div>
    </div>
</template>

<script lang="ts">

    import {Vue, Component, Prop, Emit, Watch} from 'vue-property-decorator';
    import {ListOption, PageParams} from './interface';

    @Component
    export default class BpList extends Vue {

        @Prop({required: true, type: Object}) private option!: ListOption<any>;
        @Prop({type: Object}) private pageParams!: PageParams;
        @Prop({type: Array}) private column!: any[];
        @Prop({type: Array}) private data!: any[];

        private tableColumnsChecked = this.column.map((item: any) => {
            return item.key;
        });
        private filteredColumns = this.column;
        private isLoading: boolean = false;
        private showedData: any[] = this.data;
        private fullData: any[] = this.data;
        private tempData: any[] = this.data;
        private total: number = this.fullData.length;
        private current: number = 1;
        private selectedSize: number = this.option.pageSizes![0];
        private columnSearchPayload: { [key: string]: any } = {};
        private timer: any;

        @Watch('data', {immediate: true, deep: true})
        private onDataChanged(val: any) {
            this.fullData = val;
            this.tempData = val;
            this.handleData(val);
        }

        @Watch('column', {immediate: true, deep: true})
        private onColumnChanged(val: any[]) {
            this.filteredColumns = val;
            this.tableColumnsChecked = this.column.map((item: any) => {
                return item.key;
            });
        }

        @Watch('pageParams', {deep: true})
        private onPageParamsChange(val: { total: number, currentPage: number }) {
            if (this.option.sync) {
                this.total = val.total || 0;
                this.current = val.currentPage || 1;
            }
        }

        private created() {
            if (this.columnHasFilter()) {
                this.renderColumnSearch();
            }
            this.handleData(this.data);
        }

        private handleGlobalSearch(text: string) {
            if (this.option.sync) {
                return this.onGlobalSearch(text);
            }
            this.isLoading = true;
            // console.log('GlobalSearch', text);
            if (text === '') {
                this.tempData = this.fullData;
                this.isLoading = false;
                return this.handleData(this.tempData);
            }

            this.tempData = this.fullData.filter((row: any) => {
                // console.log("row", row);
                for (const key in row) {
                    // console.log("key", key);
                    if (row.hasOwnProperty(key)) {
                        const content = row[key];
                        // console.log("content", content);
                        if (content.toString().indexOf(text) >= 0) {
                            return true;
                        }
                    }
                }
                return false;
            });

            this.handleData(this.tempData);
            this.isLoading = false;
        }

        private exportData(opt: string) {
            if (this.option.sync) {
                return this.onExportData(opt);
            }
            // console.log('export', opt);
            this.isLoading = true;
            try {
                const el: any = this.$refs.table;
                if (opt === 'origin') {
                    el.exportCsv({
                        filename: 'The original data',
                    });
                } else if (opt === 'current') {
                    el.exportCsv({
                        filename: 'Sorting and filtering data',
                        data: this.showedData,
                    });
                }
                this.$Notice.success({
                    title: '开始下载...',
                });
            } catch (e) {
                console.log(e);
                this.$Notice.error({
                    title: '发生错误...',
                });
            } finally {
                this.isLoading = false;
            }

        }

        private columnHasFilter() {
            for (const item of this.column) {
                if (item.filter) {
                    return true;
                }
            }
            return false;
        }

        private renderColumnSearch() {
            this.isLoading = true;
            for (const item of this.column) {
                let childColumn = {...item};
                delete childColumn.filter;
                let children = [];
                let inputValue: string = '';
                let renderHeader = (h: any) => {
                };
                if (item.filter) {
                    if (item.filter.type === 'select') {
                        renderHeader = (h: any) => {
                            return h('Select', {
                                props: {
                                    clearable: true,
                                    value: null,
                                    placeholder: item.filter.placeholder || '请选择搜索选项',
                                    size: item.filter.size || 'default',
                                    transfer: true,
                                },
                                style: {
                                    width: item.filter.width || null,
                                },
                                on: {
                                    'on-change': (val: string) => {
                                        if (val === undefined) {
                                            val = '';
                                        }
                                        this.handleColumnSearch(val, item);
                                    }
                                }
                            }, this.renderSelectOption(item.filter, h));
                        };
                    } else if (item.filter.type === 'Input') {
                        renderHeader = (h: any) => {
                            return h('Input', {
                                props: {
                                    type: item.filter.stype || 'text',
                                    placeholder: item.filter.placeholder || '请输入搜索内容',
                                    size: item.filter.size || null,
                                },
                                style: {
                                    width: item.filter.width || null,
                                },
                                on: {
                                    'input': (val: string) => {
                                        inputValue = val;
                                        this.handleColumnSearch(val, item);
                                    }
                                }
                            });
                        };
                    }

                    this.$set(childColumn, 'renderHeader', renderHeader);
                    children.push(childColumn);
                    this.$set(item, 'children', children);
                }
            }
            this.isLoading = false;
            // console.log('column', this.column);
        }

        private renderSelectOption(col, h) {
            let optionRender = [];
            if (col.option) {
                const option = col.option;
                for (let i in option) {
                    optionRender.push(h('Option', {
                        props: {
                            value: option[i].value
                        }
                    }, option[i].name));
                }
            }
            return optionRender;
        }

        private fillTableColumns() {
            this.isLoading = true;
            this.filteredColumns = this.column.filter((item: any) => {
                return this.tableColumnsChecked.includes(item.key);
            });
            this.isLoading = false;
        }

        private handleColumnSearch(val: string, column: any) {
            // console.log(val, column);
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.columnSearchPayload[column.key] = val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                if (this.option.sync) {
                    return this.onColumnSearch(this.columnSearchPayload);
                }
                this.isLoading = true;
                this.tempData = this.fullData.filter((row: any) => {
                    for (const key in this.columnSearchPayload) {
                        if (this.columnSearchPayload.hasOwnProperty(key)) {
                            if (row[key].toString().toUpperCase().indexOf(this.columnSearchPayload[key]) < 0) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
                this.handleData(this.tempData);
                this.isLoading = false;
            }, 700);
        }

        private handlePageChange(index: number) {
            // console.log('page', index);
            this.current = index;
            if (this.option.sync) {
                return this.onPageChange(this.current, this.selectedSize);
            }
            this.handleData(this.tempData);
        }

        private handlePageSizeChange(size: number) {
            // console.log('size', size);
            this.selectedSize = size;
            if (this.option.sync) {
                return this.onPageChange(this.current, this.selectedSize);
            }
            this.handleData(this.tempData);
        }

        private initPagetotal(data: any[]) {
            if (this.option.sync) {
                this.total = this.pageParams.total || 0;
            } else {
                this.total = data.length;
            }
        }

        // 处理并且渲染数据
        private handleData(data: any[]) {
            this.initPagetotal(data);
            if (this.option.sync) {
                return this.showedData = this.data;
            }
            this.isLoading = true;
            if (data.length <= this.selectedSize) {
                this.isLoading = false;
                return this.showedData = data;
            }
            this.showedData = data.slice((this.current - 1) * this.selectedSize, this.current * this.selectedSize);
            // console.log('total', this.total);
            this.isLoading = false;
        }

        @Emit()
        private onSelectionChange(selection: any[]) {
            return selection;
        }

        @Emit()
        private onGlobalSearch(payload: string) {
            return payload;
        }

        @Emit()
        private onExportData(opt: string) {
            return opt;
        }

        @Emit()
        private onColumnSearch(payload: any) {
            return payload;
        }

        @Emit()
        private onPageChange(pageNumber: number, pageSize: number) {
            return {pageNumber, pageSize};
        }
    }
</script>

<style lang="less" scoped>
    .bp-table {
        display: block;
    }

    .table-header {
        border: 1px solid #e8e8e8;
        border-bottom: 0;
        background: #fafafa;
        display: flex;
        align-items: center;
        padding: 10px;
        justify-content: space-between;

        .ivu-input-wrapper {
            width: 250px
        }
    }

    .column-list {
        border: 1px solid #e8e8e8;
        border-bottom: 0;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
    }

    .table-footer {
        margin: 10px;
        text-align: center;
    }
</style>

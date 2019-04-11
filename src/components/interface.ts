export interface ListOption<T> {
    rowKey: string; // 唯一键
    sync: boolean; // 是否后端取数据(分页与搜索)
    showColumnFilter?: boolean;
    // action?: boolean;
    pageSize?: number; // 每页显示数量L
    pageSizes?: number[]; // 每页显示数量选项
    exportExcel?: boolean; // 是否显示导出按钮
    disablePagination?: boolean; // 显示分页

    // iview 原生参数
    stripe?: boolean; // 斑马纹
    border?: boolean; // 是否显示纵向边框
}

export interface PageParams {
    total: number; // 总条数
    currentPage: number; // 当前页码
}

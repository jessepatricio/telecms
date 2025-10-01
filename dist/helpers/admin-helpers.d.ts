interface PaginateOptions {
    hash: {
        current: number;
        pages: number;
        abffpid: string;
    };
}
export declare const select: (selected: string, options: any) => string;
export declare const formatDate: (date: any, format: string) => string;
export declare const paginate: (options: PaginateOptions) => string;
declare const _default: {
    select: (selected: string, options: any) => string;
    formatDate: (date: any, format: string) => string;
    paginate: (options: PaginateOptions) => string;
};
export default _default;
//# sourceMappingURL=admin-helpers.d.ts.map
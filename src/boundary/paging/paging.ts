export interface PagingMetaData {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export  interface PagedResponse {
    data: any;
    pagingMetaData: PagingMetaData;
    statusCode: number;
    message: string;
    succeeded: boolean;
}
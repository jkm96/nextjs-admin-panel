export interface PagingMetaData {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export interface PagedResponse<T> {
    data: {
        pagingMetaData: PagingMetaData;
        data: T[];
    };
    statusCode: number;
    message: string;
    succeeded: boolean;
}
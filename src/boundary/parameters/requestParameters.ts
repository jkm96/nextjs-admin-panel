export class RequestParameters {
    private static readonly MaxPageSize: number = 50;
    public pageSize: number;
    public pageNumber: number;
    public orderBy: string | null;

    constructor(pageSize: number = 10, pageNumber: number = 1, orderBy: string | null = null) {
        this.pageSize = pageSize > RequestParameters.MaxPageSize ? RequestParameters.MaxPageSize : pageSize;
        this.pageNumber = pageNumber;
        this.orderBy = orderBy;
    }
}



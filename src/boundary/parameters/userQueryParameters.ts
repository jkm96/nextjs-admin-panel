import {RequestParameters} from "@/boundary/parameters/requestParameters";

export class UserQueryParameters extends RequestParameters {
    public searchTerm: string | null;
    public createdBy: string | null;
    public createdOn: Date | null;
    public periodFrom: Date | null;
    public periodTo: Date | null;

    constructor() {
        super(10, 1, "FirstName desc");
        this.searchTerm = null;
        this.createdBy = null;
        this.createdOn = null;
        this.periodFrom = null;
        this.periodTo = null;
    }
}

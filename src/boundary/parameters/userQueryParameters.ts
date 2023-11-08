import {RequestParameters} from "@/boundary/parameters/requestParameters";

export class UserQueryParameters extends RequestParameters {
    public searchTerm: string;
    public periodFrom: Date | null;
    public periodTo: Date | null;

    constructor() {
        super(10, 1, "createdOn desc");
        this.searchTerm = "";
        this.periodFrom = null;
        this.periodTo = null;
    }
}

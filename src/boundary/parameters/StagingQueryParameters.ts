import {RequestParameters} from "@/boundary/parameters/requestParameters";
import {StagingRecordStatus} from "@/boundary/interfaces/staging";

export class StagingQueryParameters extends RequestParameters {
    public searchTerm: string;
    public action: string | null;
    public status: StagingRecordStatus | null;
    constructor() {
        super(10, 1, "createdOn desc");
        this.searchTerm = "";
        this.status = null;
        this.action = null;
    }
}

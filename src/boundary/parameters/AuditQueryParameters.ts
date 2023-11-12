import {RequestParameters} from "@/boundary/parameters/requestParameters";
import {StagingRecordStatus} from "@/boundary/interfaces/staging";
import {AppAuditType, ApplicationModule} from "@/boundary/interfaces/audit";

export class AuditQueryParameters extends RequestParameters {
    public searchTerm: string;
    public action: string | null;
    public status: StagingRecordStatus | null;
    public auditType: AppAuditType | null;
    public module: ApplicationModule | null;

    constructor() {
        super(10, 1, "createdOn desc");
        this.searchTerm = "";
        this.status = null;
        this.action = null;
        this.auditType = null;
        this.module = null;
    }
}

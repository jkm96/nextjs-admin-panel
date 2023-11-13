import {RequestParameters} from "@/boundary/parameters/requestParameters";
import {StagingRecordStatus} from "@/boundary/interfaces/staging";
import {AppAuditType, ApplicationModule} from "@/boundary/interfaces/audit";

export class AuditQueryParameters extends RequestParameters {
    public searchTerm: string;
    public auditType?: AppAuditType;
    public module?: ApplicationModule;
    public periodFrom?: Date;
    public periodTo?: Date;

    constructor() {
        super(10, 1, "createdOn desc");
        this.searchTerm = "";
    }
}

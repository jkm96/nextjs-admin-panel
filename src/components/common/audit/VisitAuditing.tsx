import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";

export default async function VisitAuditing(page: string) {
    const auditRequest: AuditRecordRequest = {
        AuditType: AppAuditType.Visit,
        Module: ApplicationModule.Logging,
        Comment: "",
        DataAfter: "",
        DataBefore: "",
        Description: `visited ${page}`,
    }

    const response = await addAuditRecord(auditRequest);
    console.log("audit-trails response",response)
    return<></>
}
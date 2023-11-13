import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";

export default async function visitAuditing(page:string) {
    const auditRequest: AuditRecordRequest = {
        auditType: AppAuditType.Visit,
        module: ApplicationModule.Logging,
        comment: "",
        dataAfter: "",
        dataBefore: "",
        description: `visited ${page}`,
    }
    console.log("audit visit", auditRequest)
    const response = await addAuditRecord(auditRequest);
    console.log("audit-trails response", response)
}
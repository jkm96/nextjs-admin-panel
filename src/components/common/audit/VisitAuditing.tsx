import {useEffect} from "react";
import {AppAuditType, ApplicationModule, AuditRecordRequest} from "@/boundary/interfaces/audit";
import {addAuditRecord} from "@/lib/services/audit/auditTrailService";

export default function VisitAuditing({page}: { page: string; }){
    useEffect(() => {
        async function trackPage(page:any) {
            const auditRequest: AuditRecordRequest = {
                auditType: AppAuditType.Visit,
                module: ApplicationModule.Logging,
                comment: "",
                dataAfter: "",
                dataBefore: "",
                description: `visited ${page}`,
            }
            await addAuditRecord(auditRequest);
        }
        trackPage(page);
    }, []);

    return <></>
}
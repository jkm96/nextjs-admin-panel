import {NextRequest} from "next/server";

export function getAuditQueryParams(request: NextRequest) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search);
    const pageSize = searchParams.get('pageSize');
    const pageNumber = searchParams.get('pageNumber');
    const orderBy = searchParams.get('orderBy');
    const searchTerm = searchParams.get('searchTerm');
    const auditType = searchParams.get('auditType');
    const module = searchParams.get('module');
    const periodFrom = searchParams.get('periodFrom');
    const periodTo = searchParams.get('periodTo');

    return {pageSize, pageNumber, orderBy, searchTerm, auditType, module, periodFrom, periodTo};
}

export function getStagingQueryParams(request: NextRequest) {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search);
    const pageSize = searchParams.get('pageSize');
    const pageNumber = searchParams.get('pageNumber');
    const orderBy = searchParams.get('orderBy');
    const searchTerm = searchParams.get('searchTerm');
    const action = searchParams.get('action');
    const status = searchParams.get('status');

    return {pageSize, pageNumber, orderBy, searchTerm, action, status};
}
export enum AppAuditType {
    None = 0,
    Login = 1,
    CreateInitiated = 2,
    CreateApproved = 3,
    CreateDeclined = 4,
    PasswordResetInitiated = 5,
    PasswordResetApproved = 6,
    UpdateInitiated = 7,
    UpdateApproved = 8,
    UpdateDeclined = 9,
    Export = 10,
    Update = 11,
    Visit = 12,
    DeleteInitiated = 13,
    DeleteApproved = 14,
    DeleteDeclined = 15,
    Create = 16,
    SetPassword = 17,
    Delete = 18,
    DeleteFailed = 19,
    PasswordResetDeclined = 20,
}

export enum ApplicationModule {
    None = 0,
    Users = 1,
    Roles = 2,
    Documents = 3,
    GeneralSettings = 4,
    Reports = 5,
    Logging = 6,
}

export interface AuditRecordRequest {
    description: string;
    comment: string;
    dataBefore: string;
    dataAfter: string;
    module: ApplicationModule;
    auditType: AppAuditType;
}

export interface AuditRecordResponse {
    id: number;
    ipAddress: string;
    dataBefore: string;
    dataAfter: string;
    description: string;
    comment: string;
    module: string;
    auditType: string;
    createdBy: string;
    createdOn: Date;
    creatorEmail: string;
    creatorName: string;
}
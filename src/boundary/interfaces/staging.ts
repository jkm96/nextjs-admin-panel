export enum StagingRecordStatus {
    Pending = 1,
    Review = 2,
    Completed = 3,
    Declined = 4,
    Deleted = 5,
    Failed = 6
}

export interface StagingUpsertRequest {
    id: number;
    entity: string;
    dataBefore: string;
    dataAfter: string;
    creator?: string;
    approverId?: string;
    action: string;
    status: StagingRecordStatus;
    comments: string;
}

export interface StagingResponse {
    id: number;
    dateCreated: string;
    dateApproved: string | null;
    lastModifiedOn: string | null;
    entity: string;
    dataBefore: string;
    dataAfter: string;
    creator: string;
    approver: string;
    isActive: boolean;
    action: string;
    status: StagingRecordStatus;
}

export enum AppModules {
    USERS = 'USERS',
    ROLES = 'ROLES',
}

const AppModulesDict = [
    {
        key: "users",
        name: AppModules.USERS,
    },
    {
        key: "roles",
        name: AppModules.ROLES,
    }
];
export {AppModulesDict}
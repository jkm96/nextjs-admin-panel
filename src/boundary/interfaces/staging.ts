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

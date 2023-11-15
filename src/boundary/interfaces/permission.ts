export interface Permission {
    id: number;
    roleId: number | null;
    type: string;
    value: string;
    action: string;
    description: string;
    group: string;
    selected: boolean;
}

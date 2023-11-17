import {Permission} from "@/boundary/interfaces/permission";

export interface RoleResponse {
    id: string;
    name: string;
    description: string;
    createdOn: Date;
}

export interface CreateRoleRequest {
    name: string;
    description: string;
    roleClaims: Permission[];
}
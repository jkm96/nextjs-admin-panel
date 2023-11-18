export interface User{
    id: string;
    name: string;
    email: string;
    isDefaultAdmin:number;
    authToken: string;
}

export interface CreateUserRequest{
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    userRolesList: UserRoleModel[];
}

export interface UpdateUserRequest{
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
}

export interface UserRoleModel {
    roleName: string;
    roleId: string;
    roleDescription: string;
    selected: boolean;
}

export interface UserResponse {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: string;
    emailConfirmed: string;
    phoneNumber: string;
    profilePictureDataUrl: string | null;
    enableEmailOtp: boolean;
    enableSmsOtp: boolean;
    changePasswordOnLogin: boolean;
    createdOn: Date;
    isDeleted: boolean;
}

export interface UpdateUserRolesRequest{
    userId: string;
    userRoles: UserRoleModel[];
}

export interface ToggleUserStatusRequest {
    activateUser: boolean;
    userId: string;
    email: string;
}

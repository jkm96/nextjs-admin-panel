export interface User{
    id: string;
    name: string;
    email: string;
    authToken: string;
}

export interface UserResponse {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    emailConfirmed: boolean;
    phoneNumber: string;
    profilePictureDataUrl: string;
    enableEmailOtp: boolean;
    enableSmsOtp: boolean;
    changePasswordOnLogin: boolean;
    createdOn: Date;
    isDeleted: boolean;
}

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
    isActive: string;
    emailConfirmed: string;
    phoneNumber: string | null;
    profilePictureDataUrl: string | null;
    enableEmailOtp: boolean;
    enableSmsOtp: boolean;
    changePasswordOnLogin: boolean;
    createdOn: Date;
    isDeleted: boolean;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface RegisterUserRequest {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
}

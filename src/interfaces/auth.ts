export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface RegisterUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

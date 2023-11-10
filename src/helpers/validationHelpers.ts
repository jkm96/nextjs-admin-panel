import {LoginUserRequest, RegisterUserRequest} from "@/boundary/interfaces/auth";
import {CreateUserRequest} from "@/boundary/interfaces/user";

export function isEmailValid (email: string): boolean{
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
}

export function validateRegisterFormInputErrors(formData: RegisterUserRequest) {
    const errors:RegisterUserRequest = {
        email: "",   lastName: "",
        firstName: "", password: "",confirmPassword: ""
    }

    if (formData.email.trim() === "") {
        errors.email = "Email cannot be empty";
    } else if (!isEmailValid(formData.email.trim())) {
        errors.email = "Invalid email address";
    }

    if (formData.firstName.trim() === "") {
        errors.firstName = "FirstName cannot be empty";
    } else if (formData.firstName.trim().length < 4) {
        errors.firstName = "FirstName must be at least 4 characters long";
    }

    if (formData.lastName.trim() === "") {
        errors.lastName = "LastName cannot be empty";
    } else if (formData.lastName.trim().length < 4) {
        errors.lastName = "LastName must be at least 4 characters long";
    }

    if (formData.password.trim() === "") {
        errors.password = "Password cannot be empty";
    } else if (formData.password.trim().length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    if (formData.confirmPassword.trim() === "") {
        errors.confirmPassword = "Confirm password cannot be empty";
    } else if (formData.confirmPassword.trim().length < 6) {
        errors.confirmPassword = "Confirm password must be at least 6 characters long";
    } else if (formData.confirmPassword.trim() !== formData.password.trim()) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (errors[key as keyof RegisterUserRequest] !== "") {
            return errors;
        }
    }

    return null;
}

export function validateCreateUserFormInputErrors(createUserFormData: CreateUserRequest) {
    const errors:CreateUserRequest = {
        email: "",   lastName: "",
        firstName: "", userName: ""
    }

    if (createUserFormData.email.trim() === "") {
        errors.email = "Email cannot be empty";
    } else if (!isEmailValid(createUserFormData.email.trim())) {
        errors.email = "Invalid email address";
    }

    if (createUserFormData.firstName.trim() === "") {
        errors.firstName = "FirstName cannot be empty";
    } else if (createUserFormData.firstName.trim().length < 4) {
        errors.firstName = "FirstName must be at least 4 characters long";
    }

    if (createUserFormData.lastName.trim() === "") {
        errors.lastName = "LastName cannot be empty";
    } else if (createUserFormData.lastName.trim().length < 4) {
        errors.lastName = "LastName must be at least 4 characters long";
    }

    if (createUserFormData.userName.trim() === "") {
        errors.userName = "userName cannot be empty";
    } else if (createUserFormData.userName.trim().length < 4) {
        errors.userName = "userName must be at least 4 characters long";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (errors[key as keyof CreateUserRequest] !== "") {
            return errors;
        }
    }

    return null;
}

export function validateLoginFormInputErrors(formData: LoginUserRequest) {
    const errors:LoginUserRequest = {
        email: "",
        password: "",
    }

    if (formData.email.trim() === "") {
        errors.email = "Email cannot be empty";
    } else if (!isEmailValid(formData.email.trim())) {
        errors.email = "Invalid email address";
    }

    if (formData.password.trim() === "") {
        errors.password = "Password cannot be empty";
    } else if (formData.password.trim().length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (errors[key as keyof LoginUserRequest] !== "") {
            return errors;
        }
    }

    return null;
}
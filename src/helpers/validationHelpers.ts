import {LoginUserRequest, RegisterUserRequest} from "@/boundary/interfaces/auth";
import {CreateUserRequest, UpdateUserRequest, UserResponse} from "@/boundary/interfaces/user";
import {CreateRoleRequest, UpdateRoleRequest} from "@/boundary/interfaces/role";

export function isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
}

export function validateRegisterFormInputErrors(formData: RegisterUserRequest) {
    const errors: RegisterUserRequest = {
        email: "", lastName: "",
        firstName: "", password: "", confirmPassword: ""
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
    const errors: CreateUserRequest = {
        userRolesList: [],
        email: "", lastName: "",
        firstName: "", userName: "",
        phoneNumber: ""
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
    } else if (createUserFormData.userName.trim().length < 5) {
        errors.userName = "userName must be at least 4 characters long";
    }

    if (createUserFormData.phoneNumber.trim() === "") {
        errors.phoneNumber = "phoneNumber cannot be empty";
    } else if (createUserFormData.phoneNumber.trim().length < 8 || createUserFormData.phoneNumber.trim().length > 13) {
        errors.phoneNumber = "phoneNumber must be between 8-13 characters long";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (key !== 'userRolesList' && errors[key as keyof CreateUserRequest] !== "") {
            return errors;
        }
    }

    return null;
}

export function validateUpdateUserFormInputErrors(updateUserRequest: UpdateUserRequest) {
    const errors: UpdateUserRequest = {
        userId: "", lastName: "", firstName: "", userName: "", phoneNumber: ""
    }

    if (updateUserRequest.firstName.trim() === "") {
        errors.firstName = "FirstName cannot be empty";
    } else if (updateUserRequest.firstName.trim().length < 4) {
        errors.firstName = "FirstName must be at least 4 characters long";
    }

    if (updateUserRequest.lastName.trim() === "") {
        errors.lastName = "LastName cannot be empty";
    } else if (updateUserRequest.lastName.trim().length < 4) {
        errors.lastName = "LastName must be at least 4 characters long";
    }

    if (updateUserRequest.userName.trim() === "") {
        errors.userName = "userName cannot be empty";
    } else if (updateUserRequest.userName.trim().length < 5) {
        errors.userName = "userName must be at least 4 characters long";
    }

    if (updateUserRequest.phoneNumber.trim() === "") {
        errors.phoneNumber = "Phone Number cannot be empty";
    } else if (updateUserRequest.phoneNumber.trim().length < 8 || updateUserRequest.phoneNumber.trim().length > 13) {
        errors.phoneNumber = "Phone Number must be between 8-13 characters long";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (key !== 'userId' && errors[key as keyof UpdateUserRequest] !== "") {
            return errors;
        }
    }

    return null;
}


export function validateLoginFormInputErrors(formData: LoginUserRequest) {
    const errors: LoginUserRequest = {
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

export function validateCreateRoleFormInputErrors(formData: CreateRoleRequest) {
    const errors: CreateRoleRequest = {
        description: "", name: "", roleClaims: []
    }

    if (formData.name.trim() === "") {
        errors.name = "Role name cannot be empty";
    } else if (formData.name.trim().length < 4) {
        errors.name = "Role name must be at least 4 characters long";
    }

    if (formData.description.trim() === "") {
        errors.description = "Role description cannot be empty";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (key !== 'roleClaims' && errors[key as keyof CreateRoleRequest] !== "") {
            return errors;
        }
    }

    return null;
}

export function validateUpdateRoleFormInputErrors(formData: UpdateRoleRequest) {
    const errors: UpdateRoleRequest = {
        roleId: "",        description: "", name: ""
    }

    if (formData.name.trim() === "") {
        errors.name = "Role name cannot be empty";
    } else if (formData.name.trim().length < 4) {
        errors.name = "Role name must be at least 4 characters long";
    }

    if (formData.description.trim() === "") {
        errors.description = "Role description cannot be empty";
    }

    for (const key in errors) {
        if (key !== 'roleId' && errors[key as keyof UpdateRoleRequest] !== "") {
            return errors;
        }
    }

    return null;
}
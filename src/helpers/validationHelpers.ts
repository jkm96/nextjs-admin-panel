import {LoginUserRequest, RegisterUserRequest} from "@/interfaces/auth";

export function isEmailValid (email: string): boolean{
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
    const regex = /^[0-9]+$/;
    return regex.test(phoneNumber);
}

export function validateRegisterFormInputErrors(formData: RegisterUserRequest) {
    const errors:RegisterUserRequest = {
        lastName: "", phoneNumber: "",
        firstName: "", password: "",
        email: "", userName: ""
    }

    if (formData.email.trim() === "") {
        errors.email = "Email cannot be empty";
    } else if (!isEmailValid(formData.email.trim())) {
        errors.email = "Invalid email address";
    }

    if (formData.userName.trim() === "") {
        errors.userName = "Username cannot be empty";
    } else if (formData.userName.trim().length < 4) {
        errors.userName = "Username must be at least 4 characters long";
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

   if (formData.phoneNumber.trim() !== ""){
       if (formData.phoneNumber.trim().length < 8 || formData.phoneNumber.trim().length > 12) {
           errors.phoneNumber = "Phone number must be between 8 and 12 characters long";
       }else if(!isValidPhoneNumber(formData.phoneNumber.trim())){
           errors.phoneNumber = "Phone number must contain numbers only";
       }
   }

    if (formData.password.trim() === "") {
        errors.password = "Password cannot be empty";
    } else if (formData.password.trim().length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    // Check if there are any errors and return null if all input is valid
    for (const key in errors) {
        if (errors[key as keyof RegisterUserRequest] !== "") {
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
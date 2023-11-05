import Link from "next/link";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {RegisterUserRequest} from "@/interfaces/auth";
import {validateRegisterFormInputErrors} from "@/helpers/validationHelpers";
import {Input} from "@nextui-org/react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {registerUser} from "@/lib/auth/authService";
import {Button} from "@nextui-org/button";

const initialFormState: RegisterUserRequest = {
    lastName: "", phoneNumber: "",
    firstName: "", password: "",
    email: "", userName: ""
};
export default function RegisterForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [backendError, setBackendError] = useState("");
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [registerFormData, setRegisterFormData] = useState(initialFormState);
    const [inputErrors, setInputErrors] = useState({
        lastName: "", phoneNumber: "",
        firstName: "", password: "",
        email: "", userName: ""
    });

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setRegisterFormData({...registerFormData, [name]: value});
    }

    const handleRegisterSubmit = async (e: any) => {
        e.preventDefault();
        setBackendError("");
        setIsSubmitting(true)

        const inputErrors = validateRegisterFormInputErrors(registerFormData);

        if (inputErrors && Object.keys(inputErrors).length > 0) {
            setInputErrors(inputErrors);
            setIsSubmitting(false)
            return;
        }

        if (
            registerFormData.email.trim() === "" ||
            registerFormData.userName.trim() === "" ||
            registerFormData.firstName.trim() === "" ||
            registerFormData.lastName.trim() === "" ||
            registerFormData.password.trim() === ""
        ) {
            setIsSubmitting(false)
            return;
        }

        let response = await registerUser(registerFormData);
        console.log("register response", response)
        if (response.statusCode === 200) {
            setIsSubmitting(false)
            setRegisterFormData(initialFormState)
            router.push('/auth/login')
        } else {
            setIsSubmitting(false)
            setBackendError(response.message ?? "Unknown error occurred");
        }
    };
    return (
        <>
            <div className="grid place-items-center">
                <div className="w-full border-stroke dark:border-strokedark xl:w-1/3">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <div className="text-center">
                            <span className="mb-1.5 block font-medium">Start for free</span>
                            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                Sign Up to Admin Panel
                            </h2>
                        </div>

                        <form onSubmit={handleRegisterSubmit}>
                            <div className="mb-4">
                                <Input type="text"
                                       onChange={handleChange}
                                       value={registerFormData.userName}
                                       label="Username"
                                       name="userName"
                                       variant={"bordered"}
                                       placeholder="Enter your username"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, userName: ""});
                                       }}
                                       isInvalid={inputErrors.userName !== ""}
                                       errorMessage={inputErrors.userName}/>
                            </div>

                            <div className="mb-4">
                                <Input type="email"
                                       onChange={handleChange}
                                       value={registerFormData.email}
                                       label="Email"
                                       name="email"
                                       variant={"bordered"}
                                       placeholder="Enter your email"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, email: ""});
                                       }}
                                       isInvalid={inputErrors.email !== ""}
                                       errorMessage={inputErrors.email}/>
                            </div>

                            <div className="mb-4">
                                <Input type="text"
                                       onChange={handleChange}
                                       value={registerFormData.firstName}
                                       label="FirstName"
                                       name="firstName"
                                       variant={"bordered"}
                                       placeholder="Enter your first name"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, firstName: ""});
                                       }}
                                       isInvalid={inputErrors.firstName !== ""}
                                       errorMessage={inputErrors.firstName}/>
                            </div>

                            <div className="mb-4">
                                <Input type="text"
                                       onChange={handleChange}
                                       value={registerFormData.lastName}
                                       label="LastName"
                                       name="lastName"
                                       variant={"bordered"}
                                       placeholder="Enter your last name"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, lastName: ""});
                                       }}
                                       isInvalid={inputErrors.lastName !== ""}
                                       errorMessage={inputErrors.lastName}/>
                            </div>

                            <div className="mb-4">
                                <Input type="text"
                                       onChange={handleChange}
                                       value={registerFormData.phoneNumber}
                                       label="PhoneNumber"
                                       name="phoneNumber"
                                       variant={"bordered"}
                                       placeholder="Enter your phone number"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, phoneNumber: ""});
                                       }}
                                       isInvalid={inputErrors.phoneNumber !== ""}
                                       errorMessage={inputErrors.phoneNumber}/>
                            </div>

                            <div className="mb-4">
                                <Input type={isVisible ? "text" : "password"}
                                       onChange={handleChange}
                                       value={registerFormData.password}
                                       label="Password"
                                       name="password"
                                       variant="bordered"
                                       placeholder="Enter your password"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, password: ""});
                                       }}
                                       isInvalid={inputErrors.password !== ""}
                                       errorMessage={inputErrors.password}
                                       endContent={
                                           <button className="focus:outline-none" type="button"
                                                   onClick={toggleVisibility}>
                                               {isVisible ? (
                                                   <EyeSlashFilledIcon
                                                       className="text-2xl text-default-400 pointer-events-none"/>
                                               ) : (
                                                   <EyeFilledIcon
                                                       className="text-2xl text-default-400 pointer-events-none"/>
                                               )}
                                           </button>
                                       }
                                />
                            </div>

                            <div className="mb-4">
                                <Input type={isVisible ? "text" : "password"}
                                       onChange={handleChange}
                                       value={registerFormData.password}
                                       label="Password"
                                       name="password"
                                       variant="bordered"
                                       placeholder="Enter your password"
                                       onInput={() => {
                                           setInputErrors({...inputErrors, password: ""});
                                       }}
                                       isInvalid={inputErrors.password !== ""}
                                       errorMessage={inputErrors.password}
                                       endContent={
                                           <button className="focus:outline-none" type="button"
                                                   onClick={toggleVisibility}>
                                               {isVisible ? (
                                                   <EyeSlashFilledIcon
                                                       className="text-2xl text-default-400 pointer-events-none"/>
                                               ) : (
                                                   <EyeFilledIcon
                                                       className="text-2xl text-default-400 pointer-events-none"/>
                                               )}
                                           </button>
                                       }
                                />
                            </div>

                            <div className="mb-5">
                                <Button
                                    type="submit"
                                    value="Create account"
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                >
                                    {isSubmitting ? "Submitting..." : "Create Account"}
                                </Button>
                            </div>

                            <div className="mt-6 text-center">
                                <p>
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="text-primary">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
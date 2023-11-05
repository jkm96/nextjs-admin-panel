"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {validateLoginFormInputErrors} from "@/helpers/validationHelpers";
import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {LoginUserRequest} from "@/interfaces/auth";
import {TokenResponse} from "@/interfaces/token";
import {loginUser} from "@/lib/auth/authService";
import {Input} from "@nextui-org/react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";
import {Button} from "@nextui-org/button";

const initialFormState: LoginUserRequest = {
    email: "", password: ""
};

export default function SignInForm() {
    const {user,storeAuthToken} = useAuth();
    const router = useRouter()
    useEffect(() => {
        if (user){
            router.push("/profile")
        }
    }, [user, router]);

    const [isVisible, setIsVisible] = useState(false);
    const [backendError, setBackendError] = useState("");
    const [inputErrors, setInputErrors] = useState({
        email: "", password: "",
    });
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [loginFormData, setLoginFormData] = useState(initialFormState);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setLoginFormData({...loginFormData, [name]: value});
    }

    const handleLoginSubmit = async (e: any) => {
        e.preventDefault();
        setBackendError("");

        const inputErrors = validateLoginFormInputErrors(loginFormData);

        if (inputErrors && Object.keys(inputErrors).length > 0) {
            setInputErrors(inputErrors);
            return;
        }

        if (
            loginFormData.email.trim() === "" ||
            loginFormData.password.trim() === ""
        ) {
            return;
        }

        let response = await loginUser(loginFormData);
        if (response.statusCode === 200) {
            console.log("login response", response)
            setLoginFormData(initialFormState)
            let responseData: TokenResponse = response.data;
            storeAuthToken(responseData);
            router.push("/profile")
        } else {
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
                                Sign In to Admin Panel
                            </h2>
                        </div>

                        <form onSubmit={handleLoginSubmit}>
                            <div className="flex flex-wrap md:flex-nowrap gap-4 m-2">
                                <Input type="text"
                                       value={loginFormData.email}
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

                            <div className="flex flex-wrap md:flex-nowrap gap-4 m-2">
                                <Input type={isVisible ? "text" : "password"}
                                       onChange={handleChange}
                                       value={loginFormData.password}
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
                                           <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                               {isVisible ? (
                                                   <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                               ) : (
                                                   <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                               )}
                                           </button>
                                       }
                                />
                            </div>

                            <div className="m-2">
                                {backendError && <p className="text-danger">{backendError}</p>}
                            </div>

                            <div className="flex flex-wrap md:flex-nowrap gap-4 m-2">
                                <Button
                                    type="submit"
                                    value="Sign In"
                                    size="lg"
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                >Sign In</Button>
                            </div>

                            <div className="mt-6 text-center">
                                <p>
                                    Don’t have any account?{" "}
                                    <Link href="/auth/signup" className="text-primary">
                                        Sign Up
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
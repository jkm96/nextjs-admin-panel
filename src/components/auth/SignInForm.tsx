import Link from "next/link";
import React from "react";
import EmailSvgIcon from "@/components/shared/icons/EmailSvgIcon";
import PassSvgIcon from "@/components/shared/icons/PassSvgIcon";

export default function SignInForm() {
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

                        <form>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4 top-4"><EmailSvgIcon/></span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="6+ Characters, 1 Capital letter"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4 top-4"><PassSvgIcon/></span>
                                </div>
                            </div>

                            <div className="mb-5">
                                <input
                                    type="submit"
                                    value="Sign In"
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                />
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
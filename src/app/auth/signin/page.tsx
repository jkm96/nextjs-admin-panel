import React from "react";
import { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";
export const metadata: Metadata = {
  title: "Sign in Page | Admin Panel",
  description: "This is Sign in page for Admin Panel",
};

export default function SignIn(){
  return <SignInForm/>;
};

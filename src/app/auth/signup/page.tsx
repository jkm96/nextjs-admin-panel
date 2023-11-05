import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";
export const metadata: Metadata = {
  title: "Sign Up Page | Admin Panel",
  description: "This is Sign Up page for Admin Panel",
};

export default function SignUp(){
  return <SignUpForm/>;
};


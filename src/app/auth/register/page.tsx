"use client";
import React, {useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";
import RegisterForm from "@/components/auth/RegisterForm";
import {RedirectUser} from "@/components/common/RedirectUser";

export default function RegisterPage(){
  const {user,loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  RedirectUser(user,setLoading)

  if (loading || authLoading) {
    return <Loader/>;
  } else if (!user) {
    return <RegisterForm/>;
  } else {
    return null;
  }
};


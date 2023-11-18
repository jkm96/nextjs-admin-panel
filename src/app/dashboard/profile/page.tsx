"use client";
import {useAuth} from "@/hooks/useAuth";
import Loader from "@/components/common/Loader";
import React from "react";
import ProfileSection from "@/components/admin/ProfileSection";
import VisitAuditing from "@/components/common/audit/VisitAuditing";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />;
    } else {
        return(
            <>
                <VisitAuditing page={"dashboard"}/>
                <ProfileSection user={user} />
            </>
        )
    }
}

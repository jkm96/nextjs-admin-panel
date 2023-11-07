"use client";
import "./../globals.css";
import "./data-tables-css.css";
import React, {useState, useEffect} from "react";
import Loader from "@/components/common/Loader";
import Header from "@/components/shared/navs/header/Header";
import Sidebar from "@/components/shared/navs/sidebar/SideBar";
import {useAuth} from "@/hooks/useAuth";
import NotAuthenticated from "@/components/common/auth/NotAuthenticated";

export default function DashboardLayout({children}: { children: React.ReactNode; }) {
    const {user,loading: authLoading} = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading || authLoading) {
        return <Loader/>;
    }

    if (!user) {
        return <NotAuthenticated/>
    }

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
        </div>
    );
}

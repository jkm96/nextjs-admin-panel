import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import SettingsIcon from "@/components/shared/icons/SettingsIcon";
import SidebarOpenIcon from "@/components/shared/icons/SidebarOpenIcon";
import DashboardIcon from "@/components/shared/icons/DashboardIcon";
import ShowMenuList from "@/components/common/ShowMenuList";
import ProfileIcon from "@/components/shared/icons/ProfileIcon";
import FormIcon from "@/components/shared/icons/FormIcon";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
    const pathname = usePathname();

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    let storedSidebarExpanded = "true";
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    // close on click outside
    useEffect(() => {
        const clickHandler = ({target}: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({keyCode}: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document.querySelector("body")?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center gap-2 px-6 mb-0 py-2 lg:py-4">
                <Link href="/dashboard">
                    Admin Panel
                </Link>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden">
                    <SidebarOpenIcon/>
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className=" py-2 px-2 lg:px-4">
                    {/* <!-- Menu Group --> */}
                    {/*<div className="mt-0.5 bg-danger-100">*/}
                    <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                        MENU
                    </h3>

                    <ul className="mb-6 flex flex-col gap-1.5">
                        {/* <!-- Menu Item Dashboard --> */}
                        <SidebarLinkGroup
                            activeCondition={
                                pathname === "/dashboard" || pathname.includes("dashboard")
                            }
                        >
                            {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                        <Link
                                            href="#"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                                (pathname === "/dashboard" ||
                                                    pathname.includes("dashboard")) &&
                                                "bg-graydark dark:bg-meta-4"
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                sidebarExpanded
                                                    ? handleClick()
                                                    : setSidebarExpanded(true);
                                            }}>
                                            <DashboardIcon/>
                                            Dashboard
                                            {ShowMenuList(open)}
                                        </Link>
                                        {/* <!-- Dropdown Menu Start --> */}
                                        <span
                                            className={`translate transform overflow-hidden ${
                                                !open && "hidden"
                                            }`}>
                                                <ul className="mt-2 flex flex-col gap-2.5 pl-6">
                                                    <li>
                                                        <Link
                                                            href="/dashboard"
                                                            className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                                                pathname === "/dashboard" && "text-white"
                                                            } `}>
                                                            Dashboard
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </span>
                                        {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                            }}
                        </SidebarLinkGroup>
                        {/* <!-- Menu Item Dashboard --> */}


                        {/* <!-- Menu Item Account Mngt --> */}
                        <SidebarLinkGroup
                            activeCondition={
                                pathname === "/dashboard/users" || pathname.includes("users")
                            }>
                            {(handleClick, open) => {
                                return (
                                    <React.Fragment>
                                        <Link
                                            href="#"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                                (pathname === "/dashboard/users" ||
                                                    pathname.includes("users")) &&
                                                "bg-graydark dark:bg-meta-4"
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                sidebarExpanded
                                                    ? handleClick()
                                                    : setSidebarExpanded(true);
                                            }}>
                                            <FormIcon/>
                                            Account Management
                                            {ShowMenuList(open)}
                                        </Link>
                                        {/* <!-- Dropdown Menu Start --> */}
                                        <div
                                            className={`translate transform overflow-hidden ${
                                                !open && "hidden"
                                            }`}
                                        >
                                            <ul className="mt-2 flex flex-col gap-2.5 pl-6">
                                                <li>
                                                    <Link
                                                        href="/dashboard/users"
                                                        className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                                            pathname === "/dashboard/users" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                       Users
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href="/dashboard/roles"
                                                        className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                                            pathname === "/dashboard/roles" &&
                                                            "text-white"
                                                        }`}
                                                    >
                                                       Roles
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* <!-- Dropdown Menu End --> */}
                                    </React.Fragment>
                                );
                            }}
                        </SidebarLinkGroup>
                        {/* <!-- Menu Item Account Mngt --> */}

                        {/* <!-- Menu Item Staging Records --> */}
                        <li>
                            <Link
                                href="/dashboard/staging"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                    pathname.includes("settings") &&
                                    "bg-graydark dark:bg-meta-4"
                                }`}
                            >
                                <SettingsIcon/>
                                Staging
                            </Link>
                        </li>
                        {/* <!-- Menu Item Staging Records --> */}

                        {/* <!-- Menu Item Profile --> */}
                        <li>
                            <Link
                                href="/dashboard/profile"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                    pathname.includes("profile") && "bg-graydark dark:bg-meta-4"
                                }`}
                            >
                                <ProfileIcon/>
                                Profile
                            </Link>
                        </li>
                        {/* <!-- Menu Item Profile --> */}

                        {/* <!-- Menu Item Settings --> */}
                        <li>
                            <Link
                                href="/dashboard/settings"
                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                    pathname.includes("settings") &&
                                    "bg-graydark dark:bg-meta-4"
                                }`}
                            >
                                <SettingsIcon/>
                                Settings
                            </Link>
                        </li>
                        {/* <!-- Menu Item Settings --> */}
                    </ul>
                    {/*</div>*/}

                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default Sidebar;

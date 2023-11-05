import {useAuth} from "@/hooks/useAuth";
import {useRouter} from "next/navigation";
import {deleteAccessToken} from "@/lib/token/tokenService";
import LogoutSvgIcon from "@/components/shared/icons/LogoutSvgIcon";

export default function LogoutForm() {
    const {clearAuthToken} = useAuth();
    const router = useRouter();

    async function handleLogout() {
        const response = await deleteAccessToken();
        console.log("delete response", response)
        if (response.statusCode === 200) {
            clearAuthToken();
            router.push("/auth/login")
        }
    }

    return (
        <>
            <button
                type={"submit"} onClick={handleLogout} color="primary"
                className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                <LogoutSvgIcon/>
                Log Out
            </button>
        </>
    );
}
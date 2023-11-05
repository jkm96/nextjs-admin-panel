import {User} from "@/interfaces/user";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export function RedirectUser(user:User|null, setLoading:any) {
    const router = useRouter()
    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            if (user) {
                router.push("/dashboard");
            } else {
                setLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(redirectTimer);
        };
    }, [user, router]);
}
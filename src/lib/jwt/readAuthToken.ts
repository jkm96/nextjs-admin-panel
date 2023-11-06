import {User} from "@/boundary/interfaces/user";
import {jwtDecode} from "jwt-decode";

export function getUserDetails(token: string): User {
    try {
        const decoded = jwtDecode(token) as { UserDetails: string };
        // Access the user details
        const userDetailsString = decoded.UserDetails || "";
        const userDetails = userDetailsString ? JSON.parse(userDetailsString) : {};

        const id = userDetails.Id || "";
        const name = userDetails.Name || "";
        const email = userDetails.Email || "";

        return {
            authToken: token,
            email: email,
            id: id,
            name: name
        };

    } catch (error: any) {
        console.error('JWT decode failed:', error.message);
        throw Error(error.message || "JWT decode failed")
    }
}

export function getUserPackedPermissions(token: string): string {
    try {
        const decoded: any = jwtDecode(token);

        if (decoded && decoded.Permission) {
            return decoded.Permission;
        } else {
            console.error('Permission claim not found in JWT');
            return '';
        }
    } catch (error:any) {
        console.error('JWT decode failed:', error.message);
        throw Error(error.message || "JWT decode failed")
    }
}

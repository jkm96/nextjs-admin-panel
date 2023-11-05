import {createContext} from "react";
import {User} from "@/interfaces/user";
import {TokenResponse} from "@/interfaces/token";

const AuthContextDefaultValue = {
    user: null as User | null,
    storeAuthToken: (tokenData: TokenResponse) => {},
    clearAuthToken: () => {}
};

const AuthContext = createContext<typeof AuthContextDefaultValue>(
    AuthContextDefaultValue
);

export default AuthContext;
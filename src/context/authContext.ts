import {createContext} from "react";
import {User} from "@/boundary/interfaces/user";
import {TokenResponse} from "@/boundary/interfaces/token";

const AuthContextDefaultValue = {
    user: null as User | null,
    loading:true,
    storeAuthToken: (tokenData: TokenResponse) => {},
    clearAuthToken: () => {}
};

const AuthContext = createContext<typeof AuthContextDefaultValue>(
    AuthContextDefaultValue
);

export default AuthContext;
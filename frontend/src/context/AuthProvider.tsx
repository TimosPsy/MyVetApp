import type { LoginFields } from "../schemas/auth.ts";
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie, setCookie } from "../utils/cookies.ts"
import { login } from "../api/auth.ts"; 


type User = {
    id: string;
    username: string;
    capabilities: string[];
}

type JwtPayload = {
    nameid: string;    
    unique_name: string;
    capabilities?: string | string[];
}

type AuthContextProps = {
    isAuthenticated: boolean;
    accessToken: string | null;
    user: User | null;
    loginUser: (fields: LoginFields) => Promise<void>;
    logoutUser: () => void;
    hasCapability: (capability: string) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

function readUserFromToken(token: string | null): User | null {
    if (!token) return null;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        let caps: string[] = [];
        if (decoded.capabilities) {
            caps = Array.isArray(decoded.capabilities) ? decoded.capabilities : [decoded.capabilities];
        }

        return {
            id: decoded.nameid,
            username: decoded.unique_name,
            capabilities: caps,
        };
    } catch {
        return null;
    }
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const cookieAccessToken = getCookie("access_token")

    const [accessToken, setAccessToken] = useState<string | null>(
        () => cookieAccessToken ?? null
    );

    const [user, setUser] = useState<User | null>(
        () => readUserFromToken(cookieAccessToken ?? null)
    );

    const loginUser = async (fields: LoginFields) => {
        const res = await login(fields); 

        setCookie("access_token", res.access_token, {
            expires: 1,
            SameSite: "Lax",
            secure: false,
            path: "/",
        });
        
        setAccessToken(res.access_token);
        setUser(readUserFromToken(res.access_token));
    }

    const logoutUser = () => {
        deleteCookie("access_token");
        setAccessToken(null);
        setUser(null);
    }

    const hasCapability = (capability: string): boolean => {
        return user?.capabilities.includes(capability) || false;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken,
                accessToken,
                user,
                loginUser,
                logoutUser,
                hasCapability,
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}


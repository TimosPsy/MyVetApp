import type { LoginFields } from "../schemas/auth.ts";
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie, setCookie } from "../utils/cookies.ts"
import { login } from "../api/auth.ts"; 
import { type User} from "../types/user.ts"


type JwtPayload = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    capability: string | string[];
    ownerId?: string;
    exp?: number;
    iss?: string;
    aud?: string;
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

export function readUserFromToken(token: string | null | undefined): User | null {
    if (!token) return null;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        let caps: string[] = [];
        if (decoded.capability) {
            caps = Array.isArray(decoded.capability) ? decoded.capability : [decoded.capability];
        }

        return {
            id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            capabilities: caps,
            ownerId: decoded.ownerId ? Number(decoded.ownerId) : null
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

        setCookie("access_token", res.token, {
            expires: 1,
            SameSite: "Lax",
            secure: false,
            path: "/",
        });
        
        setAccessToken(res.token);
        setUser(readUserFromToken(res.token));
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


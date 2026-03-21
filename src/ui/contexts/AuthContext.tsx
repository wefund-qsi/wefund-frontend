import { createContext, useState, type ReactNode } from "react";
import type { JwtPayload } from "../../domain/auth/entities/auth";

const SESSION_KEY = "wefund_session";

export interface AuthContextValue {
    currentUser: JwtPayload | null;
    setCurrentUser: (user: JwtPayload | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUserState] = useState<JwtPayload | null>(() => {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return null;
        try {
            return JSON.parse(stored) as JwtPayload;
        } catch {
            return null;
        }
    });

    const setCurrentUser = (user: JwtPayload | null) => {
        setCurrentUserState(user);
        if (user) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('wefund_token');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };

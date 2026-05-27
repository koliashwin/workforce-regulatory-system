import React, { createContext, useContext, useEffect, useState } from "react"
import {decodeToken} from '../utils/decodeToken';

const AuthContext = createContext();

const getStoredUser = () => {
    try {
        const stored = localStorage.getItem('user');
        if (!stored) return null;
        
        const parsed = JSON.parse(stored);

        // decode & check expiry
        const decoded = decodeToken(parsed.access_token);
        if (!decoded?.exp) return null;

        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
            localStorage.removeItem('user');
            return null
        }
        return parsed;
    } catch (error) {
        localStorage.removeItem('user');
        return null;
    }
}

export const AuthProvider = ({children}) => {
    
    // check the browser's storage if user exits then store it in state variable
    const [user, setUser] = useState(() => getStoredUser());

    // Create User and store it in browser's localStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // console.log(userData);
    };

    // Remove User form browser's localStorage, clear the state variable
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
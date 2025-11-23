import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    
    // check the browser's storage if user exits then store it in state variable
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

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

export const useAuth = () => useContext(AuthContext);
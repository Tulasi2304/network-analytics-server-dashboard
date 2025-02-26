import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export function UserProvider({ children }) {
    
    const [user,setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("token");
            if (!token) {
                console.error("No token found in cookies");
                return;
            }

            try {
                const response = await fetch("http://localhost:8081/auth/user", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Authorization": `Bearer ${token}` },
                });

                if (!response.ok) {
                    console.error("Failed to fetch user:", response.statusText);
                    throw new Error("Unauthorized");
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
       setUser(null);
    };

    return (
        <UserContext.Provider value={{ user,setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => useContext(UserContext);
// import { useState, useEffect, createContext, useContext } from 'react';
// import { fakeAuth } from '../utils/auth';

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const isAuthenticated = fakeAuth.checkAuth();
//     if (isAuthenticated) {
//       setUser(fakeAuth.user);
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const userData = await fakeAuth.login(email, password);
//       setUser(userData);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signup = async (email: string, password: string, name: string) => {
//     setIsLoading(true);
//     try {
//       const userData = await fakeAuth.signup(email, password, name);
//       setUser(userData);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await fakeAuth.logout();
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value = {
//     user,
//     login,
//     signup,
//     logout,
//     isLoading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }



import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const res = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) throw new Error(data.message);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    const res = await fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) throw new Error(data.message);

    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

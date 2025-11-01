"use client";
import { createContext, useContext, ReactNode } from "react";

type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  is_email_verifed?: boolean;
} | null;

const UserContext = createContext<User>(null);

type UserProviderProps = {
  user: User;
  children: ReactNode;
};

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);

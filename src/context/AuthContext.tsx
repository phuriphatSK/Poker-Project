/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from "react";
import { UserType } from "./AuthContext/AuthContext.interface";

interface AuthContext {
  loginAsJira: (name: string, jiraToken: string) => void;
  loginAsGuest: (name: string, guestToken: string) => void;
  user: UserType | null;
}

// Function to get cookie value
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return match ? decodeURIComponent(match[1]) : null;
};

// Function to set cookie value
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType | null>(null);

  // ฟังก์ชันดึง token จาก URL และบันทึกลง Cookie
  const extractTokenFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setCookie("accessToken", token, 1);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // โหลดข้อมูลผู้ใช้ถ้ามี token
  useEffect(() => {
    extractTokenFromURL();

    const storedToken = getCookie("accessToken");
    if (storedToken) {
      setUser({ name: "Jira User", type: "Jira" });
    }
  }, []);

  // ใช้ useMemo เพื่อให้การคำนวณ isJiraUser ไม่ทำซ้ำทุกครั้ง
  const isJiraUser = useMemo(() => {
    return user?.type === "Jira" && !!getCookie("accessToken");
  }, [user]);

  // ฟังก์ชันเข้าสู่ระบบเป็น Jira
  const loginAsJira = (name: string, jiraToken: string) => {
    if (!jiraToken) {
      console.error("Jira token is required.");
      return;
    }

    setCookie("accessToken", jiraToken, 1);
    setUser({ name, type: "Jira" });
  };

  // ฟังก์ชันเข้าสู่ระบบเป็น Guest
  const loginAsGuest = (name: string, guestToken: string) => {
    if (isJiraUser) {
      console.log("User is already logged in as Jira. Skipping guest login.");
      return;
    }

    if (!guestToken) {
      console.error("Guest token is required.");
      return;
    }

    setCookie("accessToken", guestToken, 1);
    setUser({ name, type: "Guest" });
  };

  return (
    <AuthContext.Provider value={{ loginAsJira, loginAsGuest, user }}>
      {children}
    </AuthContext.Provider>
  );
};

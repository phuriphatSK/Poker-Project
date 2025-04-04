import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { GiPokerHand } from "react-icons/gi";

import Login from "../feature/Login/index";
import { fetchUserInfo } from "../feature/Login/api";
import { useQuery } from "@tanstack/react-query";
import { PopupProfile } from "../feature/Room/components/PopupProfile";
import { cn } from "../lib/utils";

// ฟังก์ชันสำหรับดึงค่าคุกกี้จาก document.cookie
function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value); // แปลงค่าให้สามารถอ่านได้
    }
  }
  return null;
}

export default function Navbar({ className }: { className?: string }) {
  const { data: userData } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: fetchUserInfo,
    staleTime: 5000,
    retry: 2,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie("accessToken")); // ตรวจสอบ accessToken

  useEffect(() => {
    setIsLoggedIn(!!getCookie("accessToken")); // อัปเดตสถานะเมื่อ Cookie เปลี่ยน
  }, [userData]);

  return (
    <nav
      className={cn(
        "flex justify-between w-full  bg-[#5A378C] p-1 relative",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center justify-between text-white w-full">
        <div className="flex items-center gap-4 text-5xl px-5">
          <GiPokerHand />
          <Link to="/" className="text-xl font-medium no-underline text-white">
            Swift Poker
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex text-white font-semibold">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="max-sm:hidden max-md:hidden">
                {userData?.displayName}
              </div>
              <PopupProfile avatarUrl={userData?.avatarUrl ?? undefined} />
            </div>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </nav>
  );
}

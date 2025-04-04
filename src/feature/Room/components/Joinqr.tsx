import React, { useState } from "react";
import { Button, Input, Switch } from "antd";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useGuestJoinRoom } from "../../Login/hooks/useQueryLogin";
import { RoomParticipantRole } from "../types/room.interface";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../../Login/api";

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

const JoinQR: React.FC = () => {
  const { roomId } = useParams({ from: "/joinqr/$roomId" });
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const { loginAsGuest, user } = useAuth();

  const userJoin = useGuestJoinRoom();

  const { data: userData } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: fetchUserInfo,
    staleTime: 5000,
    retry: 2,
  });

  const handleJoinRoom = () => {
    const isJiraLoggedIn = getCookie("accessToken") && user?.type === "Jira";

    userJoin.mutate(
      {
        displayName,
        role: isSpectator
          ? RoomParticipantRole.Inspector
          : RoomParticipantRole.Participator,
      },
      {
        onSuccess: (data) => {
          if (!isJiraLoggedIn) {
            setCookie("accessToken", data.accessToken, 1);

            loginAsGuest(displayName, data.accessToken);
          }

          navigate({
            to: `/room/${roomId}`, // ✅ ใช้ roomId ที่ได้จาก useParams()
            search: {
              role: isSpectator
                ? RoomParticipantRole.Inspector
                : RoomParticipantRole.Participator,
            },
          });
        },
        onError: (error) => {
          console.error("join room error:", error);
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[calc(100vh-60px)] gap-6 p-6 bg-[#F5F1FA]">
      <div className="flex flex-col justify-start p-4 lg:p-16 gap-4 max-sm:gap-0">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-4xl font-semibold text-[#5A378C]">
            Join a Room
          </h1>
          <p className="text-[#333333] mt-4 lg:mt-8 font-bold max-sm:font-semibold max-sm:text-sm">
            Find the room id and create name in room details
          </p>
        </div>
        <div className="max-sm:hidden max-lg:hidden">
          <img src="/join.png" alt="JoinRoom" />
        </div>
      </div>

      <div className="flex flex-col justify-start p-4 lg:p-16 gap-6 max-sm:mb-40 max-md:mb-40 max-lg:mb-40">
        <div className="flex flex-col justify-start p-4 lg:p-16 gap-6 bg-white border-[#E0E0E0] rounded-3xl shadow-lg max-md:py-20 max-lg:py-20">
          <h1 className="text-lg lg:text-xl font-semibold">Room ID</h1>
          <Input
            placeholder="Enter Room ID ..."
            value={roomId}
            disabled
            className="w-full h-10 lg:h-11 border-[#5A378C] text-center"
          />
          <h1 className="text-lg lg:text-xl font-semibold">Display name</h1>
          <Input
            placeholder="Enter your display name ..."
            value={userData?.displayName || displayName}
            disabled={!!userData?.displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full h-11 border-[#5A378C]"
          />
          <div className="flex justify-between items-center">
            <p className="font-semibold">Spectator Mode</p>
            <Switch onChange={setIsSpectator} className="bg-white shadow-lg" />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              htmlType="submit"
              onClick={handleJoinRoom}
              className="p-6 bg-[#5A378C] text-white font-semibold rounded-xl"
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinQR;

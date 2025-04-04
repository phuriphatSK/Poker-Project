import { useSocket } from "socket.io-react-hook";
import { RoomParticipantRole } from "../feature/Room/types/room.interface";
import { useMemo } from "react";

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

// Function to get cookie value
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return match ? decodeURIComponent(match[1]) : null;
};

export const useAuthenticatedSocket = (
  namespace: "/poker",
  query: { roomId: string; role?: RoomParticipantRole }
) => {
  const accessToken = useMemo(() => getCookie("accessToken"), []);

  return useSocket(SERVER_URL + namespace, {
    auth: { accessToken },
    query,
    addTrailingSlash: true,
    enabled: !!accessToken,
    reconnectionAttempts: Infinity, // ลองเชื่อมต่อใหม่ไม่จำกัดจำนวน
    reconnectionDelay: 5000, // หน่วงเวลาในการเชื่อมต่อใหม่ (5 วินาที)
    timeout: 10000, // ถ้าเชื่อมต่อไม่สำเร็จใน 10 วินาทีจะยกเลิก
  });
};

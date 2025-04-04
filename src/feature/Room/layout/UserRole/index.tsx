import { TabsUser } from "../../components/Tabs";
import Timer from "../../components/Timer";
import { useSocketEvent } from "socket.io-react-hook";
import { RoomParticipantRole } from "../../types/room.interface";
import { useCallback, useEffect, useMemo } from "react";

import { UserEvent, UserWithVote } from "../../types/user.interface";
import { useRoomContext } from "../../../../hooks/useRoomContext";
import { useUserContext } from "../../../../hooks/useUserContext";
import { useIssuesContext } from "../../../../hooks/useIssuesContext";
import { useVoteContext } from "../../../../hooks/useVoteContext";
import { useQueryClient } from "@tanstack/react-query";
import { EventNamespace } from "../../types/events";

export const UserRole = () => {
  const queryClient = useQueryClient();
  const { socket, setRoom, resetRoom } = useRoomContext();
  const {
    setInspector,
    setAllUsers,
    resetUsers,
    currentParicipant,
    allParticipants,
  } = useUserContext();
  const { setIssues } = useIssuesContext();
  const { setSelectedCard } = useVoteContext();

  useEffect(() => {
    if (socket.disconnected) {
      resetRoom();
      resetUsers();
    }
  }, [resetRoom, resetUsers, socket.disconnected]);

  const totalUsers = useMemo(
    () => allParticipants.length + 1, // + me
    [allParticipants.length]
  );

  const addUser = useCallback(
    (newUser: UserWithVote) => {
      if (!newUser.id) return;

      // ตรวจสอบว่าไม่เกิน 16 คน
      if (totalUsers >= 16) return;

      setAllUsers((prev) => [...prev, newUser]);
    },
    [setAllUsers, totalUsers]
  );

  //removeUser
  const removeUser = useCallback(
    (removedUser: UserWithVote) => {
      const id = removedUser.id;

      // ลบผู้ใช้ออก
      setAllUsers((prev) => prev.filter((user) => user.id !== id));
    },
    [setAllUsers]
  );

  useSocketEvent(socket, EventNamespace.Exception, {
    onMessage(data) {
      console.log("Exception Event Triggered:", data);
    },
  });

  useSocketEvent(socket, EventNamespace.User, {
    onMessage({ type, data }: UserEvent) {
      if (type === "init") {
        console.log("onInit", data);
        setRoom(data.room);
        setIssues(data.issues);

        const room = data.room;
        if (room.participants && currentParicipant) {
          const anotherParticipants = room.participants.filter(
            (participant) => participant.user.id !== currentParicipant.id
          );

          // 🔥 สร้าง Map ของคะแนนโหวต 🔥
          const voteMap = new Map<string, string>();

          if (data.voteSession?.votes) {
            data.voteSession.votes.forEach((vote) => {
              if (vote.createdBy) {
                voteMap.set(String(vote.createdBy), vote.point); // ใช้ String() แปลงให้เป็น key ที่ถูกต้อง
              }
            });
          }

          // 🔥 อัปเดตสถานะผู้ใช้ตามข้อมูลโหวต 🔥
          anotherParticipants.forEach((participant) => {
            console.log("add.participant", participant);

            const isVoting = voteMap.has(String(participant.user.id)); // ตรวจสอบว่ากำลังโหวตอยู่
            const selectedCard = isVoting
              ? voteMap.get(String(participant.user.id))
              : null; // ถ้ากำลังโหวต ให้ดึงค่าจาก voteMap

            addUser({
              ...participant.user,
              isVoting, // เช็คสถานะการโหวต
              selectedCard, // การ์ดที่เลือก
            });
          });

          queryClient.setQueryData(
            ["me"],
            (prevMe: UserWithVote | undefined) => {
              const isVoting = voteMap.has(String(prevMe?.id)); // ตรวจสอบว่ากำลังโหวตอยู่
              const selectedCard = isVoting
                ? voteMap.get(String(prevMe?.id))
                : null; // ถ้ากำลังโหวต ให้ดึงค่าจาก voteMap
              return {
                ...prevMe,
                isVoting,
                selectedCard,
              };
            }
          );

          // ✅ ตรวจสอบผู้ใช้ปัจจุบัน (currentParticipant) และอัปเดต selectedCard
          if (voteMap.has(String(currentParicipant.id))) {
            // currentParticipant ที่มีการเลือกการ์ดไว้แล้ว
            const selectedCard = voteMap.get(String(currentParicipant.id));
            setSelectedCard(selectedCard ?? null); // ถ้ามี setSelectedCard อยู่ในที่นี้
          } else {
            // ถ้าไม่มีการเลือกการ์ด
            setSelectedCard(null);
          }

          // 🔥 กรอง Inspector 🔥
          const inspectors = room.participants
            .filter(
              (participant) =>
                participant.role === RoomParticipantRole.Inspector
            )
            .map((inspector) => inspector.user);

          setInspector((prev) => [...prev, ...inspectors]);
        }
      } else if (type === "join") {
        console.log("onJoin", data);

        // เช็คการโหวตสำหรับผู้ใช้ที่เข้าร่วมใหม่
        const isVoting = !!data.vote;
        if (data.role === RoomParticipantRole.Inspector) {
          setInspector((prev) => [...prev, data.user]);
        }

        const newUser = {
          ...data.user,
          isVoting: isVoting ?? false, // ตั้งค่า isVoting
          selectedCard: null, // ตั้งค่า selectedCard
        };

        addUser(newUser); // เพิ่มผู้ใช้เข้าระบบ
      } else if (type === "leave") {
        console.log("User Leave", data);

        removeUser({ ...data.user, isVoting: false, selectedCard: null });
        setInspector((prev) =>
          prev.filter((inspector) => inspector.id !== data.user.id)
        );
      }
    },
  });

  return (
    <div className="col-span-2 p-10 w-11/12 max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
      <div className="flex flex-col gap-5 sm:hidden lg:flex md:flex max-sm:hidden">
        <Timer />
        <TabsUser />
      </div>
    </div>
  );
};

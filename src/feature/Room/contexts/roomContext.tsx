/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState } from "react";

import { useAuthenticatedSocket } from "../../../hooks/useAuthenticatedSocket";
import { useParams, useSearch } from "@tanstack/react-router";

import { Room, RoomParticipantRole, StoryPoint } from "../types/room.interface";
import { useMe } from "../../../hooks/useMe";

interface RoomContext {
  selectedMenu: StoryPoint | null;
  setSelectedMenu: React.Dispatch<React.SetStateAction<StoryPoint | null>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  role: RoomParticipantRole | undefined;
  socket: ReturnType<typeof useAuthenticatedSocket>["socket"];
  room: Room | null;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  isHost: boolean;
  resetRoom: () => void;
}

export const RoomContext = createContext<RoomContext | null>(null);
export const RoomContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { roomId } = useParams({
    from: "/room/$roomId",
  });
  const me = useMe();
  const { role } = useSearch({ from: "/room/$roomId" });
  const { socket } = useAuthenticatedSocket("/poker", { roomId, role });

  //useState
  const [room, setRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<StoryPoint | null>(null);

  const isHost = useMemo(() => {
    return me.data?.id === room?.createdBy?.id;
  }, [me.data, room?.createdBy]);

  const resetRoom = useCallback(() => {
    setRoom(null);
    setSelectedMenu(null);
  }, [setRoom, setSelectedMenu]);

  return (
    <RoomContext.Provider
      value={{
        isHost,
        selectedMenu,
        setSelectedMenu,
        isModalOpen,
        setIsModalOpen,
        socket,
        roomId,
        role,
        room,
        setRoom,
        resetRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

import { useContext } from "react";
import { RoomContext } from "../feature/Room/contexts/roomContext";

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
};

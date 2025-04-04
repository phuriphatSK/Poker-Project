import { useContext } from "react";
import { UserContext } from "../feature/Room/contexts/userContext";

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
};

import { useContext } from "react";
import { VoteContext } from "../feature/Room/contexts/voteContext";

export const useVoteContext = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
};

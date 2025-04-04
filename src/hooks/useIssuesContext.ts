import { useContext } from "react";
import { IssuesContext } from "../feature/Room/contexts/issuesContext";

export const useIssuesContext = () => {
  const context = useContext(IssuesContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
};

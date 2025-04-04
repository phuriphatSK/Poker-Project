import { useContext } from "react";
import { PopoverIssuesContext } from "../feature/Room/components/popoverissuemobile/contexts/popoverissuesContext";

export const usePopoverIssuesContext = () => {
  const context = useContext(PopoverIssuesContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
};

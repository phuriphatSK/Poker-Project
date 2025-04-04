/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState } from "react";
import { useMe } from "../../../hooks/useMe";
import { User, UserWithVote } from "../types/user.interface";
import { useSearch } from "@tanstack/react-router";
import { RoomParticipantRole } from "../types/room.interface";

interface UserContext {
  me: User;
  allParticipants: UserWithVote[];
  currentParicipant: UserWithVote & {
    role?: RoomParticipantRole;
    isInspector?: boolean;
  };
  inspectors: User[];
  allUsers: UserWithVote[];
  setAllUsers: React.Dispatch<React.SetStateAction<UserWithVote[]>>;
  top: UserWithVote[];
  bottom: UserWithVote[];
  right: UserWithVote[];
  left: UserWithVote[];
  setInspector: React.Dispatch<React.SetStateAction<User[]>>;
  resetUsers: () => void;
}

export const UserContext = createContext<UserContext | null>(null);
export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { role } = useSearch({ from: "/room/$roomId" });
  const { data: me } = useMe();

  const [allUsers, setAllUsers] = useState<UserWithVote[]>([]);

  const top = useMemo(() => {
    return allUsers.filter((user, index) => {
      if (index >= 14) return true;
      if (user.id === me.id) return true;
      return index % 2 === 0;
    });
  }, [allUsers, me.id]);

  const bottom = useMemo(() => {
    return allUsers.filter((user, index) => {
      if (index >= 14) return true;
      if (user.id === me.id) return false;
      return index % 2 !== 0;
    });
  }, [allUsers, me.id]);

  const left = useMemo<UserWithVote[]>(() => {
    if (allUsers.length === 15) {
      return [allUsers[14]];
    }
    return [];
  }, [allUsers]);

  const right = useMemo<UserWithVote[]>(() => {
    if (allUsers.length === 16) {
      return [allUsers[15]];
    }
    return [];
  }, [allUsers]);

  const [inspectors, setInspector] = useState<User[]>([]);

  const currentParicipant = useMemo(
    () => ({
      ...me,
      role,
      isInspector: role === RoomParticipantRole.Inspector,
    }),
    [me, role]
  );

  const allParticipants = useMemo(
    () => [currentParicipant, ...top, ...bottom, ...right, ...left],
    [bottom, left, right, top, currentParicipant]
  );

  const resetUsers = useCallback(() => {
    setAllUsers([]);
  }, [setAllUsers]);

  return (
    <UserContext.Provider
      value={{
        allParticipants,
        currentParicipant,
        inspectors,
        setInspector,
        allUsers,
        setAllUsers,
        me,
        top,
        bottom,
        right,
        left,
        resetUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

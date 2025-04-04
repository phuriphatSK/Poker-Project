import { useSuspenseQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axiosInstance";
import { User, UserWithVote } from "../feature/Room/types/user.interface";

async function getMe(): Promise<UserWithVote> {
  const response = await axiosInstance.get<User>("/api/users/profile");
  return {
    ...response.data,
    isVoting: false,
    selectedCard: null,
  };
}

export function useMe() {
  return useSuspenseQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: 2,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRoom } from "../api";
import { updateDisplayName } from "../../Login/api";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: CreateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomInfo"] });
      console.log("create room successful");
    },
    onError: (error) => {
      console.error("Error during create:", error);
    },
  });

  return mutation;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDisplayName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UsernameInfo"] });
      console.log("Update displayName successful");
    },
    onError: (error) => {
      console.error("Error during update:", error);
    },
  });
};

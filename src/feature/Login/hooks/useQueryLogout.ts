import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userlogout } from "../api";

export const useUserLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: userlogout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UserLogoutInfo"] });
      console.log("login successful");
    },
    onError: (error) => {
      console.error("Error during logout:", error);
    },
  });

  return mutation;
};

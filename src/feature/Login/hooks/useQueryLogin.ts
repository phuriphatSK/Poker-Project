import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guestLogin } from "../api";

export const useGuestJoinRoom = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: guestLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestUserInfo"] });
      console.log("login successful");
    },
    onError: (error) => {
      console.error("Error during login:", error);
    },
  });

  return mutation;
};

// export const useJiraUserJoinRoom = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: fetchJiraUserInfo,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["jiraUserInfo"] });
//       console.log("login successful");
//     },
//     onError: (error) => {
//       console.error("Error during login:", error);
//     },
//   });

//   return mutation;
// };

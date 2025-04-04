import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIssuseJira } from "../api";

export const useBulkIssues = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateIssuseJira"],
    mutationFn: updateIssuseJira,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["updateIssuseJira"] });
      console.log("Update issue Jira successful:", data);
    },
    onError: (error) => {
      console.error("Error during updateIssuseJira:", error);
    },
  });

  return mutation;
};

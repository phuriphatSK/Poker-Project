import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectsJira } from "../api";

export const useGetProjectJira = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["projectJira"],
    mutationFn: getProjectsJira,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projectJira"] });
      console.log("get project jira successful", data);
    },
    onError: (error) => {
      console.error("Error during get projects:", error);
    },
    retry: 2,
  });

  return mutation;
};

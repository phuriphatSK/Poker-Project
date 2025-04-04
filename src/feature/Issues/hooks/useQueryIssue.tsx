import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIssues, fetchIssues } from "../api";

export const useGetIssues = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ["issueInfo"],
    queryFn: () => fetchIssues(id),
    staleTime: 5000,
    retry: 2,
  });

  return query;
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createIssues,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issueCreateInfo"] });
      console.log("create issue successful");
    },
    onError: (error) => {
      console.error("Error during create issue:", error);
    },
  });

  return mutation;
};

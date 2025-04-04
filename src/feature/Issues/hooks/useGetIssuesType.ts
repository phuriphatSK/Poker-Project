import { useQuery } from "@tanstack/react-query";
import { getIssuestype } from "../api";
import { filterIssue } from "../../Room/types/issues.interface";

export const useGetIssuestype = ({
  param,
  projectId,
}: {
  param?: filterIssue;
  projectId: string | null;
}) => {
  const query = useQuery({
    queryKey: ["issuetype", param, projectId],
    queryFn: () =>
      getIssuestype(projectId, {
        ...param,
      }),
    staleTime: Infinity,
    enabled: !!projectId,
    retry: 2,
  });

  return query;
};

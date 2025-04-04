import { filterIssue } from "../../Room/types/issues.interface";
import { getJiraStatus } from "../api";
import { useQuery } from "@tanstack/react-query";

export const useGetJiraStatus = ({
  param,
  projectId,
}: {
  param?: filterIssue;
  projectId: string | null;
}) => {
  const query = useQuery({
    queryKey: ["statusJira", param, projectId],
    queryFn: () => getJiraStatus({ ...param, projectId: projectId }),
    staleTime: Infinity,
    enabled: !!projectId,
    retry: 2,
  });

  return query;
};

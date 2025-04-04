import { useQuery } from "@tanstack/react-query";
import { filterIssue, Pagination } from "../../Room/types/issues.interface";
import { getIssuesJira } from "../api";

export const useGetIssuesJira = ({
  params,
  pagination,
  nextPageToken,
}: {
  params: filterIssue;
  nextPageToken?: string | null;
  pagination: Pagination;
}) => {
  const query = useQuery({
    queryKey: ["issuesJira", params, pagination],
    queryFn: () => getIssuesJira({ ...params, nextPageToken }),
    staleTime: Infinity,
    retry: 1,
  });
  return query;
};

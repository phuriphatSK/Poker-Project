/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { Issue } from "../../Issues/types/issues";
import {
  filterIssue,
  GetFieldConfigResponse,
  getIssuesResponse,
  Issuetype,
  Pagination,
  Project,
  Value,
} from "../types/issues.interface";
import { useGetIssuesJira } from "../../Issues/hooks/useGetIssuesJira";

interface IssuesContext {
  nextPageToken: string | null;
  updatedIssues: Set<number>;
  setUpdatedIssues: React.Dispatch<React.SetStateAction<Set<number>>>;
  type: Issuetype[];
  setType: React.Dispatch<React.SetStateAction<Issuetype[]>>;
  status: Value[];
  fieldConfig: GetFieldConfigResponse[];
  projects: Project[];
  issues: Issue[];
  currentActionIssue: Issue | null;
  filterIssues: filterIssue;
  pagination: Pagination;
  issueData: getIssuesResponse | undefined;
  isFetchingIssue: boolean;
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setCurrentActionIssue: React.Dispatch<React.SetStateAction<Issue | null>>;
  setFilterIssues: React.Dispatch<React.SetStateAction<filterIssue>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  setNextPageToken: React.Dispatch<React.SetStateAction<string | null>>;
  setFieldConfig: React.Dispatch<
    React.SetStateAction<GetFieldConfigResponse[]>
  >;
  setStatus: React.Dispatch<React.SetStateAction<Value[]>>;
}

export const IssuesContext = createContext<IssuesContext | null>(null);
export const IssuesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentActionIssue, setCurrentActionIssue] = useState<Issue | null>(
    null
  );

  const [status, setStatus] = useState<Value[]>([]);
  const [type, setType] = useState<Issuetype[]>([]);
  const [fieldConfig, setFieldConfig] = useState<GetFieldConfigResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterIssues, setFilterIssues] = useState<filterIssue>({
    project: null,
    issueType: null,
    status: null,
  });
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
  });

  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const { data: issueData, isFetching: isFetchingIssue } = useGetIssuesJira({
    pagination,
    params: filterIssues,
    nextPageToken,
  });

  const [updatedIssues, setUpdatedIssues] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (issueData?.nextPageToken) {
      setNextPageToken(issueData?.nextPageToken);
    }
  }, [issueData?.nextPageToken, setNextPageToken]);

  return (
    <IssuesContext.Provider
      value={{
        nextPageToken,
        updatedIssues,
        setUpdatedIssues,
        type,
        setType,
        status,
        setStatus,
        fieldConfig,
        setFieldConfig,
        setNextPageToken,
        issueData,
        isFetchingIssue,
        pagination,
        setPagination,
        filterIssues,
        setFilterIssues,
        projects,
        setProjects,
        currentActionIssue,
        setCurrentActionIssue,
        issues,
        setIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

import axiosInstance from "../../lib/axiosInstance";
import {
  BulkIssue,
  GetFieldConfigResponse,
  getIssuesResponse,
  GetIssuetypeResponse,
  getJiraStatusResponse,
  getProjectResponse,
} from "../Room/types/issues.interface";
import { CreateIssue, Issue } from "./types/issues";
import qs from "qs";

// Get All Issues
export const getProjectsJira = async () => {
  const response =
    await axiosInstance.get<getProjectResponse>("/api/jira/projects");
  return response.data;
};

export const getIssuesJira = async (params: Record<string, unknown>) => {
  if (!params.project) return { issues: [] };
  const response = await axiosInstance.get<getIssuesResponse>(
    "/api/jira/issues",
    {
      params: { ...params, maxResults: 10 },
      paramsSerializer: (params) => {
        // กรอง parameter ที่เป็น undefined ออก
        const filteredParams = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(params).filter(([_, value]) => value)
        );
        return qs.stringify(filteredParams, {
          indices: false,
          arrayFormat: "repeat",
        });
      },
    }
  );
  return response.data;
};

export const getJiraStatus = async (params: Record<string, unknown>) => {
  console.log(params.projectId);
  if (!params.projectId) return { values: [] };
  const response = await axiosInstance.get<getJiraStatusResponse>(
    "/api/jira/statuses",
    {
      params: { ...params, projectId: params.projectId },
    }
  );

  console.log(params);
  return response.data;
};

export const getIssuestype = async (
  projectId: string | null,
  params: Record<string, unknown>
) => {
  if (!projectId) return [];
  const response = await axiosInstance.get<GetIssuetypeResponse[]>(
    `/api/jira/issuetypes/${projectId}`,
    {
      params: { ...params, projectId },
    }
  );
  return response.data;
};

export const getFieldConfig = async () => {
  const response = await axiosInstance.get<GetFieldConfigResponse[]>(
    "/api/jira/fieldconfiguration"
  );
  return response.data;
};

export const updateIssuseJira = async ({ ids }: { ids: number[] }) => {
  const response = await axiosInstance.post<BulkIssue>(
    "/api/issues/bulklink/jira",
    { ids } // ส่ง ids ไปใน body ของคำขอ
  );
  return response.data;
};

// Get All Issues
export const fetchIssues = async (id: string) => {
  const response = await axiosInstance.get<Issue>(`/api/issues/${id}`);
  return response.data;
};

//Issues Post
export const createIssues = async (Data: CreateIssue): Promise<Issue> => {
  const response = await axiosInstance.post<Issue>("/api/issues", Data);
  return response.data;
};

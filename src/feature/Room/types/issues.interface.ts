// Project
export interface getProjectResponse {
  self: string;
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: Project[];
}
export interface Project {
  expand: string;
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: AvatarUrls;
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties: unknown;
  entityId: string;
  uuid: string;
}

export interface AvatarUrls {
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
}

//Issue
export interface getIssuesResponse {
  issues: IssuesData[];
  nextPageToken?: string | null;
}

export interface IssuesData {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
}

export interface Fields {
  summary: string;
  issuetype: Issuetype;
  description: Description;
  assignee: unknown;
  status: Status;
}

export interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  entityId: string;
  hierarchyLevel: number;
}

export interface Description {
  type: string;
  version: number;
  content: Content[];
}

export interface Content {
  attrs?: Record<string, unknown>;
  type: string;
  content: Content2[];
}

export interface Content2 {
  attrs: { shortName: string; id: string; text: string; url: string };
  content: Content2[];
  type: string;
  text: string;
}

export interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

//Get Status
export interface getJiraStatusResponse {
  startAt: number;
  total: number;
  isLast: boolean;
  maxResults: number;
  values: Value[];
  self: string;
}

export interface Value {
  id: string;
  name: string;
  statusCategory: string;
  scope: Scope;
  description: string;
  usages: unknown[];
  workflowUsages: unknown[];
}

export interface Scope {
  type: string;
}

//Get Issues Types
export interface GetIssuetypeResponse {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  untranslatedName: string;
  subtask: boolean;
  avatarId: number;
  hierarchyLevel: number;
  scope: Scope[];
}

export interface Scope {
  type: string;
  project: Projectid;
}

export interface Projectid {
  id: string;
}

//Get Field Config
// export interface GetFieldConfigResponse {
//   maxResults: number;
//   startAt: number;
//   total: number;
//   isLast: boolean;
//   values: ValueField[];
// }

// export interface ValueField {
//   id: number;
//   name: string;
//   description: string;
//   isDefault?: boolean;
// }

export interface BulkIssue {
  results: Result[];
}

export interface Result {
  id: number;
  success: boolean;
  message: string;
}

export interface GetFieldConfigResponse {
  id: string;
  key: string;
  name: string;
  custom: boolean;
  orderable: boolean;
  navigable: boolean;
  searchable: boolean;
  clauseNames: string[];
  schema?: Schema;
  untranslatedName?: string;
  scope?: Scope;
}

export interface Schema {
  type: string;
  items?: string;
  system?: string;
  custom?: string;
  customId?: number;
  configuration?: Configuration;
}

export interface Configuration {
  "com.atlassian.jira.plugin.system.customfieldtypes:atlassian-team": boolean;
}

export interface Scope {
  type: string;
  projects: Project;
}

export interface Project {
  id: string;
}

export interface filterIssue {
  project: string | null;
  issueType?: string | null;
  status?: string | null;
  summary?: string | null;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

import { EventAction } from "../../Room/types/events";

import { Room } from "../../Room/types/room.interface";
import { VoteSession } from "../../Room/types/vote.interface";

export enum IssueStatus {
  Pending = "0",
  Voting = "1",
  Completed = "2",
}

export interface CreateIssue {
  title: string;
  description?: string;
  status?: IssueStatus;
  storyPoints?: string;
  jiraIssueKey?: string;
  jiraIssueId?: string;
  jiraTargetCustomFieldId?: string;
  jiraRawData?: Record<string, unknown>;
}

export interface Issue {
  id: number;
  title: string;
  description?: string;
  storyPoints?: string;
  status: IssueStatus;
  latestVoteSession?: VoteSession;
  room?: Room;
  createdAt: Date;
  updatedAt: Date;
  jiraIssueKey?: string;
  jiraIssueId?: string;
  jiraTargetCustomFieldId?: string;
  jiraRawData?: Record<string, unknown>;
  jiraLinkedAt?: string;
}

export interface IssueEvent {
  type: EventAction;
  data: Issue;
}

// export interface CreateIssueSocketEvent {
//   type: EventAction;
//   data: CreateIssue;
// }

// export interface UpdateIssueSocketEvent {
//   type: EventAction;
//   data: {
//     id: number;
//     issue: CreateIssue;
//   };
// }

// export interface DeleteIssueSocketEvent {
//   type: EventAction;
//   data: {
//     id: number;
//   };
// }

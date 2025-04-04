import { EventAction } from "./events";
import { RevealType } from "./room.interface";

import { User } from "./user.interface";

export enum VoteSessionStatus {
  InProgress = "0",
  Revealed = "1",
  Completed = "2",
}

export interface VoteSession {
  id?: number;
  // room: Room | null;
  // issue: Issue;
  status?: VoteSessionStatus;
  endedAt?: Date;
  startedAt?: Date;
  votes: CurrentVote[];
}

export interface ListenVoteEvent {
  type: EventAction;
  data: { id: number | string; point: string };
}

export interface CurrentVote {
  id: string;
  point: string;
  voteSessionId?: string;
  createdBy?: User;
  createdAt?: string;
}

export interface RevealVote {
  id: string;
  point: string;
  createdBy: User;
  createdAt: string;
  votes: CurrentVote[];
  type: RevealType;
}

export interface PointReveal {
  point: string;
  count: number;
  isCustom?: boolean;
}

export interface CustomPoint {
  point: string;
}

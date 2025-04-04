import { Issue } from "../../Issues/types/issues";
import { Room, RoomParticipantRole } from "./room.interface";
import { CurrentVote, VoteSessionStatus } from "./vote.interface";

export enum AuthProvider {
  Anonymous = "anonymous",
  Atlassian = "atlassian",
}

export interface Participant {
  id: string;
  room: Room;
  role: RoomParticipantRole;
  user: User;
  deletedAt: Date;
  createdAt: Date;
  createdBy: User;
}

export interface BaseDataUser {
  id: string;
  point: string;
  user: User;
  participants?: Participant[];
  role: RoomParticipantRole;
  deletedAt: string;
}

export type UserEvent =
  | {
      type: "init";
      data: {
        room: Room;
        issues: Issue[];
        title: string;
        voteSession: VoteSessionEvent;
      };
    }
  | {
      type: "join" | "leave";
      data: {
        role: RoomParticipantRole;
        deletedAt: string | null;
        id: string;
        user: User;
        vote: CurrentVote | undefined;
      };
    };

export interface User {
  id: number;
  displayName: string;
  avatarUrl: string | null;
  lastActivity?: Date;
  email: string | null;
  emailVerified: boolean;
  authProvider: AuthProvider;
  accessibleResources?: AtlassianAccessibleResource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithVote extends User {
  isVoting?: boolean;
  selectedCard?: string | null;
}

export interface AtlassianAccessibleResource {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}

export interface VoteSessionEvent {
  id: string;
  roomId: string;
  issueId?: number;
  status: VoteSessionStatus;
  startedAt: number;
  endedAt?: number;
  votes: CurrentVote[];
}

import { Issue } from "../../Issues/types/issues";
import { Participant, User } from "./user.interface";

export enum RoomParticipantRole {
  Participator = "0",
  Inspector = "1",
}

export enum StoryPointType {
  Fibonacci = "0",
  Linear = "1",
  Tshirt = "2",
}

export enum RevealType {
  Manual = "0",
  Timeout = "1",
}

export enum RoomStatus {
  Active = "0",
  Archived = "1",
}

export interface Room {
  id: string;
  code: string;
  title: string;
  issue: Issue[];
  participants: Participant[];
  settings: RoomSettings;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: User;
}

export interface RoomSettings {
  id: number;
  room: Room;
  storyPoint: StoryPoint;
  reveal?: Reveal;
}

export interface Reveal {
  type: RevealType;
  timeout: number;
}

export interface StoryPoint {
  title?: string;
  type: StoryPointType;
  data?: string[];
}

export interface JoinRoom {
  roomId: string;
  userId: string;
  participantRole?: RoomParticipantRole;
}

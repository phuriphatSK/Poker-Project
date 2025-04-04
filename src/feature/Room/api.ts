import axiosInstance from "../../lib/axiosInstance";
import {
  Reveal,
  RoomParticipantRole,
  RoomSettings,
  RoomStatus,
  StoryPoint,
} from "./types/room.interface";
import { Participant, User } from "./types/user.interface";

//RoomsResponse
export interface RoomsResponse {
  id: string;
  code: string;
  title: string;
  participants: Participant[];
  settings: RoomSettings;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: User;
}

//CreateRoom Post
interface CreateRoomsRequest {
  title: string;
  role?: RoomParticipantRole;
  settings?: {
    storyPoint: StoryPoint;
    reveal?: Reveal;
  };
  createBy?: User;
}

//CreateRoom Post
export const CreateRoom = async (
  Data: CreateRoomsRequest
): Promise<RoomsResponse> => {
  const response = await axiosInstance.post<RoomsResponse>("/api/rooms", Data);
  return response.data;
};

export const fetchIDRoomInfo = async (id: string): Promise<RoomsResponse> => {
  if (!id) throw new Error("Room ID is required");
  const response = await axiosInstance.get<RoomsResponse>(`/api/rooms/${id}`, {
    params: { withDeleted: true },
  });
  return response.data;
};

export const deletedRoom = async (id: string): Promise<RoomsResponse> => {
  try {
    const response = await axiosInstance.delete<RoomsResponse>(
      `/api/rooms/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete room:", error);
    throw error;
  }
};

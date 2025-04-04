import axiosInstance from "../../lib/axiosInstance";
import { RoomParticipantRole } from "../Room/types/room.interface";
import {
  AtlassianAccessibleResource,
  AuthProvider,
} from "../Room/types/user.interface";

//guestLogin
interface GuestRequest {
  displayName: string;
  role: RoomParticipantRole;
  avatarUrl?: string;
}

export interface GuestResponse {
  accessToken: string;
}

export const guestLogin = async (
  guestData: GuestRequest
): Promise<GuestResponse> => {
  const response = await axiosInstance.post<GuestResponse>(
    "/api/auth/guest",
    guestData
  );
  return response.data;
};

export const userlogout = async (): Promise<GuestResponse> => {
  const response = await axiosInstance.post<GuestResponse>("/api/auth/logout");
  return response.data;
};

//guestInfo
export interface GuestInfoResponse {
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

export const fetchUserInfo = async (): Promise<GuestInfoResponse> => {
  const response =
    await axiosInstance.get<GuestInfoResponse>("/api/users/profile");
  return response.data;
};

//JiraUser
export interface JiraUserResponse {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
  accessToken: string;
}

export const fetchJiraUserInfo = async (): Promise<JiraUserResponse> => {
  const response = await axiosInstance.get<JiraUserResponse>(
    "/api/auth/atlassian/callback"
  );
  return response.data;
};

export const updateDisplayName = async ({
  displayName,
}: {
  displayName: string;
}): Promise<GuestInfoResponse> => {
  const response = await axiosInstance.patch<GuestInfoResponse>(
    "/api/users/profile",
    { displayName }
  );
  return response.data;
};

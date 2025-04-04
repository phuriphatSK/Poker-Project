import { RoomStatus } from "../../Room/types/room.interface";
import { User } from "../../Room/types/user.interface";

export interface RecentResponse {
  data: Recent[];
  meta: Meta;
}

export interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Recent {
  id: string;
  title: string;
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: User;
  participantCount: number;
  issueCount: number;
}

export interface PageOptions {
  order?: Order;
  page?: number;
  take?: number;
  skip: number;
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export interface PageMetaParameters {
  pageOptions: PageOptions;
  itemCount: number;
}

export interface PageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export function createPageMeta({
  pageOptions,
  itemCount,
}: PageMetaParameters): PageMeta {
  const { page = 1, take = 10 } = pageOptions;
  const pageCount = Math.ceil(itemCount / take);

  return {
    page,
    take,
    itemCount,
    pageCount,
    hasPreviousPage: page > 1,
    hasNextPage: page < pageCount,
  };
}

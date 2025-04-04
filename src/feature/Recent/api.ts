import axiosInstance from "../../lib/axiosInstance";
import { RecentResponse, Order } from "./type/recent.interface";

export const fetchRecentInfo = async (
  order: Order = Order.DESC, // ✅ ใช้ Enum แทน string
  page: number = 1,
  take: number = 10
): Promise<RecentResponse> => {
  const response = await axiosInstance.get<RecentResponse>("/api/recentrooms", {
    params: { order, page, take },
  });
  return response.data;
};

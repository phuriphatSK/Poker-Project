import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRecentInfo } from "../api";
import { Order } from "../type/recent.interface";
import { deletedRoom } from "../../Room/api";

export const useGetRecentRoom = (page: number, take: number) => {
  return useQuery({
    queryKey: ["RecentRoom", page, take], // ใช้ page และ take ใน queryKey
    queryFn: () => fetchRecentInfo(Order.DESC, page, take),
    staleTime: Infinity,
    retry: 2,
  });
};

export const useDeleteRecentRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletedRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["DeletedRoom"] });
      console.log("Delete room successful");
    },
    onError: (error) => {
      console.error("Error during delete:", error);
    },
  });
};

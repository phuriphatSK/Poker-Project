import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFieldConfig } from "../api";

export const useGetFieldConfig = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["fieldconfig"],
    mutationFn: getFieldConfig,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fieldconfig"] });
      console.log("get fieldconfig successful", data);
    },
    onError: (error) => {
      console.error("Error during get fieldconfig:", error);
    },
  });

  return mutation;
};

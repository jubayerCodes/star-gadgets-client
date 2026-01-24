import { useMutation } from "@tanstack/react-query";
import { createUserApi } from "../api";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      console.log("User created successfully");
    },
    onError: () => {
      console.log("User creation failed");
    },
  });
};

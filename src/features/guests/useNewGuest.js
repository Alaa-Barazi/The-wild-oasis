import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewGuest } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useNewGuest() {
  const queryClient = useQueryClient();
  const { mutate: createGuest, isLoading: isCreating } = useMutation({
    mutationFn: createNewGuest,
    onSuccess: () => {
      toast.success("Guest created successfully");
      queryClient.invalidateQueries(["Guests"]);
    },
    onError: (err) => toast.error(err.message),
  });

  return { createGuest, isCreating };
}

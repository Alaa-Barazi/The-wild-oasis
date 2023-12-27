import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success("Booking updated successfully");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => toast.error(err.message),
  });
  return { createBooking, isCreating };
}

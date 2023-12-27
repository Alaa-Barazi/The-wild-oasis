import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateBooking as updateBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  const { mutate: updateBooking, isLoading: isUpdating } = useMutation({
    mutationFn: updateBookingApi,
    onSuccess: () => {
      toast.success("Booking updated successfully");
      queryClient.invalidateQueries(["bookings"]);
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateBooking, isUpdating };
}

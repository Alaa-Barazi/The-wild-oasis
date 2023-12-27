import { useQuery } from "@tanstack/react-query";
import { getGuests as getGuestApi } from "../../services/apiGuests";
export function useGuests() {
  const {
    isLoading,
    data: guests,
    error,
  } = useQuery({
    queryKey: ["Guests"],
    queryFn: getGuestApi,
  });
  return { guests, isLoading };
}

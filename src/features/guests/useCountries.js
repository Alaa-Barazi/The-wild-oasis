import { useQuery } from "@tanstack/react-query";

async function fetchCountries() {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/images"
    );
    const data = await res.json();

    return data.data.map((country) => ({
      value: country.iso2,
      label: country.name,
    }));
  } catch (error) {
    throw new Error("Error fetching countries: " + error.message);
  }
}

export function useCountries() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["Countries"],
    queryFn: fetchCountries,
  });

  return { isLoading, data, error };
}

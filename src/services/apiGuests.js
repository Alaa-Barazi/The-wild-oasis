import supabase from "./supabase";

export async function getGuests() {
  const { data: guests, error } = await supabase.from("guests").select("*");
  if (error) throw new Error("Guests cancould not be loaded");
  return guests;
}

export async function getGuest(id) {
  const { data: guest, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error("Guest not found");

  return guest;
}

export async function createNewGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert(newGuest)
    .select();
  if (error) throw new Error("Guest could not be created");
  return data;
}

import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchDriverProfileData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  try {
    let query = supabase
      .from("DriverProfiles")
      .select(`*`, { count: "exact" })
      .order("created_at", { ascending: false });

    if (searchValue) {
      query = query.or(
        `last_name.ilike.%${searchValue}%,first_name.ilike.%${searchValue}%,middle_name.ilike.%${searchValue}%,address.ilike.%${searchValue}%`
      );
    }

    const response = await query.range(offset, offset + entriesPerPage - 1);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const insertDriverProfileData = async (data: any) => {
  try {
    const response = await supabase
      .from("DriverProfiles")
      .insert(data)
      .select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

export const editDriverProfileData = async (id: string, updatedRecord: any) => {
  try {
    const { data, error } = await supabase
      .from("DriverProfiles")
      .update(updatedRecord)
      .eq("id", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

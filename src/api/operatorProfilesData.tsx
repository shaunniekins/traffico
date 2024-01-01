import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchOperatorProfileData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  try {
    let query = supabase
      .from("OperatorProfiles")
      .select(`*`, { count: "exact" });

    if (searchValue) {
      query = query.or(
        `last_name.ilike.%${searchValue}%,first_name.ilike.%${searchValue}%,middle_name.ilike.%${searchValue}%,address.ilike.%${searchValue}%,plate_num.ilike.%${searchValue}%,body_num.ilike.%${searchValue}%`
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

export const fetchOperatorProfileByName = async (name: string) => {
  try {
    const query = supabase
      .from("OperatorProfiles")
      .select(`*`)
      .or(`last_name.ilike.%${name}%,first_name.ilike.%${name}%`)
      .order("last_name", { ascending: true });

    const response = await query;

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const insertOperatorProfileData = async (data: any) => {
  try {
    const response = await supabase.from("OperatorProfiles").insert(data);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

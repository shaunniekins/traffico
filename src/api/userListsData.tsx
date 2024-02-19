import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchUserListsData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  try {
    let query = supabase
      .from("UserLists")
      .select(`*`, { count: "exact" })
      .order("date_registered", { ascending: false });

    if (searchValue) {
      query = query.or(
        `last_name.ilike.%${searchValue}%,first_name.ilike.%${searchValue}%,address.ilike.%${searchValue}%`
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

export const insertUserListsData = async (data: any) => {
  try {
    const response = await supabase.from("UserLists").insert(data).select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

export const createNewUser = async (
  email: string,
  password: string,
  newData: any
) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw error;
  }

  const user = data?.user;

  if (user) {
    const { data: profileData, error: insertError } = await supabase
      .from("UserLists")
      .insert({
        id: user.id,
        ...newData,
      });

    if (insertError) {
      throw insertError;
    }

    return { profileData, userID: user.id };
  }
};

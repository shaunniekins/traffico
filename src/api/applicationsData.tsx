import { supabase, supabaseAdmin } from "@/utils/supabase";

export const insertApplicationData = async (data: any) => {
  try {
    const response = await supabase.from("Applications").insert(data).select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

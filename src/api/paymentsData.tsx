import { supabase, supabaseAdmin } from "@/utils/supabase";

export const insertPaymentData = async (data: any) => {
  try {
    const response = await supabase.from("Payments").insert(data).select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

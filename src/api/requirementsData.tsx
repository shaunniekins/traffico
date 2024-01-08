import { supabase, supabaseAdmin } from "@/utils/supabase";

export const insertRequirementDocumentData = async (data: any) => {
  try {
    const response = await supabase
      .from("RequirementDocuments")
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

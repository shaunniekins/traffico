import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchRequirementDocumentDataByID = async (id: any) => {
  try {
    const query = supabase.from("RequirementDocuments").select(`*`);

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

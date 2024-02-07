import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchReportViolations = async () => {
  try {
    const query = supabase.from("ReportViolations").select(
      `*, 
      Applications!inner(id, body_num, franchise_status, operator_id,
        DriverProfiles!inner(id, last_name, first_name, middle_name, license_num), 
        OperatorProfiles!inner(id, last_name, first_name, middle_name, address,
            VehicleOwnershipRecords!inner(id, lto_plate_num, date_registered, zone))
    )`
    );

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

export const insertReportViolations = async (data: any) => {
  try {
    const response = await supabase.from("ReportViolations").insert(data);
    // .select();

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
};

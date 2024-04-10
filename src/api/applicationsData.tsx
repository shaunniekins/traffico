import { supabase, supabaseAdmin } from "@/utils/supabase";

export const checkFranchiseNumber = async (franchiseNum: string) => {
  try {
    const response = await supabase
      .from("Applications")
      .select("*")
      .eq("franchise_num", franchiseNum);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const fetchApplicationData = async (
  searchValue: string
  // filterType: string
) => {
  try {
    let query = supabase
      .from("ViewApproval")
      .select(`*`, { count: "exact" })
      .order("application_date", { ascending: false });

    if (searchValue) {
      query = query.or(
        `franchise_num.ilike.%${searchValue}%,operator_name.ilike.%${searchValue}%,driver_name.ilike.%${searchValue}%,body_num.ilike.%${searchValue}%`
      );
    }

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

export const fetchApplicationDataForQRScanner = async (
  searchValue: string,
  filterType: string
) => {
  if (searchValue && filterType) {
    try {
      let query = supabase
        .from("Applications")
        .select(
          `id, 
        application_date, 
        franchise_num, 
        franchise_status, 
        operator_id, 
        driver_id, 
        insurance_company, 
        insurance_coc_num, 
        insurance_expiry_date,
        body_num, 
        zone,
        status,
        OperatorProfiles!inner(id, last_name, first_name, middle_name, birth_date, address, civil_status, contact_num, is_active,
          VehicleOwnershipRecords!inner(id, operator_id, date_registered, chassis_num, lto_plate_num, color_code, motor_num, body_num)
        ),
        DriverProfiles!inner(id, last_name, first_name, middle_name, birth_date, 
          address, civil_status, contact_num, is_active, license_num, license_expiration)`,

          { count: "exact" }
        )
        .eq("body_num", searchValue)
        .order("application_date", { ascending: false });

      const response = await query;

      if (response.error) {
        throw response.error;
      }
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
};

export const editApplicationData = async (
  applicationId: string,
  newStatus: string
) => {
  try {
    const { data, error } = await supabase
      .from("Applications")
      // .update([updatedRecord])
      .update({ status: newStatus })
      .eq("id", applicationId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

export const deleteApplicationData = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from("Applications")
      .delete()
      .eq("id", applicationId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

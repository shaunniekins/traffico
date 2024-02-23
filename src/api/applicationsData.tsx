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
  searchValue: string,
  filterType: string
) => {
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
          VehicleOwnershipRecords!inner(id, operator_id, date_registered, chassis_num, lto_plate_num, color_code, motor_num, body_num, front_view_image, left_side_view_image, right_side_view_image, inside_front_image, back_view_image)
        ),
        DriverProfiles!inner(id, last_name, first_name, middle_name, birth_date, 
          address, civil_status, contact_num, is_active, license_num, license_expiration)`,

        { count: "exact" }
      )
      .order("application_date", { ascending: false });

    // if (searchValue) {
    //   query = query.or(
    //     `OperatorProfiles.last_name.ilike.%${searchValue}%,
    //     OperatorProfiles.first_name.ilike.%${searchValue}%,
    //     OperatorProfiles.address.ilike.%${searchValue}%,
    //     DriverProfiles.last_name.ilike.%${searchValue}%,
    //     DriverProfiles.first_name.ilike.%${searchValue}%,
    //     DriverProfiles.address.ilike.%${searchValue}%,
    //     franchise_num.ilike.%${searchValue}%,
    //     franchise_status.ilike.%${searchValue}%,
    //     insurance_coc_num.ilike.%${searchValue}%`
    //   );
    // }

    if (searchValue && filterType) {
      // query = query.or(`OperatorProfiles.first_name.ilike.%${searchValue}%`);

      // thiss works
      // query = query.ilike("OperatorProfiles.first_name", `%${searchValue}%`);

      // query = query.or(
      //   `franchise_num.ilike.%${searchValue}%,
      //   franchise_status.ilike.%${searchValue}%,
      //   insurance_coc_num.ilike.%${searchValue}%,
      //   OperatorProfiles.last_name.ilike.%${searchValue}%`
      // );
      // this works
      // query = query.filter(
      //   "OperatorProfiles.last_name",
      //   "ilike",
      //   `%${searchValue}%`
      // );

      // query = query.or("OperatorProfiles.last_name.ilike.%Ochavo%,");

      if (filterType === "bodyNum") {
        query = query.ilike("body_num", `%${searchValue}%`);
      } else if (filterType === "driver") {
        query = query.filter(
          "DriverProfiles.last_name",
          "ilike",
          `%${searchValue}%`
        );
      } else if (filterType === "operator") {
        query = query.filter(
          "OperatorProfiles.last_name",
          "ilike",
          `%${searchValue}%`
        );
      } else if (filterType === "trackCode") {
        query = query.ilike("franchise_num", `%${searchValue}%`);
      }
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

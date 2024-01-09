import { supabase, supabaseAdmin } from "@/utils/supabase";

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
        OperatorProfiles!inner(id, last_name, first_name, middle_name, birth_date, address, civil_status, contact_num, is_active,
          VehicleOwnershipRecords!inner(id, operator_id, date_registered, chassis_num, lto_plate_num, color_code, motor_num, body_num)
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

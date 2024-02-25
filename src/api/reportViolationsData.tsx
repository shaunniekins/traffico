import { supabase, supabaseAdmin } from "@/utils/supabase";

export const fetchReportViolationsData = async (
  searchValue: string,
  entriesPerPage: number,
  currentPage: number
) => {
  const offset = (currentPage - 1) * entriesPerPage;

  try {
    let query = supabase
      .from("ViewTricycleDriverViolationsAdmin")
      .select(`*`, { count: "exact" })
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (searchValue) {
      query = query.or(
        `driver_name.ilike.%${searchValue}%,driver_license_num.ilike.%${searchValue}%,body_num.ilike.%${searchValue}%`
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

export const fetchReportViolations = async (currentView: string) => {
  //add id
  const id = 1;
  try {
    let query = supabase.from("ViewTricycleDriverViolationsAdmin").select();

    if (currentView === "passengers") {
      query = query
        // .filter("passenger_id", "neq", null)
        .filter("complainant_name", "neq", null);
    } else if (currentView === "personal") {
      // query = query.eq("enforcer_id", id);
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

// export const fetchReportViolations = async () => {
//   try {
//     const query = supabase.from("ViewTricycleDriverViolationsAdmin").select(
//       `*,
//       Applications!inner(id, body_num, franchise_status, operator_id,
//         DriverProfiles!inner(id, last_name, first_name, middle_name, license_num),
//         OperatorProfiles!inner(id, last_name, first_name, middle_name, address,
//             VehicleOwnershipRecords!inner(id, lto_plate_num, date_registered, zone))
//     )`
//     );

//     const response = await query;

//     if (response.error) {
//       throw response.error;
//     }
//     return response;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };

// export const fetchViolatorDetails = async () => {
//   try {
//     const currentYear = new Date().getFullYear();
//     // const currentYear = 2025;

//     const response = await supabase
//       .from("ViewTricycleDriverViolationsAdmin")
//       .select()
//       .filter("date", "gte", `${currentYear}-01-01T00:00:00Z`)
//       .filter("date", "lt", `${currentYear + 1}-01-01T00:00:00Z`);

//     if (response.error) {
//       throw response.error;
//     }
//     return response;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };

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

export const updateReportViolations = async (id: string, data: any) => {
  try {
    const response = await supabase
      .from("ReportViolations")
      .update(data)
      .eq("id", id);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

export const deleteReportViolations = async (id: string) => {
  try {
    const response = await supabase
      .from("ReportViolations")
      .delete()
      .eq("id", id);

    if (response.error) {
      throw response.error;
    }
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    return null;
  }
};

import { supabase } from "@/utils/supabase";

export const fetchDriverComplaints = async () => {
  const query = supabase.from("ViewDriverComplaints").select();

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
};

export const fetchRegisteredVehicles = async () => {
  const query = supabase.from("ViewRegisteredTricycles").select();

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
};

export const fetchRenewedVehiclePermits = async () => {
  const query = supabase.from("ViewRenewedTricycles").select();

  const response = await query;

  if (response.error) {
    console.error("Error fetching data:", response.error);
    return;
  }

  return response.data;
};

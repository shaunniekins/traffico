import React, { useContext, useEffect, useRef } from "react";
import {
  IoLogOutOutline,
  IoMenuOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { CiExport } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { UserContext } from "@/utils/UserContext";
import { supabase } from "@/utils/supabase";
import { LoadingScreenSection } from "./LoadingScreen";

interface TopbarProps {
  isMenuOpen: boolean;
  handleMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ isMenuOpen, handleMenuClick }) => {
  const { userName, userId } = useContext(UserContext);
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [toggleExport, setToggleExport] = useState(false);

  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  const userType = pathname.includes("/admin/")
    ? "admin"
    : pathname.includes("/personnel/")
    ? "personnel"
    : null;

  const [selectedOption, setSelectOption] = useState(
    userType === "admin" ? "ViewApproval" : "ViewDashboardAnalytics"
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = async () => {
    if (!selectedOption) return;

    const { data, error } = await supabase.from(selectedOption).select();
    if (error) {
      console.error(error);
    } else {
      // Capitalize first letter and replace underscores with spaces
      const modifiedData = data.map((item) => {
        const newItem: { [key: string]: any } = {};
        for (const key in item) {
          const newKey = key
            .replace(/_/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());
          newItem[newKey] = item[key];
        }
        return newItem;
      });

      // Convert JSON to CSV
      const csv = jsonToCsv(modifiedData);

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedOption}.csv`;
      link.click();
    }

    setToggleExport(false);
  };

  function jsonToCsv(json: any) {
    const items = json;
    const replacer = (key: any, value: any) => (value === null ? "" : value);
    const header = Object.keys(items[0]);
    let csv = items.map((row: { [key: string]: any }) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    csv = csv.join("\r\n");
    return csv;
  }

  return (
    <>
      {toggleExport && (
        <div
          className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black overflow-y-auto w-full`}>
          <div
            className={`rounded-2xl 
                bg-white text-black mx-3 md:w-96`}
            ref={dropdownRef}>
            <div className="flex justify-between items-center  py-3 px-5">
              <h2 className="text-xl font-semibold">Export Data</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setToggleExport(false);
                  }}
                  className="bg-red-600 flex text-lg rounded-xl px-3 py-1 text-white">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleExport();
                  }}
                  className={`bg-sky-700 flex text-lg rounded-xl px-3 py-1 text-white `}>
                  Export
                </button>
              </div>
            </div>
            <hr className="border border-sky-700 w-full" />
            <div className="flex flex-col sm:flex-row items-center p-5 gap-2 sm:gap-6 pb-6">
              <>
                <label htmlFor="selectedOption" className="whitespace-nowrap">
                  Export
                </label>
                <select
                  name="selectedOption"
                  id="selectedOption"
                  value={selectedOption}
                  onChange={(e) => setSelectOption(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 rounded-lg p-2 w-full">
                  {userType === "admin" && (
                    <>
                      <option value="ViewApproval">Applications</option>
                      <option value="UserLists">Users</option>
                    </>
                  )}
                  <option value="ViewDashboardAnalytics">
                    Dashboard Analytics
                  </option>
                  <option value="OperatorProfiles">Operator Profiles</option>
                  <option value="DriverProfiles">Driver Profiles</option>
                  <option value="Payments">Payments</option>
                  <option value="ViewTricycleDriverViolationsAdmin">
                    Violators
                  </option>
                </select>
              </>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center py-2 h-[5dvh]">
        {loading && <LoadingScreenSection />}
        <MenuButton onClick={handleMenuClick} />
        <div
          className="relative flex items-center justify-center space-x-4 pr-5"
          ref={dropdownRef}>
          <button
            className="flex items-center text-2xl space-x-2"
            onClick={() => setShowLogout(!showLogout)}>
            <CgProfile />
            <h5 className="text-base md:text-xl">
              Hi, <span className="text-sky-700 font-semibold">{userName}</span>
            </h5>
          </button>
          {showLogout && (
            <div className="absolute top-full mt-2 bg-gray-600 text-gray-400 opacity-95 py-1 pl-3 pr-14 right-[0.20rem] rounded-lg z-40">
              <div className="absolute w-3 h-3 bg-inherit transform rotate-45 left-3/4 -top-1.5 translate-x-[-50%]" />
              <button
                className="flex items-center text-lg space-x-2 text-sky-300 hover:text-purple-300 my-3"
                onClick={() => {
                  setToggleExport(true);
                  setShowLogout(false);
                }}>
                <div className="bg-sky-700 text-white rounded-full p-2">
                  <CiExport />
                </div>
                <h5 className="text-md whitespace-nowrap">Data Export</h5>
              </button>
              <button
                className="flex items-center text-lg space-x-2 text-sky-300 hover:text-purple-300 my-2"
                onClick={() => {
                  setLoading(true);
                  supabase.auth.signOut();
                  localStorage.removeItem("name");
                  localStorage.removeItem("userId");
                  router.push("/");
                }}>
                <div className="bg-sky-700 text-white rounded-full p-2 ">
                  <IoLogOutOutline />
                </div>

                <h5 className="text-md">Logout</h5>
              </button>
            </div>
          )}
        </div>
        {/* <button className="text-2xl">
          <IoSettingsOutline />
        </button> */}
        {/* </div> */}
      </div>
    </>
  );
};

const MenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-center gap-10">
      <button className={`text-3xl self-center`} onClick={onClick}>
        <IoMenuOutline />
      </button>
      {pathname === "/admin/dashboard/dashboard" && (
        <h1 className="hidden md:flex font-bold text-3xl text-sky-700">
          Overview Analytics
        </h1>
      )}
    </div>
  );
};

export default Topbar;

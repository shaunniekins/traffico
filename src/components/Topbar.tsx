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
import { UserContext } from "@/utils/UserContext";
import { supabase } from "@/utils/supabase";
import { LoadingScreenSection } from "./LoadingScreen";
import PrintReports from "./PrintReportDriverComplaints";
import { useReactToPrint } from "react-to-print";
import PrintReportRenewedVehicles from "./PrintReportRenewedVehicles";
import PrintReportRegisteredVehicles from "./PrintReportRegisteredVehicles";

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

  const pathname = usePathname();

  const [selectedOption, setSelectOption] = useState(
    "PrintReportDriverComplaints"
  );
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const exportDataRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }

      if (
        exportDataRef.current &&
        !exportDataRef.current.contains(event.target as Node)
      ) {
        setToggleExport(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const componentRef1 = useRef<HTMLDivElement>(null);
  const componentRef2 = useRef<HTMLDivElement>(null);
  const componentRef3 = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => {
      switch (selectedOption) {
        case "option1":
          return componentRef1.current;
        case "option2":
          return componentRef2.current;
        case "option3":
          return componentRef3.current;
        default:
          return null;
      }
    },
  });

  const barangays = [
    "Alegria",
    "Poblacion 1",
    "Poblacion 2",
    "Poblacion 3",
    "Poblacion 4",
    "Poblacion 5",
    "Bayugan 2",
    "Bitan-agan",
    "Borbon",
    "Buenasuerte",
    "Caimpugan",
    "Das-agan",
    "Ebro",
    "Hubang",
    "Karaus",
    "Ladgadan",
    "Lapinigan",
    "Lucac",
    "Mate",
    "New Visayas",
    "Ormaca",
    "Pasta",
    "Pisa-an",
    "Rizal",
    "San Isidro",
    "Sanfrancisco",
    "Santa Ana",
    "Tagapua",
  ];

  return (
    <>
      {toggleExport && (
        <div
          className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black overflow-y-auto w-full`}>
          <div
            className={`rounded-2xl 
                bg-white text-black mx-3 md:w-96`}
            ref={exportDataRef}>
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
                  onClick={handlePrint}
                  className={`bg-sky-700 flex text-lg rounded-xl px-3 py-1 text-white `}>
                  Export
                </button>
                <div className="hidden">
                  <PrintReports ref={componentRef1} />
                  <PrintReportRegisteredVehicles
                    ref={componentRef2}
                    selectedBarangay={selectedBarangay}
                  />
                  <PrintReportRenewedVehicles
                    ref={componentRef3}
                    selectedBarangay={selectedBarangay}
                  />
                </div>
              </div>
            </div>
            <hr className="border border-sky-700 w-full" />
            <div
              className="grid grid-cols-2 items-center p-5 gap-2 sm:gap-3 pb-6"
              style={{ gridTemplateColumns: "auto 1fr" }}>
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
                  <option value="option1">Driver Complaints</option>
                  <option value="option2">
                    Registered Motor Tricycle Vehicles
                  </option>
                  <option value="option3">Renewed Tricycles</option>
                </select>
              </>
              {(selectedOption === "option2" ||
                selectedOption === "option3") && (
                <>
                  <label
                    htmlFor="selectedBarangay"
                    className="whitespace-nowrap">
                    Barangay
                  </label>
                  <select
                    name="selectedBarangay"
                    id="selectedBarangay"
                    value={selectedBarangay}
                    onChange={(e) => setSelectedBarangay(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 rounded-lg p-2 w-full">
                    {barangays.map((barangay) => (
                      <option key={barangay} value={barangay}>
                        {barangay}
                      </option>
                    ))}
                  </select>
                </>
              )}
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
                  setShowLogout(false);
                  setTimeout(() => {
                    setToggleExport(true);
                  }, 0);
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

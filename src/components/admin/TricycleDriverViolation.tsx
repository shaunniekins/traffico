"use client";
import { fetchReportViolationsData } from "@/api/reportViolationsData";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";

const TricycleDriverViolation = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPageDetailsSection, setCurrentPageDetailsSection] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;

  const [records, setRecords] = useState<any[]>([]);
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);

  const headerNames = [
    "ID",
    "Date",
    "Time",
    "License No.",
    "Driver",
    "Operator",
    "Complain",
    "Details",
  ];

  const memoizedFetchReportViolationsData = useCallback(async () => {
    try {
      const response = await fetchReportViolationsData(
        searchValue,
        entriesPerPage,
        currentPageDetailsSection
      );
      if (response?.error) {
        console.error(response.error);
      } else {
        setRecords(response?.data || []);
        // console.log("response:", response?.data);
        setNumOfEntries(response?.count || 1);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [searchValue, entriesPerPage, currentPageDetailsSection]);

  useEffect(() => {
    memoizedFetchReportViolationsData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ReportViolations",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) => [
              payload.new as any,
              ...prevRecord,
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ReportViolations",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) =>
              prevRecord.map((record: any) =>
                record.id === payload.new.id ? payload.new : record
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "ReportViolations",
        },
        (payload) => {
          if (payload.old) {
            setRecords((prevRecord: any) =>
              prevRecord.filter((record: any) => record.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchValue, entriesPerPage, currentPageDetailsSection]);

  const [currentComplaint, setCurrentComplaint] = useState<any | null>(null);

  const handleViewClick = (id: string) => {
    const record = records.find((record) => record.id === id);

    if (record) {
      setCurrentComplaint(record);

      setToggleMoreDetails(true);
    }
  };

  return (
    <div className="z-0 flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            {!toggleMoreDetails
              ? "List of Driver with Complaint / Violation"
              : "Driver's Violation Details"}
          </h1>
        </div>
        {!toggleMoreDetails && (
          <div className="relative">
            <MdOutlineSearch className="z-0 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 text-2xl" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPageDetailsSection(1);
              }}
              placeholder="Search"
              className="w-full border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
            />
          </div>
        )}
      </div>
      <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-[70dvh] border border-sky-700">
        <h1 className="px-3 py-2 sm:px-4 border-b border-sky-700">
          {!toggleMoreDetails ? "Details" : "More Details"}
        </h1>
        {toggleMoreDetails ? (
          <div
            className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
            style={{ gridTemplateColumns: "auto 1fr" }}>
            <label htmlFor="body_num">Body Num</label>
            <input
              type="text"
              name="body_num"
              id="body_num"
              value={currentComplaint?.body_num}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="date">Date</label>
            <input
              type="text"
              name="date"
              id="date"
              value={currentComplaint?.date}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              value={currentComplaint?.time}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="complain">Complain</label>
            <input
              name="complain"
              id="complain"
              value={currentComplaint?.complain}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="action_taken">Action Taken</label>
            <input
              type="text"
              name="action_taken"
              id="action_taken"
              value={currentComplaint?.action_taken}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="driver_name">Driver Name</label>
            <input
              type="text"
              name="driver_name"
              id="driver_name"
              value={currentComplaint?.driver_name}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="driver_license_num">Driver License No</label>
            <input
              type="text"
              name="driver_license_num"
              id="driver_license_num"
              value={currentComplaint?.driver_license_num}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="operator_name">Operator Name</label>
            <input
              type="text"
              name="operator_name"
              id="operator_name"
              value={currentComplaint?.operator_name}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="vehicle_plate_num">Vehicle Plate No</label>
            <input
              type="text"
              name="vehicle_plate_num"
              id="vehicle_plate_num"
              value={currentComplaint?.vehicle_plate_num}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="vehicle_date_registered">
              Vehicle Date Registered
            </label>
            <input
              type="text"
              name="vehicle_date_registered"
              id="vehicle_date_registered"
              value={currentComplaint?.vehicle_date_registered}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="vehicle_zone">Zone</label>
            <input
              type="text"
              name="vehicle_zone"
              id="vehicle_zone"
              value={currentComplaint?.vehicle_zone}
              readOnly
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
          </div>
        ) : (
          <table className="w-full text-sm text-center">
            <thead className="text-xs uppercase bg-sky-700 text-white">
              <tr>
                {headerNames.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-sky-700 hover:bg-sky-100">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.driver_license_num}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.driver_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.operator_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.complain}
                  </td>
                  <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                    <button
                      className="bg-sky-200 text-sky-700 py-2 px-5 text-sm rounded-lg"
                      onClick={() => handleViewClick(record.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end items-center w-full">
        {toggleMoreDetails ? (
          <div className="flex justify-end items-center w-full">
            <div className="flex select-none gap-4">
              <button
                className={`border-sky-700 bg-sky-700 text-white 
                   border py-2 px-4 text-sm rounded-lg flex items-center gap-2`}
                onClick={() => {
                  setToggleMoreDetails(false);
                }}>
                <IoChevronBack />
                <span>Go back</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex select-none gap-0">
            <button
              className={`${
                currentPageDetailsSection === 1 ? "text-gray-400" : "text-black"
              } border border-sky-700 py-2 px-2 text-sm`}
              onClick={() =>
                setCurrentPageDetailsSection(currentPageDetailsSection - 1)
              }
              disabled={currentPageDetailsSection === 1}>
              Prev
            </button>
            <input
              type="number"
              min="1"
              max={Math.ceil(numOfEntries / 10)}
              value={currentPageDetailsSection}
              onChange={(e) => {
                const pageNumber = Number(e.target.value);
                if (
                  pageNumber >= 1 &&
                  pageNumber <= Math.ceil(numOfEntries / 10)
                ) {
                  setCurrentPageDetailsSection(pageNumber);
                }
              }}
              className="bg-sky-700 text-white border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 text-center text-sm"
            />
            <button
              className={`${
                records.length < entriesPerPage ? "text-gray-400" : "text-black"
              } border border-sky-700 py-1 px-2 text-sm`}
              onClick={() =>
                setCurrentPageDetailsSection(currentPageDetailsSection + 1)
              }
              disabled={records.length < entriesPerPage}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TricycleDriverViolation;

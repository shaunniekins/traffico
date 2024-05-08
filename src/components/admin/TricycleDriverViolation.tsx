"use client";
import {
  fetchReportViolationsData,
  updateReportViolations,
} from "@/api/reportViolationsData";
import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import {
  MdOutlineEdit,
  MdOutlinePublishedWithChanges,
  MdOutlineSearch,
} from "react-icons/md";

const TricycleDriverViolation = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPageDetailsSection, setCurrentPageDetailsSection] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;

  const [records, setRecords] = useState<any[]>([]);
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);

  const [clickGoBackUpdate, setClickGoBackUpdate] = useState(false);

  const headerNames = [
    "ID",
    "Date",
    "Time",
    "License No.",
    "Driver",
    "Operator",
    "Complain",
    "Action Taken",
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
        setNumOfEntries(response?.count || 1);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [
    searchValue,
    entriesPerPage,
    currentPageDetailsSection,
    clickGoBackUpdate,
  ]);

  useEffect(() => {
    memoizedFetchReportViolationsData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ViewTricycleDriverViolationsAdmin",
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
            console.log("payload.new", payload.new);
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
          table: "ViewTricycleDriverViolationsAdmin",
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
  }, [
    searchValue,
    entriesPerPage,
    currentPageDetailsSection,
    clickGoBackUpdate,
  ]);

  const [currentComplaint, setCurrentComplaint] = useState<any | null>(null);

  const handleViewClick = (id: string) => {
    const record = records.find((record) => record.id === id);

    if (record) {
      setCurrentComplaint(record);
      // console.log("record", record);
      setActionTakenUpdate(record?.action_taken);
      setViolationUpdate(record?.violation);
      setNoteUpdate(record?.noteOption);

      setToggleMoreDetails(true);
    }
  };

  function formatDate(dateString: string) {
    const options = {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  }

  function formatTime(timeString: string) {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  const pathname = usePathname();

  const userType = pathname.includes("/admin/")
    ? "admin"
    : pathname.includes("/personnel/")
    ? "personnel"
    : null;

  const [toggleUpdateReportStatus, setToggleUpdateReportStatus] =
    useState(false);
  const [actionTakenUpdate, setActionTakenUpdate] = useState("");
  const [violationUpdate, setViolationUpdate] = useState("");
  const [noteUpdate, setNoteUpdate] = useState("");

  const handleUpdateStatusReport = async (currentReportId: string) => {
    // console.log("currentReportId: ", currentReportId);
    // setLoading(true);

    if (actionTakenUpdate === "penalty-imposed" && violationUpdate) {
      // console.log("penalty-imposed: ", violationUpdate);

      const updateData = {
        action_taken: actionTakenUpdate,
        violation: violationUpdate,
      };

      try {
        await updateReportViolations(currentReportId, updateData);
        // setLoading(false);
      } catch (error) {
        console.error("Error updating data:", error);
        // setLoading(false);
      }
    } else {
      // console.log("resolved: ", actionTakenUpdate);

      const updateData = {
        action_taken: actionTakenUpdate,
        noteOption: noteUpdate,
      };

      try {
        await updateReportViolations(currentReportId, updateData);
        // setLoading(false);
      } catch (error) {
        console.error("Error updating data:", error);
        // setLoading(false);
      }
    }

    setToggleUpdateReportStatus(false);
  };

  // console.log("currentComplaint", currentComplaint);

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
        <div className="w-full flex justify-between items-center border-b border-sky-700">
          <h1 className="px-3 py-2 sm:px-4">
            {!toggleMoreDetails ? "Details" : "More Details"}
          </h1>
          <div className="px-3 flex items-center gap-3">
            {userType === "personnel" && (
              <div className="flex gap-2">
                {toggleUpdateReportStatus && (
                  <button
                    className="bg-purple-700 text-white
                    border py-1 px-2 text-sm rounded-lg flex items-center gap-2"
                    // disabled={
                    //   !(
                    //     (actionTakenUpdate === "penalty-imposed" &&
                    //       violationUpdate) ||
                    //     actionTakenUpdate === "resolved"
                    //   )
                    // }
                    onClick={() => {
                      handleUpdateStatusReport(currentComplaint.id);
                    }}>
                    <MdOutlinePublishedWithChanges />
                    <span>Apply</span>
                  </button>
                )}
                <button
                  className={`${
                    toggleUpdateReportStatus
                      ? "bg-sky-700 text-white"
                      : "border-sky-700 text-sky-700"
                  } border py-1 px-2 text-sm rounded-lg flex items-center gap-2`}
                  onClick={() => {
                    setToggleUpdateReportStatus(!toggleUpdateReportStatus);

                    if (toggleUpdateReportStatus) {
                      setActionTakenUpdate(currentComplaint.action_taken);
                      setViolationUpdate(currentComplaint.violation);
                      setNoteUpdate(currentComplaint.noteOption);
                    }
                  }}>
                  <MdOutlineEdit />
                  <span>
                    {toggleUpdateReportStatus ? "Cancel" : "Update status"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {toggleMoreDetails ? (
          <div
            className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
            style={{ gridTemplateColumns: "auto 1fr" }}>
            {/* {userType === "personnel" &&
            currentComplaint?.action_taken === "pending" ? ( */}
            {userType === "personnel" ? (
              <>
                {/* <div> */}
                <label htmlFor="actionTakenUpdate">Action Taken</label>
                <select
                  name="actionTakenUpdate"
                  id="actionTakenUpdate"
                  value={actionTakenUpdate}
                  disabled={!toggleUpdateReportStatus}
                  onChange={(e) => setActionTakenUpdate(e.target.value)}
                  className={`border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full" ${
                    actionTakenUpdate === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : actionTakenUpdate === "archive"
                      ? "bg-green-200 text-green-700"
                      : actionTakenUpdate === "called-succesfully"
                      ? "bg-purple-200 text-purple-700"
                      : "bg-blue-200 text-blue-700"
                  }`}>
                  <option value="archive">Archive (cannot be contacted)</option>
                  <option value="called-successfully">
                    Successfully Called
                  </option>
                  <option value="pending">Pending</option>
                </select>
                {/* </div> */}
                {/* <div> */}
                <label className="py-10" htmlFor="note">
                  Note
                </label>
                <textarea
                  placeholder="Note"
                  disabled={!toggleUpdateReportStatus}
                  value={noteUpdate || ""}
                  onChange={(e) => setNoteUpdate(e.target.value)}
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full resize-none"
                />
                {/* </div> */}
              </>
            ) : (
              <>
                <label htmlFor="actionTaken">Action Taken</label>
                <input
                  type="text"
                  name="actionTaken"
                  id="actionTaken"
                  value={currentComplaint?.action_taken}
                  disabled={!toggleUpdateReportStatus}
                  className={`${
                    currentComplaint?.action_taken === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : currentComplaint?.action_taken === "resolved"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  } capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full`}
                />
              </>
            )}
            {currentComplaint?.action_taken === "penalty-imposed" && (
              <>
                <label htmlFor="violation">Violation</label>
                <input
                  type="text"
                  name="violation"
                  id="violation"
                  value={currentComplaint?.violation}
                  disabled
                  className="bg-red-200 text-red-700 capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
              </>
            )}
            <div className="w-full col-span-2 border-b-2 border-sky-700" />
            <label htmlFor="body_num">Body Num</label>
            <input
              type="text"
              name="body_num"
              id="body_num"
              value={currentComplaint?.body_num}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="date">Date</label>
            <input
              type="text"
              name="date"
              id="date"
              value={formatDate(currentComplaint?.date)}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              value={formatTime(currentComplaint?.time)}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="complain">Complain</label>
            <input
              name="complain"
              id="complain"
              value={currentComplaint?.complain}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="driver_name">Driver Name</label>
            <input
              type="text"
              name="driver_name"
              id="driver_name"
              value={currentComplaint?.driver_name}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="driver_license_num">Driver License No</label>
            <input
              type="text"
              name="driver_license_num"
              id="driver_license_num"
              value={currentComplaint?.driver_license_num}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="operator_name">Operator Name</label>
            <input
              type="text"
              name="operator_name"
              id="operator_name"
              value={currentComplaint?.operator_name}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="vehicle_plate_num">Vehicle Plate No</label>
            <input
              type="text"
              name="vehicle_plate_num"
              id="vehicle_plate_num"
              value={currentComplaint?.vehicle_plate_num}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="vehicle_date_registered">
              Vehicle Date Registered
            </label>
            <input
              type="text"
              name="vehicle_date_registered"
              id="vehicle_date_registered"
              value={formatDate(currentComplaint?.vehicle_date_registered)}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="vehicle_zone">Zone</label>
            <input
              type="text"
              name="vehicle_zone"
              id="vehicle_zone"
              value={currentComplaint?.vehicle_zone}
              disabled
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            {currentComplaint?.complainant_name && (
              <>
                <div className="w-full col-span-2 border-b-2 border-sky-700" />
                <label htmlFor="complainant_name">Complainant Name</label>
                <input
                  type="text"
                  name="complainant_name"
                  id="complainant_name"
                  value={currentComplaint?.complainant_name}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
                <label htmlFor="complainant_contact_num">
                  Complainant Number
                </label>
                <input
                  type="text"
                  name="complainant_contact_num"
                  id="complainant_contact_num"
                  value={currentComplaint?.complainant_contact_num}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
              </>
            )}
            {currentComplaint?.passenger_name.trim() && (
              <>
                <div className="w-full col-span-2 border-b-2 border-sky-700" />
                <label htmlFor="passenger_name">
                  Complainant Name (Registered)
                </label>
                <input
                  type="text"
                  name="passenger_name"
                  id="passenger_name"
                  value={currentComplaint?.passenger_name}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
              </>
            )}{" "}
            {currentComplaint?.enforcer_name.trim() && (
              <>
                <div className="w-full col-span-2 border-b-2 border-sky-700" />
                <label htmlFor="enforcer_name">
                  Complainant Name (Enforcer)
                </label>
                <input
                  type="text"
                  name="enforcer_name"
                  id="enforcer_name"
                  value={currentComplaint?.enforcer_name}
                  disabled
                  className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                />
              </>
            )}
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
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {formatTime(record.time)}
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
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <button
                      className={`${
                        record.action_taken === "resolved"
                          ? "border-green-700 text-green-700"
                          : record.action_taken === "penalty-imposed"
                          ? "border-red-700 text-red-700"
                          : record.action_taken === "pending"
                          ? "border-yellow-700 text-yellow-700"
                          : "border-purple-700 text-purple-700"
                      } border py-2 px-5 text-sm rounded-lg cursor-default`}>
                      {record.action_taken.charAt(0).toUpperCase() +
                        record.action_taken.slice(1)}
                    </button>
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
                  setClickGoBackUpdate(!clickGoBackUpdate);
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

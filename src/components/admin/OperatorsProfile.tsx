"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineSearch,
  MdOutlineWarning,
} from "react-icons/md";

import Select from "react-select";

import {
  colorOptions,
  brandMotorCycleOptions,
  associationOptions,
  routes,
} from "../../api/dataValues";

import {
  fetchOperatorProfileByName,
  fetchOperatorProfileData,
  insertOperatorProfileData,
} from "@/api/operatorProfilesData";
import { supabase } from "@/utils/supabase";

const OperatorsProfile = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPageDetailsSection, setCurrentPageDetailsSection] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;
  type Record = any;
  const [records, setRecords] = useState<Record[]>([]);

  // adding new data record
  const [toggleNewRecordButton, setToggleNewRecordButton] = useState(false);
  const [newOperator, setNewOperator] = useState(false);
  const [registerPermitView, setRegisterPermitView] = useState(false);
  const [registerPermitViewPage, setRegisterPermitViewPage] = useState(1);
  const [currentPageRegister, setCurrentPageRegister] = useState(1);

  const [newDateRegistered, setNewDateRegistered] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newMiddleName, setNewMiddleName] = useState("");
  const [newExtensionName, setNewExtensionName] = useState("");
  const [newBirthdate, setNewBirthdate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCivilStatus, setNewCivilStatus] = useState("");
  const [newIsActive, setNewIsActive] = useState(false);
  const [newFaceImage, setNewFaceImage] = useState<File | null>(null);
  const [newSignatureImage, setNewSignatureImage] = useState<File | null>(null);

  const [newBodyNumber, setNewBodyNumber] = useState("");
  const [newDateRegisteredVehicle, setNewDateRegisteredVehicle] = useState("");
  const [newChassisNumber, setNewChassisNumber] = useState("");
  const [newLTOPlateNumber, setNewLTOPlateNumber] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newMotorNumber, setNewMotorNumber] = useState("");
  const [newType, setNewType] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("Tricycle");
  const [newAssociation, setNewAssociation] = useState("");
  const [newZone, setNewZone] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedRouteObj, setSelectedRouteObj] = useState<{
    zone: number;
    route: string;
    adult: number;
    student: number;
    sp: number;
  } | null>(null);
  const options = routes.map((route) => ({
    value: route.zone,
    label: `Zone ${route.zone}`,
  }));

  // viewing existing data record
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);

  const headerNames = [
    "ID",
    "Plate No.",
    "Body No.",
    "Operator's Name",
    "Contact No.",
    "Address",
    "More Details",
    "Status",
  ];

  const [operators, setOperators] = useState<{ value: any; label: string }[]>(
    []
  );
  const [selectedOperator, setSelectedOperator] = useState<{
    value: any;
    label: string;
  } | null>(null);

  useEffect(() => {
    const fetchOperators = async () => {
      const response = await fetchOperatorProfileByName("");
      if (response && response.data) {
        setOperators(
          response.data.map((operator) => ({
            value: operator.id,
            label:
              `${operator.last_name}, ${operator.first_name}` +
              (operator.middle_name
                ? " " + operator.middle_name.charAt(0) + "."
                : "") +
              (operator.extension_name ? " " + operator.extension_name : ""),
          }))
        );
      }
    };

    fetchOperators();
  }, []);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToggleNewRecordButton(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const memoizedFetchOperatorProfileData = useCallback(async () => {
    try {
      const response = await fetchOperatorProfileData(
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
  }, [searchValue, entriesPerPage, currentPageDetailsSection]);

  useEffect(() => {
    memoizedFetchOperatorProfileData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "OperatorProfiles",
        },
        (payload) => {
          if (payload.new) {
            setRecords((prevRecord: any) => [
              ...prevRecord,
              payload.new as any,
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "OperatorProfiles",
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
          table: "OperatorProfiles",
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

  return (
    <div className="z-0 flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            {!registerPermitView
              ? "List of Operators/Owner"
              : "Register Tricycle Operator's Owner"}
          </h1>
          {!registerPermitView && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="submit"
                className="bg-sky-700 flex text-lg rounded-lg px-5 py-2 text-white"
                onClick={() =>
                  setToggleNewRecordButton(!toggleNewRecordButton)
                }>
                + New
              </button>
              {toggleNewRecordButton && (
                <div className="w-72 absolute mt-1 bg-sky-600 text-white py-2 rounded-lg flex flex-col items-start pl-3">
                  <button
                    className="hover:text-gray-900"
                    onClick={() => {
                      setNewOperator(false);
                      setToggleNewRecordButton(false);
                      setRegisterPermitView(true);
                    }}>
                    Add New for Existing Operator{" "}
                  </button>
                  <button
                    className="hover:text-gray-900"
                    onClick={() => {
                      setNewOperator(true);
                      setToggleNewRecordButton(false);
                      setRegisterPermitView(true);
                    }}>
                    Add New Operator
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {!registerPermitView && (
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
          {registerPermitView
            ? currentPageRegister === 1
              ? "Operator's Profile"
              : "Ownership Vehicle Information"
            : toggleMoreDetails
            ? "More Details of Operator's Profile"
            : "Details"}
        </h1>
        {registerPermitView ? (
          registerPermitViewPage === 1 ? (
            // operator's profile
            <div
              className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
              style={{ gridTemplateColumns: "auto 1fr" }}>
              {currentPageRegister === 1 ? (
                <>
                  {!newOperator ? (
                    <>
                      <label htmlFor="operator" className="mt-[-30rem]">
                        Select Existing Operator
                      </label>
                      <div className="mt-[-30rem]">
                        <Select
                          name="operator"
                          id="operator"
                          value={selectedOperator}
                          onChange={(selectedOption) => {
                            setSelectedOperator(selectedOption);
                            console.log("selectedOption", selectedOption);
                          }}
                          options={operators}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="newDateRegistered">Date Registered</label>
                      <input
                        type="date"
                        name="newDateRegistered"
                        id="newDateRegistered"
                        value={newDateRegistered}
                        placeholder="Date Registered"
                        onChange={(e) => setNewDateRegistered(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newLastName">Last Name</label>
                      <input
                        type="text"
                        name="newLastName"
                        id="newLastName"
                        value={newLastName}
                        placeholder="Last Name"
                        onChange={(e) => setNewLastName(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newFirstName">First Name</label>
                      <input
                        type="text"
                        name="newFirstName"
                        id="newFirstName"
                        value={newFirstName}
                        placeholder="First Name"
                        onChange={(e) => setNewFirstName(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newMiddleName">Middle Name</label>
                      <div>
                        <input
                          type="text"
                          name="newMiddleName"
                          id="newMiddleName"
                          value={newMiddleName}
                          placeholder="Middle Name"
                          onChange={(e) => setNewMiddleName(e.target.value)}
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                        />
                        <input
                          type="checkbox"
                          id="middleNameNone"
                          name="middleNameNone"
                          value="none"
                          className="mt-3"
                        />
                        <label htmlFor="middleNameNone">
                          {" "}
                          I have no middle name
                        </label>
                      </div>
                      <label htmlFor="newExtensionName">Extension Name</label>
                      <input
                        type="text"
                        name="newExtensionName"
                        id="newExtensionName"
                        value={newExtensionName}
                        placeholder="Extension Name"
                        onChange={(e) => setNewExtensionName(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newBirthdate">Date of Birth</label>
                      <input
                        type="date"
                        name="newBirthdate"
                        id="newBirthdate"
                        value={newBirthdate}
                        placeholder="Birthdate"
                        onChange={(e) => setNewBirthdate(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newBirthdate">Permanent Address</label>
                      <input
                        type="text"
                        name="newAddress"
                        id="newAddress"
                        value={newAddress}
                        placeholder="Address"
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <label htmlFor="newCivilStatus">Civil Status</label>
                      <select
                        name="newCivilStatus"
                        id="newCivilStatus"
                        value={newCivilStatus}
                        onChange={(e) => setNewCivilStatus(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                        <option value=""> -- Select --</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                      </select>
                      <label htmlFor="newIsActive">Active</label>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="newIsActive"
                          id="newIsActiveYes"
                          value="true"
                          checked={newIsActive === true}
                          onChange={(e) =>
                            setNewIsActive(e.target.value === "true")
                          }
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                        />
                        <label htmlFor="newIsActiveYes" className="mr-4">
                          Yes
                        </label>
                        <input
                          type="radio"
                          name="newIsActive"
                          id="newIsActiveNo"
                          value="false"
                          checked={newIsActive === false}
                          onChange={(e) =>
                            setNewIsActive(e.target.value !== "true")
                          }
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 mr-2"
                        />
                        <label htmlFor="newIsActiveNo">No</label>
                      </div>
                      <label htmlFor="newFaceImage">Face Image</label>
                      <input
                        type="file"
                        name="newFaceImage"
                        id="newFaceImage"
                        onChange={(e) =>
                          e.target.files && setNewFaceImage(e.target.files[0])
                        }
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full my-3"
                      />
                      <label htmlFor="newSignatureImage">Signature Image</label>
                      <input
                        type="file"
                        name="newSignatureImage"
                        id="newSignatureImage"
                        onChange={(e) =>
                          e.target.files &&
                          setNewSignatureImage(e.target.files[0])
                        }
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full my-3"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <label htmlFor="newBodyNumber">Body Number</label>
                  <input
                    type="number"
                    max={9999}
                    maxLength={4}
                    name="newBodyNumber"
                    id="newBodyNumber"
                    value={newBodyNumber}
                    placeholder="Body Number"
                    onChange={(e) => setNewBodyNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newDateRegisteredVehicle">
                    Date Registered
                  </label>
                  <input
                    type="date"
                    name="newDateRegisteredVehicle"
                    id="newDateRegisteredVehicle"
                    value={newDateRegisteredVehicle}
                    placeholder="Date Registered"
                    onChange={(e) =>
                      setNewDateRegisteredVehicle(e.target.value)
                    }
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newChassisNumber">Chassis Number</label>
                  <input
                    type="text"
                    name="newChassisNumber"
                    id="newChassisNumber"
                    value={newChassisNumber}
                    placeholder="Chassis Number"
                    onChange={(e) => setNewChassisNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newLTOPlateNumber">LTO Plate Number</label>
                  <input
                    type="text"
                    name="newLTOPlateNumber"
                    id="newLTOPlateNumber"
                    value={newLTOPlateNumber}
                    placeholder="LTO Plate Number"
                    onChange={(e) => setNewLTOPlateNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newColorCode">Color</label>
                  <Select
                    name="newColorCode"
                    id="newColorCode"
                    value={colorOptions.find(
                      (option) => option.value === newColorCode
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewColorCode(selectedOption.value);
                      }
                    }}
                    options={colorOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <label htmlFor="newMotorNumber">Motor Number</label>
                  <input
                    type="text"
                    name="newMotorNumber"
                    id="newMotorNumber"
                    value={newMotorNumber}
                    placeholder="Motor Number"
                    onChange={(e) => setNewMotorNumber(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newType">Make/Type</label>
                  <Select
                    name="newType"
                    id="newType"
                    value={brandMotorCycleOptions.find(
                      (option) => option.value === newType
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewType(selectedOption.value);
                      }
                    }}
                    options={brandMotorCycleOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <label htmlFor="newVehicleType">Vehicle Type</label>
                  <input
                    type="text"
                    name="newVehicleType"
                    id="newVehicleType"
                    value={newVehicleType}
                    disabled
                    placeholder="Vehicle Type"
                    onChange={(e) => setNewVehicleType(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                  />
                  <label htmlFor="newAssociation">Name of Association</label>
                  <Select
                    name="newAssociation"
                    id="newAssociation"
                    value={associationOptions.find(
                      (option) => option.value === newAssociation
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewAssociation(selectedOption.value);
                      }
                    }}
                    options={associationOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <label htmlFor="newZone">Zone</label>
                  <Select
                    name="newZone"
                    id="newZone"
                    value={newZone}
                    onChange={(selectedOption) => {
                      if (selectedOption !== null) {
                        setNewZone(selectedOption);
                        const route = routes.find(
                          (route) => route.zone === selectedOption.value
                        );
                        setSelectedRoute(route ? route.route : "");
                        if (route) {
                          setSelectedRouteObj(route);
                        }
                      }
                    }}
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  {newZone && (
                    <>
                      <label htmlFor="selectedRoute">Route</label>
                      <input
                        type="text"
                        id="selectedRoute"
                        value={selectedRoute}
                        readOnly
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      {selectedRouteObj && (
                        <>
                          <div>Adult</div>
                          <div className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                            {selectedRouteObj.adult}
                          </div>
                          <div>Student</div>
                          <div className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                            {selectedRouteObj.student}
                          </div>
                        </>
                      )}
                      <div className="justify-self-center col-span-2">
                        <button className="border border-sky-700 bg-sky-700 text-white py-2 px-4 text-sm rounded-lg">
                          Upload images
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            "Ownership Vehicle Information"
          )
        ) : toggleMoreDetails ? (
          "More Details of Operator's Profile"
        ) : (
          // details
          <table className="w-full text-sm text-center ">
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
                    {record.plate_num}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.body_num}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.last_name +
                      ", " +
                      record.first_name +
                      (record.middle_name
                        ? " " + record.middle_name.charAt(0) + "."
                        : "") +
                      (record.extension_name
                        ? " " + record.extension_name
                        : "")}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.contact_num}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.address}
                  </td>
                  <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                    <button className="bg-sky-200 text-sky-700 py-2 px-5 text-sm rounded-lg">
                      View
                    </button>
                  </td>
                  <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                    <button
                      className={`${
                        record.is_active ? "bg-green-500" : "bg-red-500"
                      } py-2 px-5 text-white text-sm rounded-lg`}>
                      {record.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!registerPermitView && !toggleMoreDetails ? (
        <div className="flex justify-end items-center w-full">
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
        </div>
      ) : (
        <div className="flex justify-end items-center w-full">
          <div className="flex select-none gap-4">
            <button
              className={`${
                currentPageRegister === 1
                  ? "border-red-700 bg-red-700 text-white"
                  : "border-sky-700 text-black"
              } border py-2 px-4 text-sm rounded-lg`}
              onClick={() => {
                if (currentPageRegister === 1) {
                  setRegisterPermitView(false);
                } else {
                  setCurrentPageRegister(currentPageRegister - 1);
                }
              }}>
              {currentPageRegister === 1 ? "Cancel" : "Back"}
            </button>
            <button
              className={`${
                currentPageRegister === 1
                  ? "border-sky-700 text-black"
                  : "bg-green-700 border-green-700 text-white"
              } border py-2 px-4 text-sm rounded-lg`}
              onClick={() => {
                if (currentPageRegister === 1) {
                  setCurrentPageRegister(currentPageRegister + 1);
                } else {
                  console.log("saved");
                }
              }}>
              {currentPageRegister === 1 ? "Next" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorsProfile;

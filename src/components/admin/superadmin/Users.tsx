"use client";

import {
  createNewUser,
  fetchUserListsData,
  insertUserListsData,
} from "@/api/userListsData";
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

const Users = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPageDetailsSection, setCurrentPageDetailsSection] = useState(1);
  // const [currentPageMoreDetailsSection, setCurrentPageMoreDetailsSection] =
  //   useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;

  const [records, setRecords] = useState<any[]>([]);

  const [registerUserView, setRegisterUserView] = useState(false);
  const [toggleMoreDetails, setToggleMoreDetails] = useState(false);
  const [toggleNewUserRecordButton, setToggleNewUserRecordButton] =
    useState(false);

  const headerNames = ["Name", "Role", "Email", "Password", "More Details"];

  const memoizedFetchDriverProfileData = useCallback(async () => {
    try {
      const response = await fetchUserListsData(
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
    memoizedFetchDriverProfileData();

    const channel = supabase
      .channel(`realtime sessions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "UserLists",
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
          table: "UserLists",
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
          table: "UserLists",
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

  const [userId, setUserId] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userBirthdate, setUserBirthdate] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleViewClick = (id: string) => {
    const record = records.find((record) => record.id === id);

    if (record) {
      setUserId(record.id);
      setUserLastName(record.last_name);
      setUserFirstName(record.first_name);
      setUserGender(record.gender);
      setUserBirthdate(record.birth_date);
      setUserAddress(record.address);
      setUserPhoneNumber(record.phone_number);
      setUserEmail(record.email);
      setUserPassword(record.password);

      setToggleMoreDetails(true);
    }
  };

  const [newLastName, setNewLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newBirthdate, setNewBirthdate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleNewUserRecord = async () => {
    const newRecord = {
      last_name: newLastName,
      first_name: newFirstName,
      gender: newGender,
      birth_date: newBirthdate,
      address: newAddress,
      phone_number: newPhoneNumber,
      email: newEmail,
      password: newPassword,
      role: newRole,
    };
    try {
      await createNewUser(newEmail, newPassword, newRecord);

      setNewLastName("");
      setNewFirstName("");
      setNewGender("");
      setNewBirthdate("");
      setNewAddress("");
      setNewPhoneNumber("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("");

      setRegisterUserView(false);
    } catch (error) {
      alert(
        "Failed to create user: A user with this email address has already been registered."
      );
    }
  };

  return (
    <div className="z-0 flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            {!registerUserView
              ? !toggleMoreDetails
                ? "Lists of Users"
                : "More Details of User"
              : "Register New User"}
          </h1>
          {!registerUserView && !toggleMoreDetails && (
            <button
              type="button"
              className="bg-sky-700 flex text-lg rounded-lg px-5 py-2 text-white"
              onClick={() => setRegisterUserView(!registerUserView)}>
              + New
            </button>
          )}
        </div>
        {!registerUserView && !toggleMoreDetails && (
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
          {registerUserView
            ? "User Profile"
            : toggleMoreDetails
            ? "Personal Information"
            : "Details"}
        </h1>
        {registerUserView ? (
          <div
            className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
            style={{ gridTemplateColumns: "auto 1fr" }}>
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
            <label htmlFor="newGender">Gender</label>
            <select
              name="newGender"
              id="newGender"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
              <option value=""> Select...</option>
              <option value="single">Male</option>
              <option value="married">Female</option>
              <option value="married">Others</option>
            </select>
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
            <label htmlFor="newAddress">Permanent Address</label>
            <input
              type="text"
              name="newAddress"
              id="newAddress"
              value={newAddress}
              placeholder="Address"
              onChange={(e) => setNewAddress(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="newPhoneNumber">Contact Number</label>
            <input
              type="text"
              name="newPhoneNumber"
              id="newPhoneNumber"
              value={newPhoneNumber}
              placeholder="Contact Number"
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="newEmail">Email</label>
            <input
              type="text"
              name="newEmail"
              id="newEmail"
              value={newEmail}
              placeholder="Email"
              onChange={(e) => setNewEmail(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="newPassword">Password</label>
            <input
              type="text"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              placeholder="Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="newRole">Role</label>
            <select
              name="newRole"
              id="newRole"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
              <option value=""> Select...</option>
              <option value="personnel">Personnel</option>
              <option value="enforcer">Enforcer</option>
              <option value="passenger">Passenger</option>
            </select>
          </div>
        ) : toggleMoreDetails ? (
          <div
            className="grid grid-cols-2 items-center pt-7 px-20 pb-20 gap-5 overflow-y-auto w-full h-full"
            style={{ gridTemplateColumns: "auto 1fr" }}>
            <label htmlFor="userLastName">Last Name</label>
            <input
              type="text"
              name="userLastName"
              id="userLastName"
              value={userLastName}
              placeholder="Last Name"
              onChange={(e) => setUserLastName(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="userFirstName">First Name</label>
            <input
              type="text"
              name="userFirstName"
              id="userFirstName"
              value={userFirstName}
              placeholder="First Name"
              onChange={(e) => setUserFirstName(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="userGender">Gender</label>
            <select
              name="userGender"
              id="userGender"
              value={userGender}
              onChange={(e) => setUserGender(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
              {/* <option value=""> Select...</option> */}
              <option value="single">Male</option>
              <option value="married">Female</option>
              <option value="married">Others</option>
            </select>
            <label htmlFor="userBirthdate">Date of Birth</label>
            <input
              type="date"
              name="userBirthdate"
              id="userBirthdate"
              value={userBirthdate}
              placeholder="Birthdate"
              onChange={(e) => setUserBirthdate(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="userAddress">Permanent Address</label>
            <input
              type="text"
              name="userAddress"
              id="userAddress"
              value={userAddress}
              placeholder="Address"
              onChange={(e) => setUserAddress(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="userPhoneNumber">Contact Number</label>
            <input
              type="text"
              name="userPhoneNumber"
              id="userPhoneNumber"
              value={userPhoneNumber}
              placeholder="Contact Number"
              onChange={(e) => setUserPhoneNumber(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="userEmail">Email</label>
            <input
              type="text"
              name="userEmail"
              id="userEmail"
              value={userEmail}
              placeholder="Email"
              onChange={(e) => setUserEmail(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
            <label htmlFor="userPassword">Password</label>
            <input
              type="text"
              name="userPassword"
              id="userPassword"
              value={userPassword}
              placeholder="Password"
              onChange={(e) => setUserPassword(e.target.value)}
              className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
            />
          </div>
        ) : (
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
                    {record.last_name + ", " + record.first_name}
                  </td>
                  <td className="px-6 font-medium text-gray-900 whitespace-nowrap">
                    <button
                      className={`${
                        record.role === "personnel"
                          ? "bg-cyan-200 text-cyan-700"
                          : record.role === "enforcer"
                          ? "bg-purple-200 text-purple-700"
                          : "bg-yellow-200 text-yellow-700"
                      } py-2 px-5 text-sm rounded-lg`}>
                      {record.role.charAt(0).toUpperCase() +
                        record.role.slice(1)}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.email}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record.password}
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

      {!registerUserView ? (
        <div className="flex justify-end items-center w-full">
          {toggleMoreDetails ? (
            <div className="flex justify-end items-center w-full">
              <div className="flex select-none gap-4">
                <button
                  className={`
                      border-sky-700 bg-sky-700 text-white 
                   border py-2 px-4 text-sm rounded-lg`}
                  onClick={() => {
                    setToggleMoreDetails(false);
                  }}>
                  Okay
                </button>
              </div>
            </div>
          ) : (
            <div className="flex select-none gap-0">
              <button
                className={`${
                  currentPageDetailsSection === 1
                    ? "text-gray-400"
                    : "text-black"
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
                  records.length < entriesPerPage
                    ? "text-gray-400"
                    : "text-black"
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
      ) : (
        <div className="flex justify-end items-center w-full">
          <div className="flex select-none gap-4">
            <button
              className={`
            border-red-700 bg-red-700 text-white border py-2 px-4 text-sm rounded-lg`}
              onClick={() => {
                setRegisterUserView(false);

                setNewLastName("");
                setNewFirstName("");
                setNewGender("");
                setNewBirthdate("");
                setNewAddress("");
                setNewPhoneNumber("");
                setNewEmail("");
                setNewPassword("");
                setNewRole("");
              }}>
              Back
            </button>
            <button
              className={`${
                !newLastName ||
                !newFirstName ||
                !newGender ||
                !newBirthdate ||
                !newAddress ||
                !newPhoneNumber ||
                !newEmail ||
                !newPassword
                  ? "bg-gray-600"
                  : "bg-sky-700"
              } text-white border py-2 px-4 text-sm rounded-lg`}
              onClick={() => handleNewUserRecord()}
              disabled={
                !newLastName ||
                !newFirstName ||
                !newGender ||
                !newBirthdate ||
                !newAddress ||
                !newPhoneNumber ||
                !newEmail ||
                !newPassword
              }>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

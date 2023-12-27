"use client";

import { useState } from "react";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineSearch,
  MdOutlineWarning,
} from "react-icons/md";

const OperatorsProfile = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numOfEntries, setNumOfEntries] = useState(1);
  const entriesPerPage = 10;
  type Record = any;
  const [records, setRecords] = useState<Record[]>([]);

  const headerNames = [
    "ID",
    "Plate No.",
    "Body No.",
    "Operator&nsbp;Name",
    "Contact No.",
    "Address",
    "More Details",
    "Status",
  ];

  return (
    <div className="z-0 flex flex-col gap-10 h-full">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <div className="flex gap-5 items-center">
          <h1 className="flex font-bold text-3xl text-sky-700 ">
            List of Operators/Owner
          </h1>
          {/* {userType === "admin" && ( */}
          <button
            type="submit"
            className="bg-sky-700 flex text-lg rounded-lg px-5 py-2 text-white"
            // onClick={() => setShowModal(true)}
          >
            + New
          </button>
        </div>
        {/* )} */}
        <div className="relative">
          <MdOutlineSearch className="z-0 absolute text-gray-400 right-3 top-1/2 transform -translate-y-1/2 text-2xl" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search"
            className="w-full border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg pl-3 pr-10 py-2"
          />
        </div>
      </div>
      <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-[70dvh] border border-sky-700">
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
            <tr>
              <td>001</td>
              <td>6515tg</td>
              <td>0756</td>
              <td>Espina, Ciraco A.</td>
              <td>090789</td>
              <td>Sanfrance</td>
              <td>View</td>
              <td>active</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center w-full">
        <div className="flex select-none gap-0">
          <button
            className={`${
              currentPage === 1 ? "text-gray-700" : "text-black"
            } border border-sky-700 py-2 px-2 text-sm`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}>
            Prev
          </button>
          <input
            type="number"
            min="1"
            max={Math.ceil(numOfEntries / 10)}
            value={currentPage}
            onChange={(e) => {
              const pageNumber = Number(e.target.value);
              if (
                pageNumber >= 1 &&
                pageNumber <= Math.ceil(numOfEntries / 10)
              ) {
                setCurrentPage(pageNumber);
              }
            }}
            className="bg-sky-700 text-white border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 text-center text-sm"
          />
          <button
            className={`${
              records.length < entriesPerPage ? "text-gray-400" : "text-black"
            } border border-sky-700 py-1 px-2 text-sm`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={records.length < entriesPerPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperatorsProfile;

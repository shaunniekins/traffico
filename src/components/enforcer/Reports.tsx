"use client";

import { useState } from "react";

const Reports = () => {
  const [currentView, setCurrentView] = useState("personal");
  //   const [records, setRecords] = useState<any[]>([]);

  // Initialize the state with some temporary data
  const [records, setRecords] = useState<any[]>([
    {
      "Body No.": "1",
      "Body Color": "Red",
      "Assigned Route": "Route 1",
      Name: "John Doe",
      "Driver's License": "DL12345",
      "Plate No.": "PN12345",
      "Franchise No.": "FN12345",
      "Date Registed": "2022-01-01",
      "Tricycle Owner": "John Doe",
      "Address Operator": "123 Street, City",
    },
  ]);

  const headerNames = [
    "Body No.",
    "Body Color",
    "Assigned Route",
    "Name",
    "Driver's License",
    "Plate No.",
    "Franchise No.",
    "Date Registed",
    "Tricycle Owner",
    "Address Operator",
  ];

  return (
    <div className="flex flex-col items-center select-none overflow-y-hidden h-full p-3 gap-5 overflow-hidden">
      <div className="w-full flex gap-3">
        <button
          className={`${
            currentView === "personal"
              ? "bg-gray-300 font-semibold text-sky-700"
              : "bg-gray-200"
          } w-1/2 rounded-full py-2 px-3 text-sm`}
          onClick={() => setCurrentView("personal")}>
          Personal Reports
        </button>
        <button
          className={`${
            currentView === "passengers"
              ? "bg-gray-300 font-semibold text-sky-700"
              : "bg-gray-200"
          } w-1/2 rounded-full py-2 px-3 text-sm`}
          onClick={() => setCurrentView("passengers")}>
          Passenger Reports
        </button>
      </div>
      {/* <div className="w-full h-[20rem] flex justify-start rounded-t-3xl bg-red-500 overflow-x-auto border border-blue-500"> */}
      <div className="w-full overflow-x-auto sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-full border border-sky-700">
        <table className="w-full text-sm text-center">
          <thead className="text-xs uppercase bg-sky-700 text-white py-2">
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
                {headerNames.map((header, headerIndex) => (
                  <td
                    key={headerIndex}
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {record[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;

import Image from "next/image";
import React, { useRef } from "react";
const PrintReports = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <div ref={ref} className="m-3">
      <div className="flex flex-col w-full border border-gray-700 bg-white">
        <div className="w-full flex items-center justify-center py-2">
          <div className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap w-full text-center text-lg font-bold">
            REPORTS OF TRICYCLE DRIVER
          </div>
          <div className="flex justify-center gap-3 w-full">
            <Image
              src={"/bunawan-logo.png"}
              alt="Logo"
              width={50}
              height={50}
              className="w-[10%]"
            />
            <div className="flex flex-col text-sm">
              <span>Republic of the Philippines</span>
              <span>Province of Agusan del Sur</span>
              <span>MUNICIPAL OF SAN FRANCISCO </span>
              <span>San, Francisco, Agusan del Sur</span>
            </div>
          </div>
        </div>
        <table className="w-full text-sm text-center">
          <thead>
            <tr>
              <th
                colSpan={8}
                key={"col3"}
                scope="col"
                className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap border-t border-b border-black">
                As of January 1 – January 30 ,2024
              </th>
            </tr>
            <tr>
              {[
                "No.",
                "NAME",
                "ADDRESS",
                "OVERSPEEDING",
                "OVERCHARGING",
                "OVERLOADING",
                "OTHERS",
                "TOTAL",
              ].map((header, index) => (
                <th
                  key={`col${index + 4}`}
                  scope="col"
                  className={`px-3 py-2 sm:px-4 sm:py-3 border-b ${
                    index !== 0 ? "border-l" : ""
                  } border-black`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <td
                    key={`data${index}`}
                    className={`px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap ${
                      index !== 0 && "border-l"
                    } border-black`}>
                    Data
                  </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default PrintReports;

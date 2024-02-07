import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface DriverProfile {
  first_name: string;
  id: number;
  last_name: string;
  license_num: string;
  middle_name: string;
}

interface VehicleOwnershipRecord {
  id: number;
  zone: number;
  lto_plate_num: string;
  date_registered: string;
}

interface OperatorProfile {
  VehicleOwnershipRecords: VehicleOwnershipRecord[];
  address: string;
  first_name: string;
  id: number;
  last_name: string;
  middle_name: string;
}

interface Application {
  DriverProfiles: DriverProfile;
  OperatorProfiles: OperatorProfile;
  body_num: string;
  franchise_status: string;
  id: number;
  operator_id: number;
}

interface RecordType {
  id: number;
  body_num: string;
  complain: string;
  date: string;
  time: string;
  Applications: Application;
  action_taken: string;
  complainant_contact_num: string | null;
  complainant_name: string | null;
  enforcer_id: number | null;
  passenger_id: number | null;
  route: string | null;
  violation: string;
}

interface MoreInfoDetailsProps {
  record: any;
  setShowBottomBar: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleMoreDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoreInfoDetailsComponent: React.FC<MoreInfoDetailsProps> = ({
  record,
  setShowBottomBar,
  setToggleMoreDetails,
}) => {
  console.log("record here: ", record);

  const handleExit = () => {
    // if (window.confirm("Are you sure you want to exit?")) {
    setShowBottomBar(true);
    setToggleMoreDetails(false);
    // }
  };

  return (
    <div className="z-0 flex flex-col gap-10 h-full overflow-y-auto">
      <div className="h-full w-full flex flex-col justify-between">
        <div className="flex justify-between items-center flex-col mx-5 h-full overflow-y-hidden sm:overflow-y-auto">
          <div className="w-full text-lg my-3">
            <button
              onClick={() => {
                handleExit();
              }}
              className="py-1 flex items-center gap-1">
              <IoChevronBack /> <span className="text-sm">back</span>
            </button>
            {/* <button
            //   onClick={handleReportSubmit}
            //   disabled={
            //     !currentComplain ||
            //     (userType === "passenger"
            //       ? !currentComplainantName || !currentContactNumber
            //       : !violation)
            //   }
            //   className={`
            //   ${
            //     !currentComplain ||
            //     (userType === "passenger"
            //       ? !currentComplainantName || !currentContactNumber
            //       : !violation)
            //       ? "bg-gray-700 text-gray-300"
            //       : "bg-sky-700 text-white"
            //   }
            //    bg-gray-700 text-gray-300 w-full p-2 rounded-md`}
            className="bg-gray-700 text-gray-300 w-full p-2 rounded-md">
            Report
          </button> */}
          </div>
          <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-full gap-3 flex flex-col mb-5">
            <div>
              <label htmlFor="currentBodyNum">Body Number</label>
              <input
                type="text"
                name="currentBodyNum"
                id="currentBodyNum"
                value={record?.body_num}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="currentDriver">Driver's Name</label>
              <input
                type="text"
                name="currentDriver"
                id="currentDriver"
                value={`${
                  record?.Applications?.DriverProfiles?.first_name || ""
                } ${record?.Applications?.DriverProfiles?.middle_name || ""} ${
                  record?.Applications?.DriverProfiles?.last_name || ""
                }`}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="currentDriverLicenseNum">
                Driver's License No.
              </label>
              <input
                type="text"
                name="currentDriverLicenseNum"
                id="currentDriverLicenseNum"
                value={record?.Applications?.DriverProfiles?.license_num}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="plate_num">Plate No.</label>
              <input
                type="text"
                name="plate_num"
                id="plate_num"
                value={
                  record?.Applications?.OperatorProfiles
                    ?.VehicleOwnershipRecords[0]?.lto_plate_num
                }
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="franchise_status">Franchise Status</label>
              <input
                type="text"
                name="franchise_status"
                id="franchise_status"
                value={record?.Applications?.franchise_status}
                readOnly
                className="capitalize border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="date_registered">Date Registered</label>
              <input
                type="text"
                name="date_registered"
                id="date_registered"
                value={new Date(
                  record?.Applications?.OperatorProfiles?.VehicleOwnershipRecords[0]?.date_registered
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="tricycle_operator">Tricycle Operator</label>
              <input
                type="text"
                name="tricycle_operator"
                id="tricycle_operator"
                value={`${
                  record?.Applications?.OperatorProfiles?.first_name || ""
                } ${
                  record?.Applications?.OperatorProfiles?.middle_name || ""
                } ${record?.Applications?.OperatorProfiles?.last_name || ""}`}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="operator_address">Operator's Address</label>
              <input
                type="text"
                name="operator_address"
                id="operator_address"
                value={record?.Applications?.OperatorProfiles?.address}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-3 items-center">
              <label htmlFor="currentDate">Date</label>
              <label htmlFor="currentTime">Time</label>
              <input
                type="date"
                name="currentDate"
                id="currentDate"
                value={record?.date}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
              <input
                type="time"
                name="currentTime"
                id="currentTime"
                value={record?.time}
                readOnly
                className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
              />
            </div>
            {/* {userType === "enforcer" && (
                <div>
                  <label htmlFor="violation">Violation</label>
                  <select
                    name="violation"
                    id="violation"
                    // value={violation}
                    // onChange={(e) => setViolation(e.target.value)}
                    className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-white">
                    <option value="">Select...</option>
                    <option value="first-offense">1st Offense: Php300</option>
                    <option value="second-offense">
                      2nd Offense: Php400
                    </option>
                    <option value="third-offense">3rd Offense: Php500</option>
                    <option value="cancel-permit">
                      Cancellation of Permit
                    </option>
                  </select>
                </div>
              )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoDetailsComponent;

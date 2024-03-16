"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { MdOutlineShareLocation } from "react-icons/md";
import { BsCheck2Circle, BsInputCursorText } from "react-icons/bs";
import {
  fetchApplicationData,
  fetchApplicationDataForQRScanner,
} from "@/api/applicationsData";
import { supabase } from "@/utils/supabase";
import Select from "react-select";
import { routes } from "@/api/dataValues";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { insertReportViolations } from "@/api/reportViolationsData";
import dynamic from "next/dynamic";
import { UserContext } from "@/utils/UserContext";
import { LoadingScreenSection } from "./LoadingScreen";

const MapContainerComponent = dynamic(() => import("./MapContainer"), {
  ssr: false,
});

const QrScannerComponent = ({
  setShowBottomBar,
  setCurrentView,
}: {
  setShowBottomBar: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { userName, userId, userRole } = useContext(UserContext);

  const [color, setColor] = useState("#1F619F");
  const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
  //   const [displayScanResult, setDisplayScanResult] = useState(false);
  //   const [result, setResult] = useState("");
  const [bodyNumberInput, setBodyNumberInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bodyNumberFinalValue, setBodyNumberFinalValue] = useState("");

  const pathname = usePathname();
  const userType = pathname.includes("/passenger/")
    ? "passenger"
    : pathname.includes("/enforcer/")
    ? "enforcer"
    : null;

  const [origin, setOrigin] = useState<[number, number]>([0, 0]);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setOrigin([position.coords.latitude, position.coords.longitude]);
  //   });
  // }, []);

  const [distance, setDistance] = useState<number | null>(null);

  const [isError, setIsError] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setBodyNumberInput("");
  };

  useEffect(() => {
    if (isQRCodeDetected) {
      setColor("rgba(0, 255, 0, 0.5)"); //green
      let timer = setTimeout(() => {
        setIsQRCodeDetected(false);
        setColor("#1F619F");
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }

    // if (displayScanResult) {
    //   let timer = setTimeout(() => {
    //     setDisplayScanResult(false);
    //   }, 3500);

    //   return () => {
    //     clearTimeout(timer);
    //   };
    // }
  }, [isQRCodeDetected]);

  useEffect(() => {
    if (isError) {
      let timer = setTimeout(() => {
        setIsError(false);
      }, 3500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isError]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 4) {
      setBodyNumberInput(numericValue);
    }
  };

  const handleScanResult = (result: any) => {
    if (!result) return;

    // console.log("res: ", result);

    if (result.length !== 4) {
      setIsError(true);
      return;
    }

    setIsQRCodeDetected(true);
    // setDisplayScanResult(true);
    setShowBottomBar(false);
    setBodyNumberFinalValue(result);
    handleFetchpplicationData(result, "bodyNum");
  };

  const [records, setRecords] = useState<any[]>([]);
  const [currentBodyNum, setCurrentBodyNum] = useState("");
  const [currentDriver, setCurrentDriver] = useState<any>("");
  const [currentComplaintType, setCurrentComplaintType] = useState("");
  const [currentComplainantName, setCurrentComplainantName] = useState("");
  const [currentContactNumber, setCurrentContactNumber] = useState("");
  type OptionType = {
    value: number;
    label: string;
  };
  const [currentComplain, setCurrentComplain] = useState<OptionType | null>(
    null
  );

  const [currentDate, setCurrentDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [currentTime, setCurrentTime] = useState(
    () => new Date().toTimeString().split(" ")[0]
  );
  // const [violation, setViolation] = useState("");

  const [toggleSearchLoc, setToggleSearchLoc] = useState(false);

  const handleFetchpplicationData = async (
    bodyNum: string,
    filterType: string
  ) => {
    setLoading(true);
    try {
      const response = await fetchApplicationDataForQRScanner(
        bodyNum,
        filterType
      );
      if (response?.error) {
        console.error(response.error);
        setLoading(false);
      } else {
        setRecords(response?.data || []);
        setCurrentBodyNum(response?.data[0]?.body_num);

        const driverProfile: any = response?.data[0]?.DriverProfiles;

        setCurrentDriver(
          `${driverProfile?.first_name} ${driverProfile?.last_name}`
        );
        setCurrentDate(new Date().toISOString().split("T")[0]);
        setCurrentTime(new Date().toTimeString().split(" ")[0]);

        // console.log(response?.data[0]);
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  };

  const reportTypeOptions: { value: number; label: string }[] = [
    { value: 1, label: "Over-Paying" },
    { value: 2, label: "Over-Loading" },
    { value: 3, label: "Over-Speeding" },
    { value: 4, label: "Over-Pricing" },
  ];

  const [reportMessage, setReportMessage] = useState("");
  const [toggleReportMessage, setToggleReportMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReportSubmit = async () => {
    setLoading(true);

    const reportAuthPassengerData = {
      body_num: currentBodyNum,
      complain: currentComplain?.label,
      date: currentDate,
      time: currentTime,
      passenger_id: userId,
      // route:
    };

    const reportPassengerData = {
      body_num: currentBodyNum,
      complain: currentComplain?.label,
      date: currentDate,
      time: currentTime,
      // passenger_id:
      complainant_name: currentComplainantName,
      complainant_contact_num: currentContactNumber,
      // route:
    };

    const reportEnforcerData = {
      body_num: currentBodyNum,
      complain: currentComplain?.label,
      date: currentDate,
      time: currentTime,
      // violation: violation,
      enforcer_id: userId,
    };

    if (userType === "passenger") {
      await insertReportViolations(reportAuthPassengerData);
      setLoading(false);
      setCurrentView("lists");
    } else if (userType === "enforcer") {
      await insertReportViolations(reportEnforcerData);
      setLoading(false);
      setCurrentView("lists");
    } else if (!userType) {
      await insertReportViolations(reportPassengerData);
      setLoading(false);
    }
    setShowBottomBar(true);
    setToggleReportMessage(true);
  };

  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      resetValues();
    }
  };

  const resetValues = () => {
    userType === "enforcer" && setCurrentView("lists");

    setShowBottomBar(true);
    setRecords([]);
    setCurrentDriver("");
    setCurrentComplain(null);
    setCurrentComplainantName("");
    setCurrentContactNumber("");
    setCurrentDate("");
    setCurrentTime("");
    // setViolation("");
  };

  return (
    <>
      {records && records.length === 0 ? (
        <div className="flex justify-center items-center h-[100svh] select-none overflow-y-hidden">
          {loading && <LoadingScreenSection />}

          <QrScanner
            viewFinder={(props) => (
              <div className="flex flex-col items-center justify-center absolute w-full h-full top-0 left-0 z-10">
                <svg
                  viewBox="0 0 100 100"
                  className="z-20 w-24 h-24 transform scale-[3]  md:scale-[7]">
                  <path
                    fill="none"
                    d="M23,0 L0,0 L0,23"
                    stroke={color}
                    strokeWidth="5"
                  />
                  <path
                    fill="none"
                    d="M0,77 L0,100 L23,100"
                    stroke={color}
                    strokeWidth="5"
                  />
                  <path
                    fill="none"
                    d="M77,100 L100,100 L100,77"
                    stroke={color}
                    strokeWidth="5"
                  />
                  <path
                    fill="none"
                    d="M100,23 L100,0 77,0"
                    stroke={color}
                    strokeWidth="5"
                  />
                </svg>
              </div>
            )}
            scanDelay={1000}
            onDecode={(result) => handleScanResult(result)}
            onError={(error) => console.log(error?.message)}
            containerStyle={{
              width: "100%",
              height: "100%",
            }}
            videoStyle={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
          <div className="justify-center container mx-auto z-30 absolute top-5 w-full px-3 flex">
            <div className="space-x-2">
              <button
                className="bg-sky-700 text-white rounded-2xl px-4 py-2 text-[30px]"
                onClick={() => setIsModalOpen(true)}>
                <BsInputCursorText />
              </button>
            </div>
          </div>
          {isError && (
            <div className="justify-center items-end container mx-auto z-30 absolute bottom-48 w-full flex">
              <p className="text-sm text-red-700 font-semibold">
                QR Code is not supported!
              </p>
            </div>
          )}
          <InputModal
            isOpen={isModalOpen}
            onClose={closeModal}
            bodyNumber={bodyNumberInput}
            handleInputChange={handleInputChange}
            handleScanResult={handleScanResult}
          />
        </div>
      ) : (
        <>
          {!toggleSearchLoc ? (
            <div className="z-0 flex flex-col gap-10 h-full overflow-y-auto sm:overflow-y-hidden">
              <div className="h-full w-full flex flex-col justify-between">
                <div className="flex justify-between items-center flex-col m-5 h-full overflow-x-hidden sm:overflow-y-hidden">
                  {/* <div className="rounded-[2rem] overflow-hidden flex justify-center items-center">
                  <Image
                    src="/traffico-logo.jpeg"
                    alt="Traffico Logo"
                    width={200}
                    height={200}
                  />
                </div> */}
                  <h1 className="py-2 sm:px-4 mb-6 font-semibold text-sky-700 text-2xl w-full flex justify-between items-center">
                    <button
                      onClick={() => {
                        handleExit();
                      }}>
                      <IoChevronBack />
                    </button>
                    <span>REPORT TRICYCLE</span>
                    <span className="text-[#f2f2f2]">
                      {" "}
                      <IoChevronForward />
                    </span>
                  </h1>
                  <div className="w-full overflow-x-hidden sm:overflow-y-hidden rounded-t-lg rounded-b-lg h-full gap-3 flex flex-col">
                    <div>
                      <label htmlFor="currentBodyNum">Body Number</label>
                      <input
                        type="text"
                        name="currentBodyNum"
                        id="currentBodyNum"
                        value={currentBodyNum}
                        disabled
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="currentDriver">Driver&lsquo;s Name</label>
                      <input
                        type="text"
                        name="currentDriver"
                        id="currentDriver"
                        value={currentDriver}
                        disabled
                        onChange={(e) => setCurrentDriver(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="currentComplain">Complain</label>
                      <Select
                        name="currentComplain"
                        id="currentComplain"
                        value={currentComplain}
                        onChange={(selectedOption: OptionType | null) => {
                          if (selectedOption) {
                            setCurrentComplain(selectedOption);
                          }
                        }}
                        options={reportTypeOptions}
                      />
                    </div>

                    {!userType && (
                      <>
                        <div>
                          <label htmlFor="currentComplainantName">
                            Complainant Name
                          </label>
                          <input
                            type="text"
                            name="currentComplainantName"
                            id="currentComplainantName"
                            value={currentComplainantName}
                            placeholder="Enter complainant name"
                            onChange={(e) =>
                              setCurrentComplainantName(e.target.value)
                            }
                            className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="currentContactNumber">
                            Complainant Contact Number
                          </label>
                          <input
                            type="text"
                            name="currentContactNumber"
                            id="currentContactNumber"
                            value={currentContactNumber}
                            placeholder="Enter complainant contact number"
                            onChange={(e) =>
                              setCurrentContactNumber(e.target.value)
                            }
                            className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                          />
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-2 gap-x-3 items-center">
                      <label htmlFor="currentDate">Date</label>
                      <label htmlFor="currentTime">Time</label>

                      <input
                        type="date"
                        name="currentDate"
                        id="currentDate"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                      <input
                        type="time"
                        name="currentTime"
                        id="currentTime"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full"
                      />
                    </div>
                    {/* {userType === "enforcer" && (
                      <div>
                        <label htmlFor="violation">Violation</label>
                        <select
                          name="violation"
                          id="violation"
                          value={violation}
                          onChange={(e) => setViolation(e.target.value)}
                          className="border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full bg-white">
                          <option value="">Select...</option>
                          <option value="first-offense">
                            1st Offense: Php300
                          </option>
                          <option value="second-offense">
                            2nd Offense: Php400
                          </option>
                          <option value="third-offense">
                            3rd Offense: Php500
                          </option>
                          <option value="cancel-permit">
                            Cancellation of Permit
                          </option>
                        </select>
                      </div>
                    )} */}
                    {/* {(!userType || userType === "passenger") && (
                      <button
                        onClick={() => setToggleSearchLoc(true)}
                        className="bg-sky-700 text-white focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-2 w-full">
                        {destination ? "Edit Location" : "Search Location"}
                      </button>
                    )} */}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 text-lg m-5">
                  <button
                    onClick={() => {
                      handleExit();
                    }}
                    className="w-full p-2 bg-red-700 text-white rounded-md">
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    // disabled={
                    //   !currentComplain ||
                    //   (userType === "passenger"
                    //     ? !currentComplainantName || !currentContactNumber
                    //     : !violation)
                    // }
                    disabled={
                      !currentComplain ||
                      (!userType &&
                        (!currentComplainantName || !currentContactNumber))
                    }
                    className={`${
                      !currentComplain ||
                      (!userType &&
                        (!currentComplainantName || !currentContactNumber))
                        ? "bg-gray-700 text-gray-300"
                        : "bg-sky-700 text-white"
                    } w-full p-2 rounded-md`}>
                    Report
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div className="w-full mx-5 text-lg my-5 z-10 absolute">
                <button
                  onClick={() => setToggleSearchLoc(false)}
                  className="bg-sky-700 text-white rounded-lg px-3 py-2 flex items-center gap-1">
                  <IoChevronBack />{" "}
                  <span className="text-sm">{destination ? "OK" : "back"}</span>
                </button>
              </div>

              {/* <MapContainerComponent
                key={1}
                origin={origin}
                destination={destination}
                setOrigin={setOrigin}
                setDestination={setDestination}
                distance={distance}
                setDistance={setDistance}
              /> */}
            </div>
          )}
        </>
      )}
      {toggleReportMessage && (
        <div
          className={`z-50 fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black`}>
          <div
            className={`rounded-2xl bg-white text-black mx-3 p-4 gap-4 flex flex-col items-center`}>
            <div className="text-7xl text-green-700">
              <BsCheck2Circle />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-lg font-semibold">Report Submitted</h3>
              <p className="text-sm">Wait for the resolution to the case...</p>
            </div>
            <button
              onClick={() => {
                resetValues();
                setToggleReportMessage(false);
              }}
              className="w-full p-2 bg-sky-700 text-white rounded-md">
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QrScannerComponent;

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  bodyNumber: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleScanResult: (idNumber: string) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  bodyNumber,
  handleInputChange,
  handleScanResult,
}) => {
  const handleSend = () => {
    handleScanResult(bodyNumber);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[100] transition-opacity container mx-auto px-3 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      <div className="bg-white p-4 shadow-md rounded-lg flex flex-col z-[110] gap-3">
        <input
          type="text"
          placeholder="0000"
          className="w-full p-2 border rounded-md text-6xl text-center"
          value={bodyNumber}
          onChange={handleInputChange}
          // onKeyDown={handleEnterKey}
        />

        <div className="w-full flex justify-end space-x-3 text-lg">
          <button
            onClick={onClose}
            className="w-full p-2 bg-red-700 text-white rounded-md">
            Close
          </button>
          <button
            onClick={handleSend}
            className="w-full p-2 bg-sky-700 text-white rounded-md">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

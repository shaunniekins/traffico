"use client";

import { useEffect, useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { MdOutlineShareLocation } from "react-icons/md";
import { BsInputCursorText } from "react-icons/bs";

const QrScannerComponent = () => {
  const [color, setColor] = useState("#1F619F");
  const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
  //   const [displayScanResult, setDisplayScanResult] = useState(false);
  //   const [result, setResult] = useState("");
  const [bodyNumberInput, setBodyNumberInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bodyNumberFinalValue, setBodyNumberFinalValue] = useState("");

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
    setBodyNumberFinalValue(result);
  };

  return (
    <>
      <div className="flex justify-center items-center h-[100svh] select-none overflow-y-hidden">
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

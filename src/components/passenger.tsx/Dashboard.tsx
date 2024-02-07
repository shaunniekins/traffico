"use client";

import { useState } from "react";
import { IoListOutline, IoPersonCircleOutline } from "react-icons/io5";
import { LuScanLine } from "react-icons/lu";
import {
  MdOutlineChecklist,
  MdOutlineMyLocation,
  MdOutlineSettings,
  MdOutlineShareLocation,
} from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";

import QrScannerComponent from "../QrScanner";
import dynamic from "next/dynamic";
import Reports from "../enforcer/Reports";
import TopbarFloat from "../TopbarFloat";

const MapContainerComponent = dynamic(() => import("./MapContainer"), {
  ssr: false,
});

const DashboardPassengerComponent = () => {
  const [currentView, setCurrentView] = useState("lists");
  const [showBottomBar, setShowBottomBar] = useState(true);

  return (
    <div className="w-screen h-[100svh] flex flex-col relative">
      {currentView === "lists" && <TopbarFloat />}
      {currentView === "lists" && (
        <Reports setShowBottomBar={setShowBottomBar} />
      )}
      {currentView === "fare" && <MapContainerComponent />}
      {currentView === "report" && (
        <QrScannerComponent setShowBottomBar={setShowBottomBar} />
      )}
      {showBottomBar && (
        <div className="z-50 w-full absolute bottom-0 flex flex-col">
          <div className="bg-[#171A20] justify-around items-center gap-2 flex flex-row py-4 my-10 mx-20 rounded-2xl">
            <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "lists" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("lists");
              }}>
              <MdOutlineChecklist />
            </button>
            {/* <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "fare" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("fare");
              }}>
              <MdOutlineMyLocation />
            </button> */}
            <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "report" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("report");
              }}>
              <LuScanLine />
              {/* <p className="text-sm">Orders</p> */}
            </button>
            <button
              className={`w-full flex flex-col items-center justify-center text-[38px] ${
                currentView === "settings" ? "text-sky-700" : "text-white"
              }`}
              onClick={() => {
                setCurrentView("settings");
              }}>
              {/* <MdOutlineSettings /> */}
              <RiSettings3Line />
              {/* <p className="text-sm">Orders</p> */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPassengerComponent;

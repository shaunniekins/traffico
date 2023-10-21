"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  IoHomeOutline,
  IoPeopleOutline,
  IoClipboardOutline,
  IoCalendarOutline,
  IoArchiveOutline,
  IoSettingsOutline,
  IoDownloadOutline,
  IoLogOutOutline,
  IoMenuOutline,
} from "react-icons/io5";

const Sidebar = () => {
  const router = useRouter();
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const buttons = [
    {
      path: "/dashboard/dashboard",
      label: "Dashboard",
      icon: <IoHomeOutline />,
    },
    {
      path: "/dashboard/toda",
      label: "TODA",
      icon: <IoPeopleOutline />,
    },
    {
      path: "/dashboard/reports",
      label: "Reports",
      icon: <IoClipboardOutline />,
    },
    {
      path: "/dashboard/tricyle",
      label: "Tricycle",
      icon: <IoCalendarOutline />,
    },
    {
      path: "/dashboard/officer",
      label: "Officer",
      icon: <IoArchiveOutline />,
    },
    {
      path: "/dashboard/tricycle-driver",
      label: "Tricyle Driver",
      icon: <IoSettingsOutline />,
    },
    {
      path: "/dashboard/account",
      label: "Account",
      icon: <IoSettingsOutline />,
    },
  ];

  // Check if the current path matches the button's path
  const isCurrentPath = (buttonPath) => path === buttonPath;

  return (
    <>
      <div
        className={`${
          isMenuOpen ? "" : ""
        } hidden xl:flex h-[100dvh] flex-col bg-[#03396C] text-white rounded-r-3xl flex-0 lg:justify-center space-y-14 lg:items-center font-RobotoCondensed`}>
        <div className="h-[130px] w-[130px] self-center border border-white rounded-full"></div>
        <div className="flex flex-col lg:items-start space-y-5">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => router.push(button.path)}
              className={`${
                isCurrentPath(button.path) && "bg-[#338FFF] text-left"
              } py-4 px-20 flex text-xl items-center gap-x-3`}>
              <span>{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <button
        className={`${!isMenuOpen ? "flex" : "hidden"}`}
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}>
        <IoMenuOutline />
      </button>
    </>
  );
};

export default Sidebar;

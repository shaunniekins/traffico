"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
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

const Sidebar = ({ isMenuOpen, handleMenuClick }) => {
  //   console.log("isMenuOpen", isMenuOpen);
  const router = useRouter();
  const path = usePathname();

  const buttons = [
    {
      path: "/admin/dashboard/dashboard",
      label: "Dashboard",
      icon: <IoHomeOutline />,
    },
    {
      path: "/admin/dashboard/toda",
      label: "TODA",
      icon: <IoPeopleOutline />,
    },
    {
      path: "/admin/dashboard/reports",
      label: "Reports",
      icon: <IoClipboardOutline />,
    },
    {
      path: "/admin/dashboard/tricyle",
      label: "Tricycle",
      icon: <IoCalendarOutline />,
    },
    {
      path: "/admin/dashboard/officer",
      label: "Officer",
      icon: <IoArchiveOutline />,
    },
    {
      path: "/admin/dashboard/tricycle-driver",
      label: "Driver",
      icon: <IoSettingsOutline />,
    },
    {
      path: "/admin/dashboard/account",
      label: "Account",
      icon: <IoSettingsOutline />,
    },
  ];

  // Check if the current path matches the button's path
  const isCurrentPath = (buttonPath) => path === buttonPath;

  return (
    <div className={"bg-[#03396C] rounded-r-3xl font-RobotoCondensed"}>
      <button
        className={`
        ${isMenuOpen ? "flex" : "hidden"}
            md:hidden
            w-full h-[5dvh] self-center items-center justify-end flex p-5 text-3xl
        }`}
        onClick={handleMenuClick}>
        <IoMenuOutline />
      </button>
      <div
        className={`${
          isMenuOpen ? "xl:flex" : "hidden"
        }   h-[95dvh] md:h-[100dvh] flex-col rounded-r-3xl bg-[#03396C] text-white   lg:justify-center space-y-10 lg:items-center `}>
        <Image
          src="/Traffico.png"
          alt="Traffico Logo"
          width={180}
          height={180}
        />

        {/* <div className="h-[130px] w-[130px] self-center border border-white rounded-full"></div> */}
        <div className="flex flex-col lg:items-start space-y-5">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => router.push(button.path)}
              className={`${
                isCurrentPath(button.path) && "bg-[#338FFF]  items-center"
              } py-4 px-20 w-full flex text-xl items-center gap-x-3 `}>
              <span>{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

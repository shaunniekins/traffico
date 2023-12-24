"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
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

const ChooseUser = () => {
  const router = useRouter();

  const buttons = [
    {
      path: "/admin/dashboard/dashboard",
      label: "Admin",
      icon: <IoHomeOutline />,
    },
    {
      path: "/admin/dashboard/toda",
      label: "Officer",
      icon: <IoPeopleOutline />,
    },
    {
      path: "/admin/dashboard/reports",
      label: "Report Driver",
      icon: <IoClipboardOutline />,
    },
  ];

  return (
    <div className="w-screen h-[100dvh] flex flex-col items-center justify-center font-Montserrat bg-[#03396C] gap-y-10 px-5">
      <div className="w-full bg-white md:w-[450px] px-5 py-10 flex flex-col items-center rounded-xl backdrop-blur-2xl shadow-2xl font-Montserrat border-b-4 border-b-[#338FFF] space-y-8 ">
        <div className="rounded-3xl overflow-hidden">
          <Image
            src="/traffico-logo.jpeg"
            alt="Traffico Logo"
            width={200}
            height={200}
          />
        </div>
        <div className="w-full flex flex-col space-y-3 items-center text-white text-lg">
          {buttons.map((button, index) => (
            <button
              key={button.label + index}
              className="w-full flex text-left items-center justify-between space-x-3 bg-[#03396C] rounded-2xl py-5 px-10"
              onClick={() => router.push(button.path)}>
              {button.label}
              <span>{button.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseUser;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import Overview from "@/components/Overview";
import Toda from "@/components/Toda";
import Reports from "@/components/Reports";
import Tricycle from "@/components/Tricycle";
import Officer from "@/components/Officer";
import TricyleDriver from "@/components/TricyleDriver";
import Account from "@/components/Account";

const Content = () => {
  const router = useRouter();
  const path = usePathname();

  let activeComponent, activePath;

  switch (path) {
    case "/dashboard/dashboard":
      activePath = "Dashboard";
      activeComponent = <Overview />;
      break;
    case "/dashboard/toda":
      activePath = "TODA";
      activeComponent = <Toda />;
      break;
    case "/dashboard/reports":
      activePath = "Reports";
      activeComponent = <Reports />;
      break;
    case "/dashboard/tricyle":
      activePath = "Tricycle";
      activeComponent = <Tricycle />;
      break;
    case "/dashboard/officer":
      activePath = "Officer";
      activeComponent = <Officer />;
      break;
    case "/dashboard/tricycle-driver":
      activePath = "Tricyle Driver";
      activeComponent = <TricyleDriver />;
      break;
    case "/dashboard/account":
      activePath = "Account";
      activeComponent = <Account />;
      break;
    default:
      activeComponent = null;
  }

  return (
    // <div>
    <div className="py-6 md:px-6 rounded-3xl bg-white shadow-lg font-RobotoCondensed overflow-x-hidden h-full">
      {/* <h1 className="mb-10 font-bold text-3xl">{activePath}</h1> */}
      <div className="  ">{activeComponent}</div>
    </div>
    // </div>
  );
};

export default Content;

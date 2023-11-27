import React from "react";
import { IoMenuOutline, IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { usePathname } from "next/navigation";
import path from "path";

interface TopbarProps {
  isMenuOpen: boolean;
  handleMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ isMenuOpen, handleMenuClick }) => {
  return (
    <div className="flex justify-between items-center py-2 h-[5dvh]">
      <MenuButton onClick={handleMenuClick} />
      <div className="flex pr-5 items-center space-x-4">
        <button className="flex items-center text-2xl space-x-2">
          <CgProfile />
          <h5 className="text-xl">Admin</h5>
        </button>
        <button className="text-2xl">
          <IoSettingsOutline />
        </button>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-center gap-10">
      <button className={`text-3xl self-center`} onClick={onClick}>
        <IoMenuOutline />
      </button>
      {pathname === "/admin/dashboard/dashboard" && (
        <h1 className="hidden md:flex font-bold text-3xl text-sky-700">
          Overview Analytics
        </h1>
      )}
    </div>
  );
};

export default Topbar;

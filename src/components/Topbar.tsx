import React, { useContext, useEffect, useRef } from "react";
import {
  IoLogOutOutline,
  IoMenuOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { UserContext } from "@/utils/UserContext";
import { supabase } from "@/utils/supabase";
import { LoadingScreenSection } from "./LoadingScreen";

interface TopbarProps {
  isMenuOpen: boolean;
  handleMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ isMenuOpen, handleMenuClick }) => {
  const { userName, userId } = useContext(UserContext);
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center py-2 h-[5dvh]">
      {loading && <LoadingScreenSection />}
      <MenuButton onClick={handleMenuClick} />
      {/* <div className="flex pr-5 items-center space-x-4"> */}
      {/* <button className="flex items-center text-2xl space-x-2">
          <CgProfile />
          <h5 className="text-base md:text-xl">
            Hi, <span className="text-sky-700 font-semibold">{userName}</span>
          </h5>
        </button> */}
      <div
        className="relative flex items-center justify-center space-x-4 pr-5"
        ref={dropdownRef}>
        <button
          className="flex items-center text-2xl space-x-2"
          onClick={() => setShowLogout(!showLogout)}>
          <CgProfile />
          <h5 className="text-base md:text-xl">
            Hi, <span className="text-sky-700 font-semibold">{userName}</span>
          </h5>
        </button>
        {showLogout && (
          <div className="absolute top-full mt-2 bg-gray-600 text-gray-400 opacity-95 py-1 pl-3 pr-14 right-[0.20rem] rounded-lg z-40">
            <div className="absolute w-3 h-3 bg-inherit transform rotate-45 left-3/4 -top-1.5 translate-x-[-50%]" />
            <button
              className="flex items-center text-lg space-x-2 text-sky-300 hover:text-purple-300 my-2"
              onClick={() => {
                setLoading(true);
                supabase.auth.signOut();
                localStorage.removeItem("name");
                localStorage.removeItem("userId");
                router.push("/");
              }}>
              <div className="bg-sky-700 text-white rounded-full p-2 ">
                <IoLogOutOutline />
              </div>

              <h5 className="text-md">Logout</h5>
            </button>
          </div>
        )}
      </div>
      {/* <button className="text-2xl">
          <IoSettingsOutline />
        </button> */}
      {/* </div> */}
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

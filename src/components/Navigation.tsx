"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface NavigationProps {
  children: ReactNode;
}

const Navigation = ({ children }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section className="flex w-screen overflow-x-hidden h-[100dvh] bg-gray-200">
      <div className="fixed left-0 md:static">
        <Sidebar isMenuOpen={isMenuOpen} handleMenuClick={handleMenuClick} />
      </div>
      <div className="w-full h-[93dvh] mx-5">
        <Topbar isMenuOpen={isMenuOpen} handleMenuClick={handleMenuClick} />
        {children}
      </div>
    </section>
  );
};
export default Navigation;

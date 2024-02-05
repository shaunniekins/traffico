import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  IoHomeOutline,
  IoPeopleOutline,
  IoClipboardOutline,
  IoCalendarOutline,
  IoArchiveOutline,
  IoSettingsOutline,
  IoMenuOutline,
} from "react-icons/io5";

interface SidebarProps {
  isMenuOpen: boolean;
  handleMenuClick: () => void;
}

interface Button {
  path: string;
  label: string;
  icon: JSX.Element;
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, handleMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();

  const userType = pathname.includes("/admin/")
    ? "admin"
    : pathname.includes("/personnel/")
    ? "personnel"
    : null;

  let buttons: Button[] = [
    {
      path: "/admin/dashboard/dashboard",
      label: "Dashboard",
      icon: <IoHomeOutline />,
    },
    {
      path: "/admin/dashboard/operators",
      label: "Operator's Profile",
      icon: <IoPeopleOutline />,
    },
    {
      path: "/admin/dashboard/drivers",
      label: "Driver's Profile",
      icon: <IoClipboardOutline />,
    },
    {
      path: "/admin/dashboard/application",
      label: "Application",
      icon: <IoCalendarOutline />,
    },
    {
      path: "/admin/dashboard/tricycle-driver",
      label: "Tricycle Driver's Violation",
      icon: <IoSettingsOutline />,
    },
    {
      path: "/admin/dashboard/tricycle-qr",
      label: "Tricycle Generated QR Code",
      icon: <IoSettingsOutline />,
    },
  ];

  if (userType === "admin") {
    buttons.splice(1, 0, {
      path: "/admin/dashboard/approval",
      label: "Approval",
      icon: <IoHomeOutline />,
    });
    buttons.push({
      path: "/admin/dashboard/users",
      label: "Users",
      icon: <IoHomeOutline />,
    });
  }

  // Check if the current path matches the button's path
  const isCurrentPath = (buttonPath: string) => pathname === buttonPath;

  return (
    <div
      className={`${
        isMenuOpen ? "visible" : "hidden"
      } bg-[#03396C] rounded-r-3xl font-RobotoCondensed select-none transition-all duration-500 z-10 overflow-y-auto md:overflow-y-hidden`}>
      <div
        className={`
        ${isMenuOpen ? "flex" : "hidden"}
            md:hidden
            w-full h-[5dvh] self-center items-center justify-end flex p-5 text-3xl text-white 
        }`}>
        <button onClick={handleMenuClick}>
          <IoMenuOutline />
        </button>
      </div>
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        }   h-[95dvh] md:h-[100dvh] flex-col rounded-r-3xl bg-[#03396C] text-white lg:justify-center space-y-10 lg:space-y-20 items-center `}>
        <div className="rounded-3xl overflow-hidden">
          <Image src="/logo.svg" alt="Traffico Logo" width={200} height={200} />
        </div>

        <div className="flex flex-col space-y-5">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(button.path);
                // handleMenuClick();
              }}
              className={`${
                isCurrentPath(button.path) && "bg-[#338FFF]  items-center"
              } py-4 px-16 md:px-18 w-full flex text-lg items-center gap-x-6 whitespace-nowrap`}>
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

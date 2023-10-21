import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard | Traffico",
  description: "Traffico",
};

export default function DashboardLayout({ children }) {
  return (
    <section className="flex w-screen overflow-x-hidden h-[100dvh] bg-gray-200">
      <div className="fixed w-[300px]">
        <Sidebar />
      </div>
      <div className="xl:ml-[320px] w-full h-[93dvh] mx-5">
        <Topbar />
        {children}
      </div>
    </section>
  );
}

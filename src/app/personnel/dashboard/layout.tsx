import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard | Traffico",
  description: "Traffico",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation children={children} />;
}
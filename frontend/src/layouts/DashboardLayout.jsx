import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-bg min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}
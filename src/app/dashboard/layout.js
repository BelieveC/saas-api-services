import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Dashboard | Chai API Services",
  description: "Manage your API keys and monitor usage",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

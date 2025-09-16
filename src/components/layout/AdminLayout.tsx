import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLocation } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Page titles mapping
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard",
    subtitle:
      "Welcome back! Here's what's happening with your service platform.",
  },
  "/service-requests": {
    title: "Service Requests",
    subtitle: "Manage and track all service requests from customers.",
  },
  "/employee-applications": {
    title: "Employee Applications",
    subtitle: "Review and manage employee applications and profiles.",
  },
  "/reports": {
    title: "Reports",
    subtitle: "View analytics and reports for your business.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Configure your application settings and preferences.",
  },
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || {
    title: "",
    subtitle: "",
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header title={currentPage.title} subtitle={currentPage.subtitle} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

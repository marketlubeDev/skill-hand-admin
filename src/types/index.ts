export interface ServiceRequest {
  id: string;
  customerName?: string;
  customerPhone?: string;
  customerLocation?: string;
  serviceType?: string;
  description: string;
  estimatedCost?: number;
  status: "pending" | "in-progress" | "in-process" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  requestedDate?: string;
  scheduledDate?: string;
  completedDate?: string;
  // Some backends may use underscore id and different fields; keep optional for compatibility
  _id?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
}

export interface EmployeeApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  profileImage?: string;
  skills: string[];
  experienceLevel: "Beginner" | "Intermediate" | "Expert";
  rating: number;
  previousJobCount: number;
  certifications: string[];
  expectedSalary: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  location: string;
}

export interface DashboardStats {
  totalServiceRequests: number;
  activeEmployees: number;
  completedToday: number;
  pendingRequests: number;
  employeeApplications: number;
  urgentRequests: number;
}

export type NavigationItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

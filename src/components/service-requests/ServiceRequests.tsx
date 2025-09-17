import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Plus } from "lucide-react";
import { ServiceRequestCard } from "./ServiceRequestCard";
import { ServiceRequest } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceRequestDetailsDialog } from "./ServiceRequestDetailsDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { updateServiceRequest } from "@/lib/api.serviceRequests";
import { ScheduleServiceDialog } from "./ScheduleServiceDialog";

export function ServiceRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const {
    data: serviceRequests = [],
    isLoading,
    isError,
    error,
  } = useServiceRequests();

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: updateServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests"] });
    },
  });

  // Filter requests based on search and filters
  const filteredRequests = useMemo(
    () =>
      serviceRequests.filter((request) => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const fieldsToSearch = [
          request.customerName,
          request.name,
          request.serviceType,
          request.service,
          request.customerLocation,
          request.address,
          request.city,
          request.state,
          request.zip,
          request.id,
          request._id,
        ];
        const matchesSearch =
          normalizedQuery === "" ||
          fieldsToSearch.some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(normalizedQuery)
          );

        const normalizedStatus =
          request.status === "in-progress" ? "in-process" : request.status;
        const matchesStatus =
          statusFilter === "all" || normalizedStatus === statusFilter;
        const matchesPriority =
          priorityFilter === "all" || request.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      }),
    [serviceRequests, searchQuery, statusFilter, priorityFilter]
  );

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleAccept = (requestId: string) => {
    const req =
      serviceRequests.find((r) => r.id === requestId || r._id === requestId) ||
      null;
    setSelectedRequest(req);
    setIsScheduleOpen(true);
  };

  const handleComplete = (requestId: string) => {
    console.log("Complete request:", requestId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, service type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-process">In Process</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="text-center text-muted-foreground">
          Loading service requests...
        </div>
      )}
      {isError && (
        <div className="text-center text-destructive">
          {(error as Error)?.message || "Failed to load service requests."}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {serviceRequests.length}
          </div>
          <div className="text-sm text-muted-foreground">Total Requests</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {serviceRequests.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-info">
            {serviceRequests.filter((r) => r.status === "in-process").length}
          </div>
          <div className="text-sm text-muted-foreground">In Process</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {serviceRequests.filter((r) => r.status === "completed").length}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Service Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <ServiceRequestCard
            key={(request._id || request.id) as string}
            request={request}
            onViewDetails={handleViewDetails}
            onAccept={handleAccept}
            onComplete={handleComplete}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            No service requests found
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Service requests will appear here when customers submit them"}
          </div>
        </div>
      )}

      <ServiceRequestDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        request={selectedRequest}
      />

      <ScheduleServiceDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        customerName={selectedRequest?.customerName}
        defaultDate={selectedRequest?.scheduledDate}
        isSubmitting={updateMutation.isPending}
        onConfirm={(scheduledDateISO) => {
          const id = (selectedRequest?._id || selectedRequest?.id) as
            | string
            | undefined;
          if (!id) return;
          updateMutation.mutate({
            id,
            status: "in-process",
            scheduledDate: scheduledDateISO,
          });
          setIsScheduleOpen(false);
        }}
      />
    </div>
  );
}

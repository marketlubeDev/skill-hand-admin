import { apiFetch } from "./api";
import type { ServiceRequest } from "@/types";

export type ServiceRequestsResponse = ServiceRequest[];

export async function fetchServiceRequests(
  signal?: AbortSignal
): Promise<ServiceRequestsResponse> {
  const raw = await apiFetch<unknown>("/service-requests", { signal });

  // Normalize common API response shapes to always return an array
  if (Array.isArray(raw)) {
    return raw as ServiceRequest[];
  }

  if (raw && typeof raw === "object") {
    const asRecord = raw as Record<string, unknown>;
    const maybeData = asRecord.data as unknown;
    const maybeResults = asRecord.results as unknown;
    if (Array.isArray(maybeData)) return maybeData as ServiceRequest[];
    if (Array.isArray(maybeResults)) return maybeResults as ServiceRequest[];
  }

  // Fallback to empty array to keep UI stable
  return [] as ServiceRequest[];
}

export type UpdateServiceRequestInput = {
  id: string;
  status?: ServiceRequest["status"];
  scheduledDate?: string;
};

export async function updateServiceRequest(
  input: UpdateServiceRequestInput
): Promise<ServiceRequest> {
  const { id, ...body } = input;
  return apiFetch<ServiceRequest>(`/service-requests/${id}`, {
    method: "PUT",
    body,
  });
}

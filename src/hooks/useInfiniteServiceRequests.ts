import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchServiceRequestsPaginated,
  type PaginatedServiceRequestsResponse,
} from "@/lib/api.serviceRequests";

export function useInfiniteServiceRequests(limit: number = 10) {
  return useInfiniteQuery<PaginatedServiceRequestsResponse, Error>({
    queryKey: ["service-requests-infinite", limit],
    queryFn: ({ pageParam = 1, signal }) =>
      fetchServiceRequestsPaginated({ page: pageParam, limit, signal }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

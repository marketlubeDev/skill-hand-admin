// Minimal API client with configurable base URL and JSON handling
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    credentials: "include",
  });

  if (!response.ok) {
    let errorText = await response.text().catch(() => "");
    try {
      const maybeJson = JSON.parse(errorText);
      // Prefer JSON message if available
      errorText = maybeJson?.message || errorText;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // @ts-expect-error - allow unknown non-JSON types for now
    return undefined;
  }

  return (await response.json()) as T;
}

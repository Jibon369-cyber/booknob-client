import { authClient } from "@/lib/auth-client";

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    throw new Error("Authentication token not found");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${data.token}`);

  return fetch(input, { ...init, headers });
}

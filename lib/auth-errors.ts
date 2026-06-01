import { ApiClientError } from "@/lib/api-client";

export function isAuthRejected(err: unknown): boolean {
  return err instanceof ApiClientError && err.status === 401;
}

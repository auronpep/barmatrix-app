import { ApiClientError } from "@/lib/api-client";

interface ResourceErrorCopy {
  signedOut?: string;
  forbidden?: string;
  notFound: string;
  unavailable: string;
}

export function userFacingResourceError(
  err: unknown,
  copy: ResourceErrorCopy,
): string {
  if (err instanceof ApiClientError) {
    if (err.status === 401) return copy.signedOut ?? copy.unavailable;
    if (err.status === 403) return copy.forbidden ?? copy.unavailable;
    if (err.status === 400 || err.status === 404) return copy.notFound;
  }

  return copy.unavailable;
}

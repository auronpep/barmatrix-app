import { currentUser } from "@clerk/nextjs/server";

function allowedAtlasAdminEmails(): Set<string> {
  return new Set(
    (process.env.ATLAS_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function isAtlasAdmin(): Promise<boolean> {
  const allowed = allowedAtlasAdminEmails();
  if (allowed.size === 0) return false;

  let user: Awaited<ReturnType<typeof currentUser>> | null = null;
  try {
    user = await currentUser();
  } catch {
    return false;
  }
  if (!user) return false;

  const emails = [
    user.primaryEmailAddress?.emailAddress,
    ...user.emailAddresses.map((email) => email.emailAddress),
  ]
    .filter((email): email is string => Boolean(email))
    .map((email) => email.toLowerCase());

  return emails.some((email) => allowed.has(email));
}

export async function requireAtlasAdmin(): Promise<void> {
  if (!(await isAtlasAdmin())) {
    throw new Error("Atlas_v1 admin access required.");
  }
}

import { AuthForm } from "@/app/auth-form";
import { AuthUnavailable } from "@/app/auth-unavailable";

export const metadata = {
  title: "Create account · BarMatrix",
  robots: { index: false, follow: false },
};

interface AuthRouteProps {
  searchParams?: Promise<{ after?: string | string[] }>;
}

export default async function SignUpPage({ searchParams }: AuthRouteProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const params = await searchParams;
  const after = Array.isArray(params?.after) ? params.after[0] : params?.after;

  if (!hasClerk) {
    return <AuthUnavailable mode="sign-up" after={after} />;
  }

  return <AuthForm mode="sign-up" after={after} />;
}

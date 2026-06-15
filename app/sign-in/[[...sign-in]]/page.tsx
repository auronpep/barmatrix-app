import { AuthForm } from "@/app/auth-form";
import { AuthUnavailable } from "@/app/auth-unavailable";

export const metadata = {
  title: "Sign in · BarMatrix",
  robots: { index: false, follow: false },
};

interface AuthRouteProps {
  searchParams?: Promise<{
    after?: string | string[];
    redirect_url?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({ searchParams }: AuthRouteProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const params = await searchParams;
  // The protected-route middleware sends `redirect_url`; legacy links use `after`.
  const after = firstParam(params?.redirect_url) ?? firstParam(params?.after);

  if (!hasClerk) {
    return <AuthUnavailable mode="sign-in" after={after} />;
  }

  return <AuthForm mode="sign-in" after={after} />;
}

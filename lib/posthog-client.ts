import type { CapturedNetworkRequest, PostHogConfig } from "posthog-js";

const POSTHOG_DEFAULT_HOST = "https://us.i.posthog.com";
const POSTHOG_DEFAULTS_DATE = "2026-01-30";

type PostHogEnv = Record<string, string | undefined>;

export type PostHogBrowserOptions = {
  api_host: string;
  defaults: typeof POSTHOG_DEFAULTS_DATE;
  autocapture: false;
  capture_pageview: false;
  capture_pageleave: false;
  capture_dead_clicks: false;
  disable_session_recording: false;
  enable_recording_console_log: false;
  mask_all_text: true;
  mask_all_element_attributes: true;
  person_profiles: "identified_only";
  session_recording: {
    maskAllInputs: true;
    maskTextSelector: "*";
    maskCapturedNetworkRequestFn: (request: CapturedNetworkRequest) => CapturedNetworkRequest | null | undefined;
  };
};

export type PostHogBrowserConfig = {
  projectToken: string;
  options: PostHogBrowserOptions;
};

type PostHogClientLike = {
  __loaded?: boolean;
  init: (projectToken: string, options: PostHogBrowserOptions & Partial<PostHogConfig>) => unknown;
  capture?: (eventName: string, properties?: Record<string, unknown>) => unknown;
};

type WindowWithPostHog = Window & {
  posthog?: Pick<PostHogClientLike, "capture">;
};

const SENSITIVE_URL_PARAM_PATTERN =
  /([?&](?:auth|client_secret|checkout_session_id|email|key|password|payment_intent|secret|session_id|setup_intent|token)=)[^&]+/gi;

export function getPostHogBrowserConfig(env: PostHogEnv = process.env): PostHogBrowserConfig | null {
  const projectToken = cleanEnvValue(env.NEXT_PUBLIC_POSTHOG_KEY) || cleanEnvValue(env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);

  if (!projectToken) {
    return null;
  }

  return {
    projectToken,
    options: {
      api_host: normalizePostHogHost(env.NEXT_PUBLIC_POSTHOG_HOST),
      defaults: POSTHOG_DEFAULTS_DATE,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      disable_session_recording: false,
      enable_recording_console_log: false,
      mask_all_text: true,
      mask_all_element_attributes: true,
      person_profiles: "identified_only",
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "*",
        maskCapturedNetworkRequestFn: redactCapturedRequestUrl,
      },
    },
  };
}

export function initializePostHogClient(client: PostHogClientLike, env: PostHogEnv = process.env): boolean {
  const config = getPostHogBrowserConfig(env);

  if (!config) {
    return false;
  }

  exposePostHogClient(client);

  if (client.__loaded) {
    return false;
  }

  client.init(config.projectToken, config.options);
  exposePostHogClient(client);

  return true;
}

function exposePostHogClient(client: PostHogClientLike): void {
  if (typeof window !== "undefined") {
    (window as WindowWithPostHog).posthog = client;
  }
}

function normalizePostHogHost(host: string | undefined): string {
  const normalized = cleanEnvValue(host) || POSTHOG_DEFAULT_HOST;
  return normalized.startsWith("http://") || normalized.startsWith("https://")
    ? normalized.replace(/\/+$/, "")
    : POSTHOG_DEFAULT_HOST;
}

function cleanEnvValue(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function redactCapturedRequestUrl(request: CapturedNetworkRequest): CapturedNetworkRequest {
  if (request.name) {
    request.name = request.name.replace(SENSITIVE_URL_PARAM_PATTERN, "$1[REDACTED]");
  }

  return request;
}

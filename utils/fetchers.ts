import { SERVER_URL } from "./constants";
import { type Locale } from "../i18n-config";
import {
  GetCandidateResponse,
  GetIsLoggedInResponse,
  GetPdfDossierResponse,
  GetRelatnshipManagerResponse,
  GetUserResponse,
} from ".";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function postData(endpoint: string, data?: any) {
  const url = `${SERVER_URL}/${endpoint}`;
  const rawResponse = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!rawResponse.ok) {
    throw new Error(rawResponse.statusText);
  }

  let content;
  try {
    content = await rawResponse.json();
  } catch (e) {
    content = {};
  }

  return content;
}

async function getData({
  endpoint,
  locale,
  init = {},
  cookie,
}: {
  endpoint: string;
  cookie?: RequestCookie;
  locale?: Locale;
  init?: RequestInit;
}) {
  const url = `${SERVER_URL}${locale ? `/${locale}` : ""}/${endpoint}`;

  console.log(endpoint, cookie?.name, cookie?.value);

  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      Cookie: cookie ? `${cookie.name}=${cookie.value}` : "", // Forward the token cookie
    },
  });

  console.log(endpoint, res.status, res);

  if (!res.ok) {
    throw new HttpError(
      `HTTP ERROR! ${endpoint} status: ${res.status} cookie: ${cookie?.name} ${cookie?.value}`,
      res.status
    );
  }

  try {
    const json = await res.json();
    console.log("json", endpoint, json);
    return json;
  } catch (error) {
    throw new Error(`Failed to parse ${endpoint} response as JSON`);
  }
}

export async function getCandidate(
  locale: Locale,
  id: string,
  cookie?: RequestCookie
): Promise<GetCandidateResponse> {
  const response = await getData({
    endpoint: `candidate/${id}`,
    locale,
    // @fixme: add real cache policies to the fetchers
    init: { cache: "no-cache" },
    cookie,
  });

  return response;
}

export async function getUser(
  locale: Locale,
  id: string,
  cookie?: RequestCookie
): Promise<GetUserResponse> {
  const response = await getData({
    endpoint: `user/${id}`,
    locale,
    cookie,
  });

  return response;
}

export async function getPdfDossier(
  locale: Locale,
  id: string,
  cookie?: RequestCookie
): Promise<GetPdfDossierResponse> {
  const response = await getData({
    endpoint: `candidate/${id}/pdf`,
    locale,
    cookie,
  });

  return response;
}

export async function getRelationshipManager(
  locale: Locale,
  id: string,
  cookie?: RequestCookie
): Promise<GetRelatnshipManagerResponse> {
  const response = await getData({
    endpoint: `relationshipManager/${id}`,
    locale,
    cookie,
  });

  return response;
}

export async function inviteCandidate(
  id: string,
  data: {
    interviewDuration?: number;
    channel?: "online" | "onsite";
    address?: string;
    url?: string;
    availibilitySlots?: {
      startTime?: string;
      endTime?: string;
    }[];
  }
) {
  const response = await postData(`candidate/${id}/invite`, data);

  return response;
}

export async function rejectCandidate(
  id: string,
  reason: string,
  message: string
) {
  const response = await postData(`candidate/${id}/reject`, {
    reason,
    message,
  });

  return response;
}

export async function sendMessage(id: string, message: string) {
  const response = await postData(`sendMessage/${id}`, {
    message,
  });

  return response;
}

export async function sendCode(id: string) {
  const response = await postData(`auth/sendCode/${id}`);

  return response;
}

export async function logIn({
  id,
  code,
  locale,
}: {
  id: string;
  code: string;
  locale: Locale;
}) {
  const response = await postData(`${locale}/auth/login/${id}`, { code });

  return response;
}

export async function isLoggedIn(
  id: string,
  cookie?: RequestCookie
): Promise<boolean | undefined> {
  try {
    const response: GetIsLoggedInResponse = await getData({
      endpoint: `auth/isLoggedIn/${id}`,
      cookie,
    });

    console.log("isLoggedIn", response);

    return response.isLoggedIn;
  } catch {
    return false;
  }
}

export async function logout(id: string) {
  const response = await postData(`auth/logout/${id}`);

  return response;
}

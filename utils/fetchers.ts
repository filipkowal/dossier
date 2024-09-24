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

  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      Cookie: cookie ? `${cookie.name}=${cookie.value}` : "", // Forward the token cookie
    },
  });

  if (!res.ok) {
    throw new HttpError(
      `HTTP ERROR! ${endpoint} status: ${res.status} cookie: ${cookie?.name} ${cookie?.value}`,
      res.status
    );
  }

  try {
    const json = await res.json();
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
): Promise<GetPdfDossierResponse | undefined> {
  try {
    const result = await getData({
      endpoint: `candidate/${id}/pdf`,
      locale,
      cookie,
    });
    return result;
  } catch (error) {
    console.error("Failed to fetch PDF dossier", error);
    return undefined;
  }
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
  locale: Locale,
  id: string,
  data?: {
    interviewDuration?: number;
    channel?: "online" | "onsite";
    address?: string;
    url?: string;
    availabilitySlots?: {
      startTime?: string;
      endTime?: string;
    }[];
  }
) {
  const response = await postData(`${locale}/candidate/${id}/invite`, data);

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

export async function sendCode(id: string, locale: Locale) {
  const response = await postData(`${locale}/auth/sendCode/${id}`);

  return response;
}

export async function logIn({ id, code }: { id: string; code: string }) {
  const response = await postData(`auth/login/${id}`, { code });

  return response;
}

export async function isLoggedIn(
  id: string,
  cookie?: RequestCookie
): Promise<boolean | number | undefined> {
  try {
    const response: GetIsLoggedInResponse = await getData({
      endpoint: `auth/isLoggedIn/${id}`,
      cookie,
    });

    return response.isLoggedIn;
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) {
      return 404;
    }

    return false;
  }
}

export async function logout(id: string) {
  const response = await postData(`auth/logout/${id}`);

  return response;
}

export async function fetchImage(
  imageUrl: string,
  cookie?: string | RequestCookie
) {
  let headers;

  if (!cookie) {
    headers = {};
  } else {
    headers = {
      headers: {
        Cookie:
          typeof cookie === "string"
            ? cookie
            : `${cookie.name}=${cookie.value}`,
      },
    };
  }

  const response = await fetch(imageUrl, {
    credentials: "include",
    ...headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch image", { cause: response });
  }

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = blob.type; // Get the MIME type of the image

  return `data:${mimeType};base64,${base64String}`;
}

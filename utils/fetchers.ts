import { SERVER_URL } from "./constants";
import { type Locale } from "../i18n-config";
import {
  GetCandidateResponse,
  GetIsLoggedInResponse,
  GetPdfDossierResponse,
  GetRelatnshipManagerResponse,
  GetUserResponse,
} from ".";

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
    body: JSON.stringify(data),
  });

  if (!rawResponse.ok) {
    throw new Error(rawResponse.statusText);
  }

  const content = await rawResponse.json();
  return content;
}

async function getData({
  endpoint,
  locale,
  init = {},
}: {
  endpoint: string;
  locale?: Locale;
  init?: RequestInit;
}) {
  const url = `${SERVER_URL}${locale ? `/${locale}` : ""}/${endpoint}`;

  const res = await fetch(url, init);

  if (!res.ok) {
    throw new HttpError(
      `HTTP error! ${endpoint.toUpperCase()} status: ${res.status}`,
      res.status
    );
  }

  try {
    const json = await res.json();
    return json;
  } catch (error) {
    throw new Error(
      `Failed to parse ${endpoint.toUpperCase()} response as JSON`
    );
  }
}

export async function getCandidate(
  locale: Locale,
  id: string
): Promise<GetCandidateResponse> {
  const response = await getData({
    endpoint: `candidate/${id}`,
    locale,
    // @fixme: add real cache policies to the fetchers
    init: { cache: "no-cache" },
  });

  return response;
}

export async function getUser(
  locale: Locale,
  id: string
): Promise<GetUserResponse> {
  const response = await getData({
    endpoint: `user/${id}`,
    locale,
  });

  return response;
}

export async function getPdfDossier(
  locale: Locale,
  id: string
): Promise<GetPdfDossierResponse> {
  const response = await getData({
    endpoint: `candidate/${id}/pdf`,
    locale,
  });

  return response;
}

export async function getRelationshipManager(
  locale: Locale,
  id: string
): Promise<GetRelatnshipManagerResponse> {
  const response = await getData({
    endpoint: `relationshipManager/${id}`,
    locale,
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

export async function sendCode() {
  const response = await postData("auth/sendCode");

  return response;
}

export async function logIn(code: string) {
  const response = await postData("auth/login", code);

  return response;
}

export async function isLoggedIn(): Promise<boolean | undefined> {
  try {
    const response: GetIsLoggedInResponse = await getData({
      endpoint: "isLoggedIn",
    });

    return response.isLoggedIn;
  } catch {
    return false;
  }
}

export async function logout() {
  const response = await postData("auth/logout");

  return response;
}

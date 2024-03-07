import { SERVER_URL } from "./constants";
import { type Locale } from "../i18n-config";
import {
  GetCandidateResponse,
  GetPdfDossierResponse,
  GetUserResponse,
} from ".";

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
  try {
    const url = `${SERVER_URL}${locale ? `/${locale}` : ""}/${endpoint}`;

    const res = await fetch(url, init);
    const contentType = res.headers.get("Content-Type");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    if (contentType?.includes("text/html")) {
      throw new Error("HTML received instead of JSON");
    }

    const json = res.json();

    return json;
  } catch (e: any) {
    const message = "Failed fetching " + endpoint + ": " + e.message;

    console.error(message);

    if (
      typeof document === "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      // throw only on server-side on production to prevent creating a new build and keep the old one
      throw Error("Failed fetching " + endpoint + ": " + e.message);
    }
  }
}

function throwOnNoDataWhenBuilding(
  response: Response,
  responseContent: any,
  responseName: string
) {
  // Stop server-side building if no data to display. Keep the previous build.

  // Don't throw on client-side
  if (typeof document !== "undefined" || process.env.NODE_ENV !== "production")
    return;

  if (!response) {
    throw new Error("No response when building: " + responseName.toUpperCase());
  }

  if (!responseContent) {
    throw new Error(
      "Response of 0 length when building: " + responseName.toUpperCase()
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

  throwOnNoDataWhenBuilding(response, response, "candidates");

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
  const response = await postData(`invite/${id}`, data);

  return response;
}

export async function rejectCandidate(
  id: string,
  reason: string,
  message: string
) {
  const response = await postData(`reject/${id}`, { reason, message });

  return response;
}

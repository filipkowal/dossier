import { SERVER_URL } from "./constants";
import { type Locale } from "../i18n-config";
import { GetCandidateResponse, GetUserResponse } from ".";

export async function postData(endpoint: string, locale: Locale, data?: any) {
  const url = `${SERVER_URL}/${locale}/${endpoint}`;
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

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (e: any) {
    const message = "Failed fetching " + endpoint + ": " + e.message;

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

export async function inviteCandidate(
  locale: Locale,
  id: string,
  duration: string,
  address: string,
  channel: string,
  startTime: string
) {
  const response = await postData(`invite/${id}`, locale, {
    duration,
    address,
    channel,
    startTime,
  });

  return response;
}

export async function rejectCandidate(locale: Locale, id: string) {
  const response = await postData(`reject/${id}`, locale);

  return response;
}

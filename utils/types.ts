import { components, paths } from "@/schema";
import { Dayjs } from "dayjs";

export { type Locale } from "../i18n-config";

export type GetCandidateResponse =
  paths["/{locale}/candidate/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetUserResponse =
  paths["/{locale}/user/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetPdfDossierResponse =
  paths["/{locale}/candidate/{id}/pdf"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetIsLoggedInResponse =
  paths["/auth/isLoggedIn/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetRelatnshipManagerResponse =
  paths["/{locale}/relationshipManager/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type Candidate = components["schemas"]["Candidate"];
export type User = components["schemas"]["User"];
export type RelationshipManager = components["schemas"]["RelationshipManager"];

export type TimeSlots = {
  id: number;
  date: Dayjs;
  startTime: string;
  endTime: string;
}[];

export type SearchParams = { [key: string]: string | string[] | undefined };

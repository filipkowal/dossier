import { components, paths } from "@/schema";

export { type Locale } from "../i18n-config";

export type GetCandidateResponse =
  paths["/{locale}/candidate/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
export type GetUserResponse =
  paths["/{locale}/user/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type Candidate = components["schemas"]["Candidate"];
export type User = components["schemas"]["User"];

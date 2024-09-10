/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/auth/sendCode/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Request a login code */
    post: operations["requestLoginCode"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/login/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Login with a code */
    post: operations["login"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/isLoggedIn/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Check if the user is logged in (check token in cookie validity) */
    get: operations["isLoggedIn"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/logout/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Logout */
    post: operations["logout"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/{locale}/candidate/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Retrieve a candidate information */
    get: operations["getResource"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/{locale}/candidate/{id}/pdf": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Download a candidate's dossier as a PDF */
    get: operations["downloadPdf"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/{locale}/user/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Retrieve user information */
    get: operations["getUser"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/{locale}/relationshipManager/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Retrieve a relationship manager information */
    get: operations["getRelationshipManager"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/{locale}/candidate/{id}/invite": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Invite a candidate
     * @description Locale is not specified as a candidate might use a different language than the user
     */
    post: operations["inviteUser"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/candidate/{id}/reject": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Reject a candidate
     * @description Locale is not specified as a candidate might use a different language than the user
     */
    post: operations["rejectUser"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/sendMessage/{id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Send a message to DT to enquire about the candidacy */
    post: operations["sendMessage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /**
     * Format: url
     * @example https://www.example.com/cv.pdf
     */
    File: string;
    RelationshipManager: {
      /** @example Christoph Kowalski */
      name?: string;
      /** @example +48 666 666 666 */
      phoneNumber?: string;
      /**
       * Format: url
       * @example https://www.example.com/photo.jpg
       */
      photo?: string;
    };
    Candidate: {
      /** @example Christoph */
      firstName?: string;
      /** @example Kowalski */
      lastName?: string;
      /** @enum {string} */
      gender?: "m" | "f";
      /** @example digitalent.cloud/images/123 */
      candidateImage?: string;
      /** @example Senior Consultant (CIO Advisory) */
      vacancyTitle?: string;
      /** @example Gardener Senior Consultant @Google */
      currentPosition?: string;
      /** @example atrete ag */
      employerName?: string;
      /** @example 01.01.1990 */
      birthDate?: string;
      /** @example 30 */
      candidateAge?: string;
      address?: components["schemas"]["Address"];
      /** @example +48 666 666 666 */
      phoneNumber?: string;
      /** @example example@example.com */
      email?: string;
      /** @example linkedin.com/in/example */
      linkedIn?: string;
      /** @example 130 000 CHF */
      desiredSalary?: string;
      /** @example 1 month */
      noticePeriod?: string;
      /** @example Die basenet Informatik (grösster Teil der Gruppe) wurde verkauft und viele kleinere Gesellschaften konsolidiert. Er begleitet diese 'Carve-outs' der Gesellschaften, danach ist seine Rolle obsolet bzw. nicht mehr so spannend. Er hat deshalb entschieden außerhalb der Gruppe eine neue Herausforderung zu suchen. Das Dienstleistungsportfolio von atrete tönt sehr spannend und mit den. Werten von atrete kann er sich sehr gut identifizieren. */
      reasonForChange?: string;
      /** @example Christoph Pfister ist seit vielen Jahren in verschiedenen Rollen im Bereich Informationstechnik unterwegs und würde sein Wissen und seine Erfahrung sehr gerne als Berater einbringen. Es reizt ihn spannende sowie komplexe Problemstellungen zu lösen und er kann dank seiner Erfahrung eine holistische Betrachtung auf Challenges einnehmen. In seiner aktuellen Rolle als CIO der PEAX AG verantwortet er die Produktentwicklung und den Betrieb einer SaaS-Plattform für digitale Services. In seiner zusätzlichen Gruppen-Rolle durfte er in der Base-Net Unternehmensgruppe verschiedene große Projekte erfolgreich umsetzen. Er ist sich gewohnt mit einer 360 Grad Sicht zu agieren und dazu die verschiedenen Sachverhalte und Themen für unterschiedliche Ziel- und Anspruchsgruppen verständlich und nachvollziehbar aufzubereiten und zu präsentieren. Als Mitglied des Enterprise Architektur Boards ist er zudem verantwortlich für die Identifikation sowie Einführung von neuen Technologien und für regulatorische und IT-rechtliche Themen. */
      interviewSummary?: string;
      file?: components["schemas"]["File"];
      /** @example We will inform you which date Christoph has chosen so that you can send him the meeting invite. Please make sure to CC: atrete@digitalent.ch to the meeting */
      dossierMessage?: string;
      /** @example 100% */
      desiredWorkload?: string;
      /**
       * Format: html
       * @example <ul> <li>2021 Berufsbildnerkurs</li> <li>2020 Dipl. Betriebswirtschafter HF</li> </ul>
       */
      educationSummary?: string;
    };
    User: {
      canDownloadPdf?: boolean;
      canViewSalary?: boolean;
      /**
       * @description Invitation form should show address/url input if true
       * @example false
       */
      isInterviewLocationInputVisible?: boolean;
      /** @description Invitation form should show availability slots input if true */
      isInterviewAvailabilityInputVisible?: boolean;
      isInviteButtonVisible?: boolean;
      isRejectButtonVisible?: boolean;
      address?: components["schemas"]["Address"];
    };
    Address: {
      /** @example Wiener Str. 55 */
      street?: string;
      /** @example Bern */
      city?: string;
      /** @example 30-101 */
      zip?: string;
      /** @example Bern */
      state?: string;
      /** @example Western Part of Switzerland */
      region?: string;
      /** @example Switzerland */
      country?: string;
      geoCoordinates?: components["schemas"]["GeoCoordinates"];
    };
    /** @example 47.4708538 */
    GeoCoordinate: string;
    GeoCoordinates: {
      latitude?: components["schemas"]["GeoCoordinate"];
      longitude?: components["schemas"]["GeoCoordinate"];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  requestLoginCode: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Code sent to the user's phone and email */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  login: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": {
          code?: string;
        };
      };
    };
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          "Set-Cookie"?: string;
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
      /** @description Wrong code */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
    };
  };
  isLoggedIn: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie: {
        /** @description The JWT token used for authentication */
        token: string;
      };
    };
    requestBody?: never;
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            isLoggedIn?: boolean;
          };
        };
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  logout: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  getResource: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        locale: string;
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Candidate"];
        };
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Gone */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
    };
  };
  downloadPdf: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        locale: string;
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["File"];
        };
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Gone */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
    };
  };
  getUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        locale: string;
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Gone */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
    };
  };
  getRelationshipManager: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        locale: string;
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RelationshipManager"];
        };
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  inviteUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
        locale: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": {
          /** @description In minutes */
          interviewDuration?: number;
          /** @enum {string} */
          channel?: "online" | "onsite";
          address?: string;
          /** @example https://meet.google.com/abc-def-ghi */
          url?: string;
          availabilitySlots?: {
            /** Format: date-time */
            startDateTime?: string;
            /** Format: time */
            endTime?: string;
          }[];
        };
      };
    };
    responses: {
      /** @description Success */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "text/plain": string;
        };
      };
      /** @description Error */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Gone */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
    };
  };
  rejectUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": {
          /** @enum {string} */
          reason?:
            | "wrongGeographicalArea"
            | "wrongJobFocus"
            | "salaryExpectations"
            | "qualifiedOtherCandidatesBetter"
            | "notBestQualifiedEducation"
            | "notBestQualifiedExperience"
            | "notBestQualifiedOverqualified"
            | "notBestQualifiedTooOld"
            | "notBestQualifiedCulturalFit"
            | "other";
          /** @example We are sorry to inform you that we will not proceed with candidate's application. We wish you all the best and can't wait for future candidates. */
          message?: string;
        };
      };
    };
    responses: {
      /** @description Success */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Error */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Gone */
      410: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            error?: string;
          };
        };
      };
    };
  };
  sendMessage: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        "application/json": {
          /** @example We are sorry to inform you that we will not proceed with candidate's application. We wish you all the best and can't wait for future candidates. */
          message?: string;
        };
      };
    };
    responses: {
      /** @description Success */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Error */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Unauthorized */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
}

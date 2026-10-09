import type {
  WorkpulseUiDefinition,
} from "../types/uiDefinition";

const API_BASE = "/api/method/hrms_customization.api.metadata";

type FrappeResponse<T> = {
  message: T;
};

export interface WorkpulseRecordsResponse {
  configuration: string;
  sectionId: string;
  sourceDoctype: string;

  fields: string[];

  records: Record<string, unknown>[];

  pagination: {
    limit: number;
    start: number;
    returned: number;
    hasMore: boolean;
  };
}

export interface WorkpulseRecordResponse {
  configuration: string;
  sectionId: string;
  sourceDoctype: string;

  record: Record<string, unknown>;

  fields: {
    fieldname: string;
    label: string;
    fieldtype: string;
    options: string | null;
    idx: number | null;
    order: number | null;
  }[];
}


export interface LinkOption{
  value : string;
  description? : string;
}

export interface LinkedFieldValuesResponse{
  sourceDoctype :string;
  recordName : string | null;
  values : Record<string, unknown>;
}

export interface SaveRecordResponse {
  success: boolean;
  operation: "created" | "updated";
  doctype: string;
  name: string;
  message: string;
}

async function request<T>(
  url: string,
): Promise<T> {
  const response = await fetch(
    url,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid JSON response.",
    );
  }

  if (
    !response.ok
  ) {
    const frappeError = (
      data as {
        exception?: string;
        message?: string;
      }
    );

    throw new Error(
      frappeError.exception
        || frappeError.message
        || "Request failed.",
    );
  }

  const frappeResponse =
    data as FrappeResponse<T>;

  return frappeResponse.message;
}


/**
 * Get the complete UI definition.
 *
 * This is the main configuration source
 * for the React application.
 */
export async function getUiDefinition(
  configuration: string,
): Promise<WorkpulseUiDefinition> {
  const params =
    new URLSearchParams({
      configuration,
    });

  return request<WorkpulseUiDefinition>(
    `${API_BASE}.get_workpulse_ui_definition?${params.toString()}`,
  );
}


/**
 * Get records for a LIST section.
 */
export async function getRecords(
  configuration: string,
  sectionId: string,
  options?: {
    limit?: number;
    start?: number;
    search?: string;
  },
): Promise<WorkpulseRecordsResponse> {
  const params =
    new URLSearchParams({
      configuration,
      section_id: sectionId,

      limit_page_length: String(
        options?.limit ?? 20,
      ),

      limit_start: String(
        options?.start ?? 0,
      ),
    });

  const search =
    options?.search?.trim();

  if (search) {
    params.set(
      "search",
      search,
    );
  }

  return request<WorkpulseRecordsResponse>(
    `${API_BASE}.get_source_doctype_ui_records?${params.toString()}`,
  );
}


/**
 * Get one record for a FORM/details view.
 */
export async function getRecord(
  configuration: string,
  sectionId: string,
  recordName: string,
): Promise<WorkpulseRecordResponse> {
  const params =
    new URLSearchParams({
      configuration,
      section_id: sectionId,
      record_name: recordName,
    });

  return request<WorkpulseRecordResponse>(
    `${API_BASE}.get_source_doctype_ui_record?${params.toString()}`,
  );
}


export async function searchLinkOptions(
  doctype: string,
  searchText: string,
  referenceDoctype: string,
  pageLength = 10,
): Promise<LinkOption[]> {
  const params = new URLSearchParams({
    doctype,
    txt: searchText,
    reference_doctype: referenceDoctype,
    page_length: String(pageLength),
  });

  return request<LinkOption[]>(
    `/api/method/frappe.desk.search.search_link?${params.toString()}`,
  );
}

//To call the backend function we added to record.py and exposed through metadata.py

export async function getLinkedFieldValues(
  configuration: string,
  sectionId: string,
  linkFieldname: string,
  recordName: string,
  linkDoctype?: string,
): Promise<LinkedFieldValuesResponse> {
  const params = new URLSearchParams({
    configuration,
    section_id: sectionId,
    link_fieldname: linkFieldname,
    record_name: recordName,
  });

  if (linkDoctype) {
    params.set("link_doctype", linkDoctype);
  }

  return request<LinkedFieldValuesResponse>(
    `${API_BASE}.get_linked_field_values?${params.toString()}`,
  );
}



//post request helper handles existing GET requests add this separate helper so we don't disturb the working api calls



async function postRequest<T>(
  url: string,
  body: Record<string, unknown>,
): Promise<T> {
  const csrfToken = document
    .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.content;

  if (!csrfToken) {
    throw new Error(
      "CSRF token not found. Please reload the page and try again.",
    );
  }

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Frappe-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const rawMessage =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.exception === "string"
          ? data.exception
          : `Request failed with status ${response.status}`;

    const message = rawMessage
    .replace(/^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*:\s*/, "")


    throw new Error(message);
  }

  if (!data || !("message" in data)) {
    throw new Error("Invalid response received from ERPNext.");
  }

  return data.message as T;
}



//save api function

export async function saveSourceDoctypeUiRecord(
  configuration: string,
  sectionId: string,
  values: Record<string, unknown>,
  recordName?: string,
): Promise<SaveRecordResponse> {
  const body: Record<string, unknown> = {
    configuration,
    section_id: sectionId,
    values,
  };

  if (recordName) {
    body.record_name = recordName;
  }

  return postRequest<SaveRecordResponse>(
    `${API_BASE}.save_source_doctype_ui_record`,
    body,
  );
}
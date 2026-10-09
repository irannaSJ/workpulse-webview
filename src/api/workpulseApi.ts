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
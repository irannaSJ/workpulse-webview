export type WorkpulseSectionType = "LIST" | "FORM";

export interface WorkpulseConfiguration {
  id: string;
  title: string;
  logo: string | null;
  enabled: boolean;
}

export interface WorkpulseField {
  fieldname: string;
  label: string | null;
  fieldtype: string;
  options: string | null;

  enabled: boolean;
  order: number | null;
  idx: number | null;

  reqd: boolean;
  readOnly: boolean;

  default: unknown;
  description: string | null;

  fetchFrom: string | null;
  fetchIfEmpty: boolean;

  readAccess: boolean;

  // LIST-specific
  inListView?: boolean;
  inFilter?: boolean;
  inStandardFilter?: boolean;

  // FORM-specific
  writeAccess?: boolean;
  editable?: boolean;
}

export interface WorkpulseLayoutItem {
  type: "FIELD" | "COLUMN" | "SECTION" | "TAB";
  fieldname: string;
  label?: string;
}

export interface WorkpulseSection {
  id: string;
  sourceDoctype: string;
  type: WorkpulseSectionType;

  enabled: boolean;
  order: number | null;

  fields: WorkpulseField[];

  // Present for FORM sections.
  layout?: WorkpulseLayoutItem[];
}

export interface WorkpulseUiDefinition {
  configuration: WorkpulseConfiguration;
  sections: WorkpulseSection[];
}
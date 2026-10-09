export type FrappeFieldType =
  | "Data"
  | "Select"
  | "Link"
  | "Dynamic Link"
  | "Check"
  | "Int"
  | "Float"
  | "Currency"
  | "Percent"
  | "Date"
  | "Datetime"
  | "Time"
  | "Duration"
  | "Small Text"
  | "Long Text"
  | "Text"
  | "Password"
  | "Text Editor"
  | "Markdown Editor"
  | "Code"
  | "Color"
  | "Rating"
  | "Attach"
  | "Attach Image"
  | "Image"
  | "Barcode"
  | "Signature"
  | "Read Only"
  | "JSON"
  | "HTML"
  | "Geolocation"
  | "Section Break"
  | "Column Break"
  | "Tab Break"
  | "Table"
  | "Table MultiSelect"
  | "Button";

export interface FormField {
  label: string;
  fieldname: string;
  fieldtype: FrappeFieldType;

  options?: string | string[] | null;
  default?: unknown;

  reqd?: number;
  read_only?: number;
  hidden?: number;

  placeholder?: string;
  description?: string;

  depends_on?: string;
  mandatory_depends_on?: string;
  read_only_depends_on?: string;

  fetch_from ?: string | null;
  fetch_if_empty?:number | boolean;
}

export interface DynamicFormConfig {
  doctype?: string;
  fields: FormField[];
}
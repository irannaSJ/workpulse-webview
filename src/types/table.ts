export type TableColumnType =
  | "Data"
  | "Text"
  | "Int"
  | "Float"
  | "Currency"
  | "Percent"
  | "Date"
  | "Datetime"
  | "Check"
  | "Status"
  | "Link"
  | "Image";

export interface TableColumn {
  label: string;
  fieldname: string;
  fieldtype: TableColumnType;

  width?: string;

  align?: "left" | "center" | "right";

  hidden?: boolean;

  searchable?: boolean;
}

export interface TableAction {
  label: string;
  action: string;
}

export interface DynamicTableConfig {
  doctype?: string;

  title?: string;

  columns: TableColumn[];

  rows: Record<string, unknown>[];

  actions?: TableAction[];

  searchable?: boolean;

  pagination?: boolean;

  pageSize?: number;

  pageSizeOptions?: number[];
}
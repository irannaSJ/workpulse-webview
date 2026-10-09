export type SummaryAccent =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "gray";

export interface SummaryCardData {
  id: string;
  title: string;
  value: string | number;
  icon?: string | null;
  description?: string | null;
  accent?: SummaryAccent;
  clickable?: boolean;
}
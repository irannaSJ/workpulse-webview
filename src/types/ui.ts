export interface AppConfiguration {
  title: string;
  logo?: string | null;
}

export interface QuickAction {
  id: string;
  title: string;
  icon?: string | null;
  enabled: boolean;
  action: string;
}

export interface WebConfiguration {
  app: AppConfiguration;
  quick_actions: QuickAction[];
}
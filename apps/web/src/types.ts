export enum Platforms {
    Email = "Email",
    Telegram = "Telegram"
}

export type ICredentials = {
  data : string,
  title: string,
  platform: Platforms
  id: string,
}

export type IWorkflows = {
  workflows: {
    id: string;
    title: string;
    enabled: boolean;
    nodes: string;
    connections: string;
  }[];
};
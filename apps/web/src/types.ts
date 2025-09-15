import type { Edge, Node } from "@xyflow/react";

export enum Platforms {
  Email = "Email",
  Telegram = "Telegram",
  Gemini = "Gemini",
}

export type ICredentials = {
  data: string;
  title: string;
  platform: Platforms;
  id: string;
};

export type IWorkflows = {
  workflows: IWorkflow[];
};

export type IGetSingleWorkflow = {
  workflow: IWorkflow;
};

type IWorkflow = {
  id: string;
  title: string;
  enabled: boolean;
  nodes: ICustomNode[];
  connections: Edge[];
};

export enum NodeTypes {
  Telegram = "telegramNode",
  Email = "emailNode",
  Webhook = "webhookNode",
  AiAgent = "aiAgent",
  GeminiModel = "geminiModelNode",
  CodeTool = "codeToolNode",
}

export type NodeType = `${NodeTypes}`;

export type ICustomNode = Omit<Node, "data"> & {
  data: {
    [K in keyof Node["data"]]: { fieldData: any };
  };
};

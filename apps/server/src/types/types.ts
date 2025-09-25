export type IConnection = {
  id: string;
  type: string;
  source: string;
  target: string;
};

export type INode = {
  id: string;
  data: Record<any, any>;
  type: NodeType;
  measured: Record<any, any>[];
  position: Record<any, any>[];
  selected: boolean;
};

export enum NodeTypes {
  Telegram = "telegramNode",
  Email = "emailNode",
  Webhook = "webhookNode",
  AiAgent = "aiAgent",
  GeminiModel = "geminiModelNode",
  CodeTool = "codeToolNode",
  ManualTriggerNode = "manualTriggerNode",
  SolanaSendTokenNode = "solanaSendTokenNode"
}

export type NodeType = `${NodeTypes}`;

export enum NodeStates {
  InProgress = "inProgress",
  Loading = "loading",
  Paused = "paused",
  Completed = "completed",
  Failed = "failed",
}

export type NodeState = `${NodeStates}`;
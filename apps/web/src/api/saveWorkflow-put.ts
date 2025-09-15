import { NodeTypes, type ICustomNode } from "@/types";
import type { Edge, Node } from "@xyflow/react";
import axios from "axios";

export const saveWorkflow = async ({
  id,
  nodes,
  connections,
  workflowDetails,
}: {
  id: string;
  nodes: ICustomNode[];
  connections: Edge[];
  workflowDetails: { title: string; enabled: boolean };
}) => {
  const webhooksUnformatted = nodes.filter(
    (node) => node.type === NodeTypes.Webhook
  );
  const webhooks = webhooksUnformatted.map((hook) => {
    return { ...hook.data.fieldData };
  });

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/workflow/${id}`,
      {
        title: workflowDetails.title,
        enabled: workflowDetails.enabled,
        nodes: nodes,
        connections: connections,
        webhooks: webhooks,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

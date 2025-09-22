import { useEventSource } from "@/store/nodeEvents";
import { NodeStates } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function useNodeStates({ watchNodeId }: { watchNodeId: string }) {
  const nodeEvents = useEventSource((s) => s.eventSource);
  const [nodeState, setNodeState] = useState<NodeStates>(NodeStates.Paused);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const { nodeId: eventNodeId, nodeState: newNodeState, message } = data;

      if (watchNodeId === eventNodeId) {
        setNodeState(newNodeState);
      }

      if (newNodeState === NodeStates.Failed) {
        toast.error(message);
      }
    },
    [watchNodeId]
  );

  useEffect(() => {
    if (!nodeEvents) return;

    nodeEvents.addEventListener("message", handleMessage);

    return () => {
      nodeEvents.removeEventListener("message", handleMessage);
    };
  }, [nodeEvents, handleMessage]);

  return {
    nodeState,
    setNodeState,
  };
}

export default useNodeStates;

import { SquarePen, Trash2, Webhook } from "lucide-react";
import { useCallback } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position } from "@xyflow/react";

function WebhookNode() {
  //   const onChange = useCallback((evt) => {
  //     console.log(evt.target.value);
  //   }, []);

  const editWebhookNodeHandler = useCallback(() => {
    console.log("Edit node");
  }, []);

  const deleteWebhookNodeHandler = useCallback(() => {
    console.log("Delete node");
  }, []);

  return (
    <NodeWrapper>
      <div className="absolute top-1/2 -left-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <SquarePen size={15} onClick={() => editWebhookNodeHandler()} />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Webhook size={28} />
        <div className="font-bold text-md">Webhook</div>
        {/* <div>{item.title}</div> */}
        <Handle type="source" position={Position.Bottom} />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteWebhookNodeHandler()}
        />
      </div>
    </NodeWrapper>
  );
}

export default WebhookNode;

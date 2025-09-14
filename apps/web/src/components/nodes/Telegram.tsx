import { Send, SquarePen, Trash2 } from "lucide-react";
import { useCallback } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position } from "@xyflow/react";

function TelegramNode() {
  //   const onChange = useCallback((evt) => {
  //     console.log(evt.target.value);
  //   }, []);

  const editTelegramNodeHandler = useCallback(() => {
    console.log("Edit node");
  }, []);
    
  const deleteTelegramNodeHandler = useCallback(() => {
    console.log("Delete node");
  }, []);
  return (
    <NodeWrapper>
      <div className="absolute top-1/2 -left-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <SquarePen size={15} onClick={() => editTelegramNodeHandler()} />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Send size={28} />
        <div className="font-bold text-md">Telegram Bot</div>
        {/* <div>{item.title}</div> */}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteTelegramNodeHandler()}
        />
      </div>
    </NodeWrapper>
  );
}

export default TelegramNode;

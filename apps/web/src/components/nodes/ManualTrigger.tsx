import { MousePointer2, Play, Trash2 } from "lucide-react";
import { useCallback } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position, useReactFlow } from "@xyflow/react";

function ManualTrigger({
  id,
  data,
}: {
  id: string;
  data: {
    id: string;
    fieldData: any;
    onDataUpdate: (id: string, data: any) => void;
  };
}) {
  const { deleteElements } = useReactFlow();

  const deleteManualTriggerHandler = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [deleteElements]
  );

  const runManualTriggerHandler = useCallback(() => {
    console.log("Running manual trigger");
  }, []);

  return (
    <NodeWrapper>
      <div className="flex flex-col justify-center items-center">
        <MousePointer2 size={24} />
        <div className="font-bold text-sm flex flex-col items-center">
          <span>Manual Trigger</span>
          <span>Node</span>
        </div>   
        <Handle type="source" position={Position.Bottom} id="output" />
        <Play
          size={17}
          className="hover:bg-highlighted p-1 rounded-md transition-color hover:cursor-pointer"
          onClick={runManualTriggerHandler}
        />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteManualTriggerHandler(id)}
        />
      </div>
    </NodeWrapper>
  );
}

export default ManualTrigger;

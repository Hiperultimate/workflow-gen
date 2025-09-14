import { Mail, SquarePen, Trash2 } from "lucide-react";
import { useCallback } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position } from "@xyflow/react";

function EmailNode() {
//   const onChange = useCallback((evt) => {
//     console.log(evt.target.value);
//   }, []);
  const editEmailNodeHandler = useCallback(() => {
    console.log("Edit node");
  }, []);

  const deleteEmailNodeHandler = useCallback(() => {
    console.log("Delete node");
  }, []);

  return (
    <NodeWrapper>
      <div className="absolute top-1/2 -left-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <SquarePen size={15} onClick={() => editEmailNodeHandler()} />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Mail size={28} />
        <div className="font-bold text-md">Email</div>
        {/* <div>{item.title}</div> */}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteEmailNodeHandler()}
        />
      </div>
    </NodeWrapper>
  );
}

export default EmailNode;
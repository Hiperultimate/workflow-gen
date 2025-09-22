import { Loader, Play, Pause, CheckCircle, XCircle } from "lucide-react";
import { NodeStates } from "@/types";

interface StateIconProps {
  state: NodeStates;
}

const StateIcon: React.FC<StateIconProps> = ({ state }) => {
  switch (state) {
    case NodeStates.Loading:
      return <Loader className="animate-spin" size={16} color="#3b82f6" />;
    case NodeStates.InProgress:
      return <Play size={16} color="#10b981" />;
    case NodeStates.Paused:
      return <Pause size={16} color="#f59e0b" />;
    case NodeStates.Completed:
      return <CheckCircle size={16} color="#10b981" />;
    case NodeStates.Failed:
      return <XCircle size={16} color="#ef4444" />;
    default:
      return null;
  }
};

export default StateIcon;
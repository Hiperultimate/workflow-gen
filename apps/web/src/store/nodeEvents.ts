import { create } from "zustand";

interface INodeEvent {
  eventSource: EventSource | null;
  updateEventSource: (newEventSource: EventSource | null) => void;
}

export const useEventSource = create<INodeEvent>((set) => ({
  eventSource: null,

  updateEventSource: (newEventSource: EventSource | null) => {
    set((state) => {
      if (newEventSource === null) {
        const currentEventSource = state.eventSource;
        if (currentEventSource) {
          currentEventSource.close();
        }
        return { eventSource: null };
      }
      return { eventSource: newEventSource };
    });
  },
}));

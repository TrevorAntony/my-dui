export const channel = new BroadcastChannel("bottom-menu-channel");

export const createEventSource = (url: string) => {
  try {
    if (typeof EventSource === "undefined") {
      console.warn("EventSource is not supported in this environment");
      return null;
    }
    return new EventSource(url);
  } catch (error) {
    console.warn("Failed to create EventSource:", error);
    return null;
  }
};

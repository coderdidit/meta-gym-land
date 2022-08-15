export { isInDebug, cancelAllAnimationFrames, debugLog };

const isInDebug = (): boolean => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
};

const debugLog = (message?: any, ...optionalParams: any[]) => {
  if (isInDebug()) {
    console.log(message, optionalParams);
  }
};

const cancelAllAnimationFrames = () => {
  let id = window.requestAnimationFrame(() => {
    if (isInDebug()) {
      console.log("[DevUtils] cancelAllAnimationFrames on exit");
    }
  });
  while (id--) {
    window.cancelAnimationFrame(id);
  }
};

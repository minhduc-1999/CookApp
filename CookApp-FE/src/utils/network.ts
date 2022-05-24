export const networkChecking = async () => {
  if (!navigator.onLine) throw new Error("You are offline");
};

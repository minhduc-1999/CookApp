export { default as time } from "./time";

export function createUpdatingNestedObject<T>(
  childName: string,
  updateObj: T
): Partial<T> {
  const keys = Object.keys(updateObj).filter(
    (key) => updateObj[key] !== null && updateObj[key] !== undefined
  );
  const updatingObj = {};
  keys.forEach((key) => {
    updatingObj[`${childName}.${key}`] = updateObj[key];
  });

  return updatingObj;
}

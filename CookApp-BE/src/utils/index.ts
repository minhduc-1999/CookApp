import _ = require("lodash");

export { default as time } from "./time";

export function createUpdatingNestedObject<T>(
  childName: string,
  updateObj: T
): Partial<T> {
  const keys = Object.keys(updateObj).filter(
    (key) => updateObj[key] !== null && updateObj[key] !== undefined
  );
  const updatingObj: Partial<T> = {};
  keys.forEach((key) => {
    updatingObj[`${childName}.${key}`] = updateObj[key];
  });

  updatingObj["updatedAt"] = _.now();

  return updatingObj;
}

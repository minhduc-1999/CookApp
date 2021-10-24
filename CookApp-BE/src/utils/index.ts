import _ = require("lodash");

export { default as time } from "./time";

export function createUpdatingNestedObject<T>(
  childName: string,
  updateObj: T, updateBy: string
): Partial<T> {
  const keys = Object.keys(updateObj).filter(
    (key) => updateObj[key] !== null && updateObj[key] !== undefined
  );
  const updatingObj: Partial<T> = {};
  keys.forEach((key) => {
    updatingObj[`${childName}.${key}`] = updateObj[key];
  });

  updatingObj["updatedAt"] = _.now();
  updatingObj["updatedBy"] = updateBy;


  return updatingObj;
}

export function createUpdatingObject<T>(updateObj: T, updateBy: string): Partial<T> {
  const keys = Object.keys(updateObj).filter(
    (key) => updateObj[key] !== null && updateObj[key] !== undefined
  );
  const updatingObj: Partial<T> = {};
  keys.forEach((key) => {
    updatingObj[key] = updateObj[key];
  });
  updatingObj["updatedAt"] = _.now();
  updatingObj["updatedBy"] = updateBy;

  return updatingObj;
}

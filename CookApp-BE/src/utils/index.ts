import _ = require("lodash");

export { default as time } from "./time";

export function createUpdatingNestedObject<T, R>(
  childName: string,
  updateObj: T,
  updateBy: string
): Partial<R> {
  const keys = Object.keys(updateObj).filter(
    (key) => updateObj[key] !== null && updateObj[key] !== undefined
  );
  const updatingObj: Partial<R> = {};
  keys.forEach((key) => {
    updatingObj[`${childName}.${key}`] = updateObj[key];
  });

  updatingObj["updatedAt"] = _.now();
  updatingObj["updatedBy"] = updateBy;

  return updatingObj;
}

export function createUpdatingObject<T>(
  updateObj: T,
  updateBy: string
): Partial<T> {
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

export function addFilePrefix(fileName: string, userId: string): string {
  return `${userId}_${_.now()}_${fileName}`;
}

export function getFileExtension(fileName: string): string {
  const regex = /\.\w+$/i;
  return fileName.match(regex)[0].slice(1);
}

export function getMimeType(fileName: string): string {
  let extension = getFileExtension(fileName);
  if (extension === "jpg") extension = "jpeg";
  return `image/${extension}`;
}

export function getNameFromPath(filePath: string): string {
  return filePath.slice(filePath.lastIndexOf("/") + 1);
}

export function clean(obj) {
  if (obj === null || obj === undefined) return null;
  for (const propName of Object.keys(obj)) {
    if (typeof obj[propName] === "object") {
      obj[propName] = clean(obj[propName]);
    }
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import storage from "config/storage";
import { imageFileFilter } from "utils/fileFilter";

export const ImagesInterceptor = (fieldName: string) => {
  const maxImagesFile = storage.maxImagesPerRequest;
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, maxImagesFile, {
        fileFilter: imageFileFilter,
      })
    )
  );
};

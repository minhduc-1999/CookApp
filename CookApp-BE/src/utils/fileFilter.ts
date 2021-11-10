import { BadRequestException } from "@nestjs/common";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error("Only images are allowed!"), false);
  }
  callback(null, true);
};

export const videoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp4)$/)) {
    return callback(new Error("Only videos are allowed!"), false);
  }
  callback(null, true);
};
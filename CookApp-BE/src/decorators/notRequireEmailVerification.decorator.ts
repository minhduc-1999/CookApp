import { SetMetadata } from "@nestjs/common";

export const NotRequireEmailVerification = () =>
  SetMetadata("notRequireEmailVerification", true);

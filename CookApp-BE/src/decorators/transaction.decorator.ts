import { SetMetadata } from "@nestjs/common";

export const Transaction = () => SetMetadata("hasTransaction", true);

import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class PreSignedLinkResponse {
  @ApiResponseProperty({ type: String })
  objectName: string;
  
  @ApiResponseProperty({ type: String })
  signedLink: string;
}

export class PreSignedLinkRequest {
  @ApiProperty({type: [String]})
  @IsArray()
  @IsString({each: true})
  fileNames: string[]
}
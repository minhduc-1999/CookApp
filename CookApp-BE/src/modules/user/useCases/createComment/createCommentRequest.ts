import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentRequest {
    postId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String})
    content: string;

    @IsMongoId()
    @IsOptional()
    @ApiPropertyOptional({type: String})
    parentId: string;
}

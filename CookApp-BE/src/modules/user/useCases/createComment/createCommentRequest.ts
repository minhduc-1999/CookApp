import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCommentRequest {
    postId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String})
    content: string;

    @IsUUID()
    @IsOptional()
    @ApiPropertyOptional({type: String})
    parentId: string;
}

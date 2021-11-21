import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { plainToClass } from "class-transformer";
import { CommentPageOption } from "modules/user/useCases/getPostComments";

@Injectable()
export class ParsePaginationPipe implements PipeTransform<any, PageOptionsDto> {
  transform(value: any, metadata: ArgumentMetadata): PageOptionsDto {
    return plainToClass(PageOptionsDto, value);
  }
}

@Injectable()
export class ParseCommentPaginationPipe
  implements PipeTransform<any, CommentPageOption> {
  transform(value: any, metadata: ArgumentMetadata): CommentPageOption {
    return plainToClass(CommentPageOption, value);
  }
}

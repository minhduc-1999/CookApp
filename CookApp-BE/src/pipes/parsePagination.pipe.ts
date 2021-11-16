import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { plainToClass } from "class-transformer";

@Injectable()
export class ParsePaginationPipe implements PipeTransform<any, PageOptionsDto> {
  transform(value: any, metadata: ArgumentMetadata): PageOptionsDto {
    return plainToClass(PageOptionsDto, value);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from '../pageOptions.base';
import { MetaDTO } from './responseMeta.dto';

interface IPageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    total: number;
}

export class PageMetaDto  extends MetaDTO{

    @ApiProperty()
    readonly offset: number;

    @ApiProperty()
    readonly limit: number;

    @ApiProperty()
    readonly total: number;

    constructor({ pageOptionsDto, total }: IPageMetaDtoParameters) {
        super()
        this.offset = pageOptionsDto?.offset;
        this.limit = pageOptionsDto?.limit;
        this.total = total;
    }
}

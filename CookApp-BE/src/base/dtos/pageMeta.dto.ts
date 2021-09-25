import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from '../pageOptions.base';

interface IPageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    total: number;
}

export class PageMetaDto {
    @ApiProperty()
    readonly ok?: Boolean;

    @ApiProperty()
    readonly message?: string;

    @ApiProperty()
    readonly offset: number;

    @ApiProperty()
    readonly limit: number;

    @ApiProperty()
    readonly total: number;

    constructor({ pageOptionsDto, total }: IPageMetaDtoParameters) {
        this.offset = pageOptionsDto?.offset;
        this.limit = pageOptionsDto?.limit;
        this.total = total;
    }
}

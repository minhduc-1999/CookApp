import { MetaDTO } from "./responseMeta.dto";

class PageMetaDTO extends MetaDTO {
  limit: number;

  offset: number;

  total: number;
}

export class ResponsePageMetaDTO {
  meta: PageMetaDTO;
}

import { ErrorCode } from "enums/errorCode.enum";
import { PageMetaDto } from "./dtos/pageMeta.dto";
import { ResponseDTO } from "./dtos/response.dto";
import { MetaDTO } from "./dtos/responseMeta.dto";

export class Result<T> {
  private _isError: boolean;
  private _errorMessage: string;
  private _data: any | T;
  private _meta: MetaDTO;
  private _errorCode: ErrorCode;

  constructor(
    isError = false,
    errorMessage = "",
    data = null,
    meta = null,
    errorCode = null
  ) {
    this.setIsError(isError);
    this.setErrorMessage(errorMessage);
    this.setErrorCode(errorCode);
    if (data) {
      this.setData(data);
    }
    if (meta) {
      this.setMeta(meta);
    }
  }

  public isError(): boolean {
    return this._isError;
  }

  public setIsError(isError: boolean) {
    this._isError = isError;
  }

  public getErrorMessage(): string {
    return this._errorMessage;
  }

  public setErrorMessage(errorMessage: string) {
    this._errorMessage = errorMessage;
  }

  public getData(): T {
    return this._data;
  }

  public setData(data: T) {
    this._data = data;
  }

  public getMeta(): any {
    return this._meta;
  }

  public setMeta(meta: any) {
    if (typeof meta === "object") {
      this._meta = meta;
    }
  }
  public getErrorCode(): any {
    return this._errorCode;
  }

  public setErrorCode(errorCode: ErrorCode) {
    this._errorCode = errorCode;
  }

  public static ok<U>(data?, meta?: Partial<MetaDTO & PageMetaDto>) {
    return new Result<U>(false, "", data, meta, null);
  }

  public static okList<U>(data?, meta?: Partial<MetaDTO & PageMetaDto>) {
    return new Result<U>(false, "", { items: data }, meta, null);
  }

  public static fail<U>(errorMessage: string, errorCode: ErrorCode) {
    return new Result<U>(true, errorMessage, null, null, errorCode);
  }

  public getResponseDTO(): ResponseDTO<any> {
    if (this._isError) {
      return ResponseDTO.fail(this._errorMessage, this._errorCode);
    }
    let meta = { ok: true };
    if (this._meta) {
      meta = { ...meta, ...this._meta };
    }
    return {
      meta,
      data: this._data.toDto ? this._data.toDto() : this._data,
    };
  }
}

import { ResponseDTO } from './dtos/response.dto';
import { ResponseMetaDTO } from './dtos/responseMeta.dto';

export class ResultService<T> {
  private _isError: boolean;
  private _errorMessage: string;
  private _data: any | T;
  private _meta: any;
  constructor(isError = false, errorMessage = '', data = null, meta = null) {
    this.setIsError(isError);
    this.setErrorMessage(errorMessage);
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

  /**
   *
   * @param meta Object
   */
  public setMeta(meta: any) {
    if (typeof meta === 'object') {
      this._meta = meta;
    }
  }

  public static ok<U>(data?, meta?) {
    return new ResultService<U>(false, '', data, meta);
  }

  public static fail<U>(errorMessage: string) {
    return new ResultService<U>(true, errorMessage);
  }

  public getControllerResponse(): ResponseDTO<T> | ResponseMetaDTO {
    if (this._isError) {
      return {
        meta: { status: "FAILED", message: this._errorMessage },
      };
    }
    let meta = { status: "SUCCESS" };
    if (this._meta) {
      meta = { ...meta, ...this._meta };
    }
    return {
      meta,
      data: this._data,
    };
  }
}

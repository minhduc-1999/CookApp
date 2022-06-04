import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { customAlphabet, nanoid } from 'nanoid';

export class UtilsService {
  /**
   * convert entity to dto class instance
   * @param {{new(entity: E, options: any): T}} model
   * @param {E[] | E} entity
   * @param options
   * @returns {T[] | T}
   */
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: any,
  ): T;

  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: any,
  ): T[];

  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: any,
  ): T {
    return new model(entity, options);
  }

  public static toDtos<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: any,
  ): T[] {
    if (_.isArray(entity)) {
      return entity.map(u => new model(u, options));
    }
    return [];
  }


  /**
   * generate hash from password or string
   * @param {string} password
   * @returns {string}
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number) {
    return nanoid(length);
  }
  /**
   * validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '');
  }

  static get<B, C = undefined>(
    func: () => B,
    defaultValue?: C,
  ): B | C | undefined {
    try {
      const value = func();

      if (_.isUndefined(value)) {
        return defaultValue;
      }
      return value;
    } catch {
      return defaultValue;
    }
  }

  static _try<T>(promise): Promise<[Error | null, T | null]> {
    return promise.then(result => [null, result]).catch(error => [error, null]);
  }

  /**
   *
   * @param array array survey/template questions
   * @param newIndex new order start from 1
   * @param oldIndex old index start from 1
   */
  static reorderQuestion<T>(
    array: T[],
    newIndex: number,
    oldIndex: number,
  ): T[] {
    const newArray = [...array];
    const _newIndex =
      newIndex >= array.length
        ? array.length - 1
        : newIndex < 0
          ? 0
          : newIndex - 1;
    const _oldIndex = oldIndex - 1;

    const currentElement = newArray.splice(_oldIndex, 1)[0];
    newArray.splice(_newIndex, 0, currentElement);

    return newArray;
  }

  static getConfig(name: string, defaultValue?: any) {
    const value = process.env[name];
    if (value === undefined || value === '') {
      if (defaultValue === undefined) {
        throw new Error(
          `${name} environment variable is not set. Please check .env file`,
        );
      }
      return defaultValue;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  static generateUniqueNumberCode(length: number) {
    const alphabet = '1234567890';
    const nanoid = customAlphabet(alphabet, length);
    return nanoid() //=> "4f90d13a42"
  }

  static generateUniqueCode(length: number = 6) {
    const alphabet = '1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM';
    const nanoid = customAlphabet(alphabet, length);
    return nanoid() //=> "4f90d13a42"
  }
}

export interface IUpdatable<T> {
  getUpdatableFields(): (keyof T)[];
}

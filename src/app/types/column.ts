export interface Column<T> {
  name: string,
  displayName?: string,
  getValue: (model: T) => string
  show: boolean,
  canSort: boolean,
}

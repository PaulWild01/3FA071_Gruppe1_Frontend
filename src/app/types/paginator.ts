export interface Paginator<T> {
  currentPage: number,
  lastPage: number,
  from: number,
  to: number,
  total: number,
  items: T[],
}

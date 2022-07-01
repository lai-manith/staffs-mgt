export interface BaseDatatable<T = any[]> {
  list: T[];
  total: number;
  total_unread?: number;
}

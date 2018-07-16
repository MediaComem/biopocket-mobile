import { HttpResponse } from '@angular/common/http';

/**
 * Represents an HTTP response which contains paginated resources.
 * The type of paginated resource should by specified as a Generic Type for this class.
 * A PaginatedResponse<T> has two properties:
 * * `pagination` which is an object containing the pagination data.
 * * `data` which is an object of T type containing the actual data from the HTTP response.
 */
export default class PaginatedResponse<T> {

  pagination: PaginationData;
  data: T[];

  /**
   * Creates a new PaginatedResponse
   */
  constructor(response: HttpResponse<T[]>, mapFunction: (data: any) => T) {
    this.pagination = {
      offset: Number(response.headers.get('pagination-offset')),
      limit: Number(response.headers.get('pagination-limit')),
      total: Number(response.headers.get('pagination-total')),
      filteredTotal: Number(response.headers.get('pagination-filtered-total'))
    };
    this.data = response.body.map(mapFunction);
  }

  /**
   * Based on the pagination data, this methods indicates wether or not there are more data that could be fetched from the API.
   */
  hasMore(): boolean {
    return this.pagination.limit + this.pagination.offset < this.pagination.filteredTotal;
  }

}

/**
 * Defines the structure of a pagination data object.
 */
export interface PaginationData {
  offset: number;
  limit: number;
  total: number;
  filteredTotal: number;
}
import { Injectable } from "@angular/core";

export interface PaginatorState {
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
}

export interface FilterState {
  [key: string]: any;
}

/**
 * Service pour gérer l'état des listes avec pagination et filtres
 */
@Injectable({
  providedIn: "root",
})
export class AdminListStateService {
  /**
   * État initial par défaut
   */
  getDefaultPaginatorState(): PaginatorState {
    return {
      pageIndex: 0,
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100],
    };
  }

  /**
   * Calcule l'offset à partir de pageIndex et pageSize
   */
  calculateOffset(pageIndex: number, pageSize: number): number {
    return pageIndex * pageSize;
  }

  /**
   * Construit les paramètres de pagination
   */
  getPaginationParams(
    pageIndex: number,
    pageSize: number,
  ): { page: number; limit: number } {
    return {
      page: pageIndex + 1, // L'API utilise 1-based indexing
      limit: pageSize,
    };
  }
}

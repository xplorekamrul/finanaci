
export const ITEMS_PER_PAGE = 20;

export interface PaginationParams {
   page?: number | string;
   limit?: number;
}

export interface PaginatedResponse<T> {
   data: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
   };
}

export function getPaginationParams(params: PaginationParams) {
   const page = Math.max(1, parseInt(String(params.page || 1)));
   const limit = Math.min(params.limit || ITEMS_PER_PAGE, 100);
   const skip = (page - 1) * limit;

   return { page, limit, skip };
}

export function createPaginatedResponse<T>(
   data: T[],
   total: number,
   page: number,
   limit: number
): PaginatedResponse<T> {
   const totalPages = Math.ceil(total / limit);

   return {
      data,
      pagination: {
         page,
         limit,
         total,
         totalPages,
         hasNextPage: page < totalPages,
         hasPrevPage: page > 1,
      },
   };
}

type PaginationQuery = {
  page?: string | number;
  pageSize?: string | number;
  limit?: string | number;
};

const MAX_PAGE_SIZE = 1000;
const DEFAULT_PAGE = 1;

function parsePositiveInt(value: string | number | undefined, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function parsePagination(query: PaginationQuery, defaultLimit = 10) {
  const page = parsePositiveInt(query.page, DEFAULT_PAGE);
  const rawLimit = query.limit ?? query.pageSize;
  const limit = Math.min(parsePositiveInt(rawLimit, defaultLimit), MAX_PAGE_SIZE);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildPaginationMeta(page: number, limit: number, totalRecords: number) {
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    currentPage: page,
    pageSize: limit,
    totalRecords,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getPaginationOptions(query: PaginationQuery, defaultPageSize: number) {
  const { page, limit, skip } = parsePagination(
    { page: query.page, pageSize: query.pageSize },
    defaultPageSize,
  );

  return {
    take: limit,
    skip,
    page,
    pageSize: limit,
  };
}

export function formatPaginationResponse<T>(
  data: T[],
  totalRecords: number,
  page: number,
  pageSize: number,
) {
  return {
    ...buildPaginationMeta(page, pageSize, totalRecords),
    data,
  };
}

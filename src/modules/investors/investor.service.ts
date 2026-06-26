import { Prisma } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";

// Input types
export type CategoryInput = {
  name: string;
  slug?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type DocumentInput = {
  name: string;
  url: string;
  categoryId: string;
};

export type QueryParams = {
  page?: string | number;
  limit?: string | number;
  search?: string;
  isActive?: string | boolean;
  categoryId?: string;
};

// --- Category Service Functions ---

export async function createCategory(input: CategoryInput, createdById: string) {
  const slug = input.slug || input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  // Check if slug is unique
  const existing = await prisma.investorCategory.findUnique({
    where: { slug }
  });
  if (existing) {
    throw new AppError("Category slug already exists. Please choose a different name or specify a custom slug.", 400);
  }

  return prisma.investorCategory.create({
    data: {
      name: input.name,
      slug,
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
      createdById,
    },
    include: {
      _count: {
        select: { documents: true }
      }
    }
  });
}

export async function getCategories(query: QueryParams) {
  const { page, limit, skip } = parsePagination(query);
  const search = query.search?.trim();

  const where: Prisma.InvestorCategoryWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.isActive !== undefined
      ? { isActive: query.isActive === "true" || query.isActive === true }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.investorCategory.count({ where }),
    prisma.investorCategory.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: limit,
      include: {
        _count: {
          select: { documents: true }
        }
      }
    }),
  ]);

  return {
    items,
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function getCategoryById(id: string) {
  const category = await prisma.investorCategory.findUnique({
    where: { id },
    include: {
      documents: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!category) {
    throw new AppError("Investor category not found", 404);
  }

  return category;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const existing = await prisma.investorCategory.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Investor category not found", 404);
  }

  let slug = input.slug;
  if (input.name && !input.slug) {
    slug = input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  if (slug && slug !== existing.slug) {
    const duplicate = await prisma.investorCategory.findUnique({ where: { slug } });
    if (duplicate) {
      throw new AppError("Category slug already exists", 400);
    }
  }

  return prisma.investorCategory.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
    include: {
      _count: {
        select: { documents: true }
      }
    }
  });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.investorCategory.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Investor category not found", 404);
  }

  // Deletes category and all documents cascade via Prisma schema config
  return prisma.investorCategory.delete({
    where: { id }
  });
}

// --- Document Service Functions ---

export async function createDocument(input: DocumentInput, createdById: string) {
  // Validate category exists
  const category = await prisma.investorCategory.findUnique({
    where: { id: input.categoryId }
  });
  if (!category) {
    throw new AppError("Invalid Category ID", 400);
  }

  return prisma.investorDocument.create({
    data: {
      name: input.name,
      url: input.url,
      categoryId: input.categoryId,
      createdById,
    },
    include: {
      category: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
}

export async function getDocuments(query: QueryParams) {
  const { page, limit, skip } = parsePagination(query);
  const search = query.search?.trim();

  const where: Prisma.InvestorDocumentWhereInput = {
    deletedAt: null,
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.investorDocument.count({ where }),
    prisma.investorDocument.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }),
  ]);

  return {
    items,
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function getDocumentById(id: string) {
  const doc = await prisma.investorDocument.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: true
    }
  });

  if (!doc) {
    throw new AppError("Investor document not found", 404);
  }

  return doc;
}

export async function updateDocument(id: string, input: Partial<DocumentInput>) {
  const existing = await prisma.investorDocument.findFirst({
    where: { id, deletedAt: null }
  });
  if (!existing) {
    throw new AppError("Investor document not found", 404);
  }

  if (input.categoryId) {
    const category = await prisma.investorCategory.findUnique({
      where: { id: input.categoryId }
    });
    if (!category) {
      throw new AppError("Invalid Category ID", 400);
    }
  }

  return prisma.investorDocument.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.url !== undefined ? { url: input.url } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
    },
    include: {
      category: true
    }
  });
}

export async function deleteDocument(id: string) {
  const existing = await prisma.investorDocument.findFirst({
    where: { id, deletedAt: null }
  });
  if (!existing) {
    throw new AppError("Investor document not found", 404);
  }

  return prisma.investorDocument.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}

// --- Public Service Functions ---

export async function getPublicInvestorCategoriesWithDocs() {
  return prisma.investorCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      documents: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          url: true
        }
      }
    }
  });
}

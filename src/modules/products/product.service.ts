import { Prisma } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";

export type ProductInput = {
	title?: string;
	subLabel?: string | null;
	description?: string | null;
	categoryId?: string;
	image?: string | null;
	thumbnails?: string[];
	keyBenefits?: string[];
	consumerNeed?: string | null;
	ingredientsList?: Prisma.InputJsonValue | null;
	isActive?: boolean;
	sortOrder?: number;
};

export type CategoryInput = {
	name?: string;
	slug?: string;
	sectionTitle?: string;
	sectionSubtitle?: string | null;
	isActive?: boolean;
	sortOrder?: number;
};

export type ProductQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	categoryId?: string;
	isActive?: string;
};

export type CategoryQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	isActive?: string;
};

const productInclude = {
	category: {
		select: {
			id: true,
			name: true,
			slug: true,
		},
	},
	createdBy: {
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	},
} as const;

const categoryInclude = {
	_count: {
		select: {
			products: {
				where: { deletedAt: null },
			},
		},
	},
} as const;

// ── Products CRUD ──────────────────────────────────────────────────────

async function findActiveProduct(id: string) {
	return prisma.product.findFirst({
		where: { id, deletedAt: null },
	});
}

export async function createProduct(input: ProductInput, createdById: string) {
	// Verify category exists
	if (!input.categoryId) {
		throw new AppError("Category ID is required", 400);
	}
	const categoryExists = await prisma.productCategory.findUnique({
		where: { id: input.categoryId },
	});
	if (!categoryExists) {
		throw new AppError("Product category not found", 404);
	}

	return prisma.product.create({
		data: {
			title: input.title ?? "",
			subLabel: input.subLabel ?? null,
			description: input.description ?? null,
			categoryId: input.categoryId,
			image: input.image ?? null,
			thumbnails: input.thumbnails ?? [],
			keyBenefits: input.keyBenefits ?? [],
			consumerNeed: input.consumerNeed ?? null,
			ingredientsList: input.ingredientsList ?? Prisma.DbNull,
			isActive: input.isActive ?? true,
			sortOrder: input.sortOrder ?? 0,
			createdById,
		},
		include: productInclude,
	});
}

export async function getProducts(query: ProductQuery) {
	const { page, limit, skip } = parsePagination(query);
	const search = query.search?.trim();

	const where: Prisma.ProductWhereInput = {
		deletedAt: null,
		...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
		...(query.categoryId ? { categoryId: query.categoryId } : {}),
		...(query.isActive !== undefined ? { isActive: query.isActive === "true" } : {}),
	};

	const [total, items] = await Promise.all([
		prisma.product.count({ where }),
		prisma.product.findMany({
			where,
			orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
			skip,
			take: limit,
			include: productInclude,
		}),
	]);

	return {
		items,
		pagination: buildPaginationMeta(page, limit, total),
	};
}

export async function getProductById(id: string) {
	const product = await prisma.product.findFirst({
		where: { id, deletedAt: null },
		include: productInclude,
	});

	if (!product) {
		throw new AppError("Product not found", 404);
	}

	return product;
}

export async function updateProduct(id: string, input: ProductInput) {
	const existing = await findActiveProduct(id);

	if (!existing) {
		throw new AppError("Product not found", 404);
	}

	if (input.categoryId) {
		const categoryExists = await prisma.productCategory.findUnique({
			where: { id: input.categoryId },
		});
		if (!categoryExists) {
			throw new AppError("Product category not found", 404);
		}
	}

	return prisma.product.update({
		where: { id },
		data: {
			...(input.title !== undefined ? { title: input.title } : {}),
			...(input.subLabel !== undefined ? { subLabel: input.subLabel } : {}),
			...(input.description !== undefined ? { description: input.description } : {}),
			...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
			...(input.image !== undefined ? { image: input.image } : {}),
			...(input.thumbnails !== undefined ? { thumbnails: input.thumbnails } : {}),
			...(input.keyBenefits !== undefined ? { keyBenefits: input.keyBenefits } : {}),
			...(input.consumerNeed !== undefined ? { consumerNeed: input.consumerNeed } : {}),
			...(input.ingredientsList !== undefined ? { ingredientsList: input.ingredientsList ?? Prisma.DbNull } : {}),
			...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
			...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
		},
		include: productInclude,
	});
}

export async function deleteProduct(id: string) {
	const existing = await findActiveProduct(id);

	if (!existing) {
		throw new AppError("Product not found", 404);
	}

	return prisma.product.update({
		where: { id },
		data: { deletedAt: new Date() },
		include: productInclude,
	});
}

// ── Product Categories CRUD ───────────────────────────────────────────

export async function createCategory(input: CategoryInput, createdById: string) {
	const slug = input.slug?.trim() || input.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `cat-${Date.now()}`;

	const existing = await prisma.productCategory.findUnique({
		where: { slug },
	});
	if (existing) {
		throw new AppError("Category slug already exists", 400);
	}

	return prisma.productCategory.create({
		data: {
			name: input.name ?? "",
			slug,
			sectionTitle: input.sectionTitle ?? "",
			sectionSubtitle: input.sectionSubtitle ?? null,
			isActive: input.isActive ?? true,
			sortOrder: input.sortOrder ?? 0,
			createdById,
		},
		include: categoryInclude,
	});
}

export async function getCategories(query: CategoryQuery) {
	const { page, limit, skip } = parsePagination(query);
	const search = query.search?.trim();

	const where: Prisma.ProductCategoryWhereInput = {
		...(search ? {
			OR: [
				{ name: { contains: search, mode: "insensitive" } },
				{ slug: { contains: search, mode: "insensitive" } },
			],
		} : {}),
		...(query.isActive !== undefined ? { isActive: query.isActive === "true" } : {}),
	};

	const [total, items] = await Promise.all([
		prisma.productCategory.count({ where }),
		prisma.productCategory.findMany({
			where,
			orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
			skip,
			take: limit,
			include: categoryInclude,
		}),
	]);

	return {
		items,
		pagination: buildPaginationMeta(page, limit, total),
	};
}

export async function getCategoryById(id: string) {
	const category = await prisma.productCategory.findUnique({
		where: { id },
		include: categoryInclude,
	});

	if (!category) {
		throw new AppError("Product category not found", 404);
	}

	return category;
}

export async function updateCategory(id: string, input: CategoryInput) {
	const existing = await prisma.productCategory.findUnique({ where: { id } });
	if (!existing) {
		throw new AppError("Product category not found", 404);
	}

	let slug = existing.slug;
	if (input.slug && input.slug !== existing.slug) {
		slug = input.slug.trim();
		const duplicate = await prisma.productCategory.findUnique({ where: { slug } });
		if (duplicate) {
			throw new AppError("Category slug already exists", 400);
		}
	}

	return prisma.productCategory.update({
		where: { id },
		data: {
			name: input.name ?? existing.name,
			slug,
			sectionTitle: input.sectionTitle ?? existing.sectionTitle,
			sectionSubtitle: input.sectionSubtitle !== undefined ? input.sectionSubtitle : existing.sectionSubtitle,
			isActive: input.isActive ?? existing.isActive,
			sortOrder: input.sortOrder ?? existing.sortOrder,
		},
		include: categoryInclude,
	});
}

export async function deleteCategory(id: string) {
	const existing = await prisma.productCategory.findUnique({ where: { id } });
	if (!existing) {
		throw new AppError("Product category not found", 404);
	}

	return prisma.productCategory.delete({
		where: { id },
		include: categoryInclude,
	});
}

// ── Public ─────────────────────────────────────────────────────────────

export async function getPublicCategoriesWithProducts() {
	return prisma.productCategory.findMany({
		where: { isActive: true },
		orderBy: { sortOrder: "asc" },
		select: {
			id: true,
			slug: true,
			name: true,
			sectionTitle: true,
			sectionSubtitle: true,
			products: {
				where: { isActive: true, deletedAt: null },
				orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
				select: {
					id: true,
					title: true,
					subLabel: true,
					description: true,
					image: true,
					thumbnails: true,
					keyBenefits: true,
					consumerNeed: true,
					ingredientsList: true,
				},
			},
		},
	});
}

export async function getPublicProductById(id: string) {
	const product = await prisma.product.findFirst({
		where: { id, isActive: true, deletedAt: null },
		select: {
			id: true,
			title: true,
			subLabel: true,
			description: true,
			categoryId: true,
			image: true,
			thumbnails: true,
			keyBenefits: true,
			consumerNeed: true,
			ingredientsList: true,
			sortOrder: true,
		},
	});

	if (!product) {
		throw new AppError("Product not found", 404);
	}

	return product;
}

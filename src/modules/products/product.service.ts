import { Prisma, ProductCategory } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";

export type ProductInput = {
	title?: string;
	subLabel?: string | null;
	description?: string | null;
	category?: ProductCategory;
	image?: string | null;
	thumbnails?: string[];
	keyBenefits?: string[];
	consumerNeed?: string | null;
	ingredientsList?: Prisma.InputJsonValue | null;
	isActive?: boolean;
	sortOrder?: number;
};

export type ProductQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	category?: string;
	isActive?: string;
};

const productInclude = {
	createdBy: {
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	},
} as const;

async function findActiveProduct(id: string) {
	return prisma.product.findFirst({
		where: { id, deletedAt: null },
	});
}

export async function createProduct(input: ProductInput, createdById: string) {
	return prisma.product.create({
		data: {
			title: input.title ?? "",
			subLabel: input.subLabel ?? null,
			description: input.description ?? null,
			category: input.category ?? "WELLNESS_GUMMIES",
			image: input.image ?? null,
			thumbnails: input.thumbnails ?? [],
			keyBenefits: input.keyBenefits ?? [],
			consumerNeed: input.consumerNeed ?? null,
			ingredientsList: input.ingredientsList ?? Prisma.JsonNull,
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
		...(query.category ? { category: query.category as ProductCategory } : {}),
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

	return prisma.product.update({
		where: { id },
		data: {
			...(input.title !== undefined ? { title: input.title } : {}),
			...(input.subLabel !== undefined ? { subLabel: input.subLabel } : {}),
			...(input.description !== undefined ? { description: input.description } : {}),
			...(input.category !== undefined ? { category: input.category } : {}),
			...(input.image !== undefined ? { image: input.image } : {}),
			...(input.thumbnails !== undefined ? { thumbnails: input.thumbnails } : {}),
			...(input.keyBenefits !== undefined ? { keyBenefits: input.keyBenefits } : {}),
			...(input.consumerNeed !== undefined ? { consumerNeed: input.consumerNeed } : {}),
			...(input.ingredientsList !== undefined ? { ingredientsList: input.ingredientsList as Prisma.InputJsonValue } : {}),
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

// ── Public ─────────────────────────────────────────────────────────────

export async function getPublicProducts(category?: string) {
	const where: Prisma.ProductWhereInput = {
		isActive: true,
		deletedAt: null,
		...(category ? { category: category as ProductCategory } : {}),
	};

	return prisma.product.findMany({
		where,
		orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
		select: {
			id: true,
			title: true,
			subLabel: true,
			description: true,
			category: true,
			image: true,
			thumbnails: true,
			keyBenefits: true,
			consumerNeed: true,
			ingredientsList: true,
			sortOrder: true,
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
			category: true,
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

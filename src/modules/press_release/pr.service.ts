import { Prisma } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";

export type PressReleaseInput = {
	title?: string;
	subtitle?: string | null;
	slug?: string;
	content?: Prisma.InputJsonValue;
	imageUrl?: string | null;
	pdfUrl?: string | null;
	releaseDate?: string | Date;
	isPublished?: boolean;
};

export type PressReleaseQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	published?: string;
};

const pressReleaseInclude = {
	createdBy: {
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	},
} as const;

async function findActivePressRelease(id: string) {
	return prisma.pressRelease.findFirst({
		where: { id, deletedAt: null },
	});
}

export async function createPressRelease(input: PressReleaseInput, createdById: string) {
	try {
		return await prisma.pressRelease.create({
			data: {
				title: input.title ?? "",
				subtitle: input.subtitle ?? null,
				slug: input.slug ?? "",
				content: input.content ?? Prisma.JsonNull,
				imageUrl: input.imageUrl ?? null,
				pdfUrl: input.pdfUrl ?? null,
				releaseDate: new Date(input.releaseDate ?? new Date()),
				isPublished: input.isPublished ?? false,
				publishedAt: input.isPublished ? new Date() : null,
				createdById,
			},
			include: pressReleaseInclude,
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new AppError("Press release slug already exists", 409);
		}

		throw error;
	}
}

export async function getPressReleases(query: PressReleaseQuery) {
	const { page, limit, skip } = parsePagination(query);
	const search = query.search?.trim();

	const where: Prisma.PressReleaseWhereInput = {
		deletedAt: null,
		...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
		...(query.published === undefined ? {} : { isPublished: query.published === "true" }),
	};

	const [total, items] = await Promise.all([
		prisma.pressRelease.count({ where }),
		prisma.pressRelease.findMany({
			where,
			orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
			skip,
			take: limit,
			include: pressReleaseInclude,
		}),
	]);

	return {
		items,
		pagination: buildPaginationMeta(page, limit, total),
	};
}

export async function getPressReleaseById(id: string) {
	const pressRelease = await prisma.pressRelease.findFirst({
		where: { id, deletedAt: null },
		include: pressReleaseInclude,
	});

	if (!pressRelease) {
		throw new AppError("Press release not found", 404);
	}

	return pressRelease;
}

export async function updatePressRelease(id: string, input: PressReleaseInput) {
	const existing = await findActivePressRelease(id);

	if (!existing) {
		throw new AppError("Press release not found", 404);
	}

	const setPublishedAt = input.isPublished === true && !existing.isPublished;

	try {
		return await prisma.pressRelease.update({
			where: { id },
			data: {
				...(input.title !== undefined ? { title: input.title } : {}),
				...(input.subtitle !== undefined ? { subtitle: input.subtitle } : {}),
				...(input.slug !== undefined ? { slug: input.slug } : {}),
				...(input.content !== undefined ? { content: input.content } : {}),
				...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
				...(input.pdfUrl !== undefined ? { pdfUrl: input.pdfUrl } : {}),
				...(input.releaseDate !== undefined ? { releaseDate: new Date(input.releaseDate) } : {}),
				...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
				...(setPublishedAt ? { publishedAt: new Date() } : {}),
			},
			include: pressReleaseInclude,
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			throw new AppError("Press release slug already exists", 409);
		}

		throw error;
	}
}

export async function deletePressRelease(id: string) {
	const existing = await findActivePressRelease(id);

	if (!existing) {
		throw new AppError("Press release not found", 404);
	}

	return prisma.pressRelease.update({
		where: { id },
		data: { deletedAt: new Date() },
		include: pressReleaseInclude,
	});
}

export async function getPublicPressReleases() {
	return prisma.pressRelease.findMany({
		where: {
			isPublished: true,
			deletedAt: null,
		},
		orderBy: { releaseDate: "desc" },
		select: {
			id: true,
			title: true,
			slug: true,
			imageUrl: true,
			releaseDate: true,
			subtitle: true,
			pdfUrl: true,
			content: true
		},
	});
}

export async function getPublicPressReleaseBySlug(slug: string) {
	const pressRelease = await prisma.pressRelease.findFirst({
		where: {
			slug,
			isPublished: true,
			deletedAt: null,
		},
		include: pressReleaseInclude,
	});

	if (!pressRelease) {
		throw new AppError("Press release not found", 404);
	}

	return pressRelease;
}

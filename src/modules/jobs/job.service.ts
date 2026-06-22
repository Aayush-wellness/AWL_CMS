import { JobStatus, JobType, Prisma } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";

export type JobInput = {
	title?: string;
	department?: string;
	location?: string;
	type?: JobType;
	experience?: string;
	description?: string | null;
	status?: JobStatus;
};

export type JobQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	status?: string;
	department?: string;
};

const jobInclude = {
	createdBy: {
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	},
	_count: {
		select: { applications: true },
	},
} as const;

async function findActiveJob(id: string) {
	return prisma.jobPost.findFirst({
		where: { id, deletedAt: null },
	});
}

export async function createJob(input: JobInput, createdById: string) {
	return prisma.jobPost.create({
		data: {
			title: input.title ?? "",
			department: input.department ?? "",
			location: input.location ?? "",
			type: input.type ?? "FULL_TIME",
			experience: input.experience ?? "",
			description: input.description ?? null,
			status: input.status ?? "DRAFT",
			createdById,
		},
		include: jobInclude,
	});
}

export async function getJobs(query: JobQuery) {
	const { page, limit, skip } = parsePagination(query);
	const search = query.search?.trim();

	const where: Prisma.JobPostWhereInput = {
		deletedAt: null,
		...(search
			? {
				OR: [
					{ title: { contains: search, mode: "insensitive" } },
					{ department: { contains: search, mode: "insensitive" } },
				],
			}
			: {}),
		...(query.status ? { status: query.status as JobStatus } : {}),
		...(query.department ? { department: { contains: query.department, mode: "insensitive" } } : {}),
	};

	const [total, items] = await Promise.all([
		prisma.jobPost.count({ where }),
		prisma.jobPost.findMany({
			where,
			orderBy: [{ createdAt: "desc" }],
			skip,
			take: limit,
			include: jobInclude,
		}),
	]);

	return {
		items,
		pagination: buildPaginationMeta(page, limit, total),
	};
}

export async function getJobById(id: string) {
	const job = await prisma.jobPost.findFirst({
		where: { id, deletedAt: null },
		include: jobInclude,
	});

	if (!job) {
		throw new AppError("Job post not found", 404);
	}

	return job;
}

export async function updateJob(id: string, input: JobInput) {
	const existing = await findActiveJob(id);

	if (!existing) {
		throw new AppError("Job post not found", 404);
	}

	const setPublishedAt =
		input.status === "PUBLISHED" && existing.status !== "PUBLISHED"
			? new Date()
			: undefined;

	const setClosedAt =
		input.status === "CLOSED" && existing.status !== "CLOSED"
			? new Date()
			: undefined;

	return prisma.jobPost.update({
		where: { id },
		data: {
			...(input.title !== undefined ? { title: input.title } : {}),
			...(input.department !== undefined ? { department: input.department } : {}),
			...(input.location !== undefined ? { location: input.location } : {}),
			...(input.type !== undefined ? { type: input.type } : {}),
			...(input.experience !== undefined ? { experience: input.experience } : {}),
			...(input.description !== undefined ? { description: input.description } : {}),
			...(input.status !== undefined ? { status: input.status } : {}),
			...(setPublishedAt ? { publishedAt: setPublishedAt } : {}),
			...(setClosedAt ? { closedAt: setClosedAt } : {}),
		},
		include: jobInclude,
	});
}

export async function deleteJob(id: string) {
	const existing = await findActiveJob(id);

	if (!existing) {
		throw new AppError("Job post not found", 404);
	}

	return prisma.jobPost.update({
		where: { id },
		data: { deletedAt: new Date() },
		include: jobInclude,
	});
}

// ── Public ─────────────────────────────────────────────────────────────

export async function getPublicJobs() {
	return prisma.jobPost.findMany({
		where: {
			status: "PUBLISHED",
			deletedAt: null,
		},
		orderBy: { publishedAt: "desc" },
		select: {
			id: true,
			title: true,
			department: true,
			location: true,
			type: true,
			experience: true,
			description: true,
			publishedAt: true,
		},
	});
}

export async function getPublicJobById(id: string) {
	const job = await prisma.jobPost.findFirst({
		where: { id, status: "PUBLISHED", deletedAt: null },
		select: {
			id: true,
			title: true,
			department: true,
			location: true,
			type: true,
			experience: true,
			description: true,
			publishedAt: true,
		},
	});

	if (!job) {
		throw new AppError("Job not found", 404);
	}

	return job;
}

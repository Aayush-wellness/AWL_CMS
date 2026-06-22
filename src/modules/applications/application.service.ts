import { ApplicationStatus, Prisma } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";

export type ApplicationSubmitInput = {
	jobPostId?: string | null;
	fullName: string;
	email: string;
	phone: string;
	location: string;
	experience: string;
	resumeUrl: string;
	coverNote?: string | null;
};

export type ApplicationQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	status?: string;
	jobPostId?: string;
};

const applicationInclude = {
	jobPost: {
		select: {
			id: true,
			title: true,
			department: true,
			location: true,
		},
	},
} as const;

export async function submitApplication(input: ApplicationSubmitInput) {
	// Validate jobPostId if provided — must be a real, non-deleted job
	if (input.jobPostId) {
		const job = await prisma.jobPost.findFirst({
			where: { id: input.jobPostId, status: "PUBLISHED", deletedAt: null },
		});

		if (!job) {
			throw new AppError("Job post not found or no longer accepting applications", 404);
		}
	}

	return prisma.jobApplication.create({
		data: {
			jobPostId: input.jobPostId || null,
			fullName: input.fullName,
			email: input.email,
			phone: input.phone,
			location: input.location,
			experience: input.experience,
			resumeUrl: input.resumeUrl,
			coverNote: input.coverNote ?? null,
			status: "PENDING",
		},
		include: applicationInclude,
	});
}

export async function getApplications(query: ApplicationQuery) {
	const { page, limit, skip } = parsePagination(query);
	const search = query.search?.trim();

	const where: Prisma.JobApplicationWhereInput = {
		...(search
			? {
				OR: [
					{ fullName: { contains: search, mode: "insensitive" } },
					{ email: { contains: search, mode: "insensitive" } },
				],
			}
			: {}),
		...(query.status ? { status: query.status as ApplicationStatus } : {}),
		...(query.jobPostId ? { jobPostId: query.jobPostId } : {}),
	};

	const [total, items] = await Promise.all([
		prisma.jobApplication.count({ where }),
		prisma.jobApplication.findMany({
			where,
			orderBy: { createdAt: "desc" },
			skip,
			take: limit,
			include: applicationInclude,
		}),
	]);

	return {
		items,
		pagination: buildPaginationMeta(page, limit, total),
	};
}

export async function getApplicationById(id: string) {
	const application = await prisma.jobApplication.findUnique({
		where: { id },
		include: applicationInclude,
	});

	if (!application) {
		throw new AppError("Application not found", 404);
	}

	return application;
}

export async function updateApplicationStatus(
	id: string,
	status: ApplicationStatus,
	notes?: string | null,
) {
	const existing = await prisma.jobApplication.findUnique({ where: { id } });

	if (!existing) {
		throw new AppError("Application not found", 404);
	}

	return prisma.jobApplication.update({
		where: { id },
		data: {
			status,
			...(notes !== undefined ? { notes } : {}),
		},
		include: applicationInclude,
	});
}

export async function deleteApplication(id: string) {
	const existing = await prisma.jobApplication.findUnique({ where: { id } });

	if (!existing) {
		throw new AppError("Application not found", 404);
	}

	return prisma.jobApplication.delete({ where: { id } });
}

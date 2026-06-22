import { Prisma } from "@prisma/client";
import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { buildPaginationMeta, parsePagination } from "../../utils/paginationUtils.js";
import { sendContactEmail } from "../../utils/email.js";

export type ContactSubmitInput = {
	fullName: string;
	email: string;
	phoneNo?: string | null;
	company?: string | null;
	inquiryType?: string | null;
	message: string;
};

export type ContactQuery = {
	page?: string | number;
	limit?: string | number;
	search?: string;
	isRead?: string;
};

// ── Public: Save to DB and send notification email ───────────────────────

export async function submitContactInquiry(input: ContactSubmitInput) {
	console.log("enquiery has been reaached here")
	const inquiry = await prisma.contactInquiry.create({
		data: {
			fullName: input.fullName,
			email: input.email,
			phoneNo: input.phoneNo ?? null,
			company: input.company ?? null,
			inquiryType: input.inquiryType ?? null,
			message: input.message,
		},
	});

	// Fire-and-forget email notification (do not block response)
	sendContactEmail({
		fullName: input.fullName,
		email: input.email,
		company: input.company ?? undefined,
		inquiryType: input.inquiryType ?? undefined,
		message: input.message,
	}).catch((err) => {
		console.error("[ContactService] Email notification failed:", err);
	});

	console.log("enquiery has been saved in database", inquiry)

	return inquiry;
}

// ── Admin: Paginated list ────────────────────────────────────────────────

export async function getContactInquiries(query: ContactQuery) {
	const { page, limit, skip } = parsePagination(query);
	const search = query.search?.trim();

	const where: Prisma.ContactInquiryWhereInput = {
		deletedAt: null,
		...(search
			? {
				OR: [
					{ fullName: { contains: search, mode: "insensitive" } },
					{ email: { contains: search, mode: "insensitive" } },
				],
			}
			: {}),
		...(query.isRead !== undefined ? { isRead: query.isRead === "true" } : {}),
	};

	const [total, items] = await Promise.all([
		prisma.contactInquiry.count({ where }),
		prisma.contactInquiry.findMany({
			where,
			orderBy: { createdAt: "desc" },
			skip,
			take: limit,
		}),
	]);

	return {
		items,
		pagination: buildPaginationMeta(page, limit, total),
	};
}

export async function getContactInquiryById(id: string) {
	const inquiry = await prisma.contactInquiry.findFirst({
		where: { id, deletedAt: null },
	});

	if (!inquiry) {
		throw new AppError("Contact inquiry not found", 404);
	}

	return inquiry;
}

export async function markInquiryAsRead(id: string) {
	const existing = await prisma.contactInquiry.findFirst({
		where: { id, deletedAt: null },
	});

	if (!existing) {
		throw new AppError("Contact inquiry not found", 404);
	}

	return prisma.contactInquiry.update({
		where: { id },
		data: { isRead: true },
	});
}

export async function deleteContactInquiry(id: string) {
	const existing = await prisma.contactInquiry.findFirst({
		where: { id, deletedAt: null },
	});

	if (!existing) {
		throw new AppError("Contact inquiry not found", 404);
	}

	return prisma.contactInquiry.update({
		where: { id },
		data: { deletedAt: new Date() },
	});
}

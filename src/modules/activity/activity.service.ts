import prisma from "@root/prisma.js";

export async function logActivity(type: string, action: string, text: string, meta?: string) {
  try {
    return await prisma.activity.create({
      data: {
        type,
        action,
        text,
        meta: meta ?? null,
      },
    });
  } catch (err) {
    console.error("[ActivityService] Failed to log activity:", err);
  }
}

export async function getRecentActivities(limit: number = 10) {
  return prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getDashboardStats() {
  const [pressReleases, products, contactResponses, jobPostings, investorDocuments] = await Promise.all([
    prisma.pressRelease.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.contactInquiry.count({ where: { deletedAt: null } }),
    prisma.jobPost.count({ where: { deletedAt: null } }),
    prisma.investorDocument.count({ where: { deletedAt: null } }),
  ]);

  return {
    pressReleases,
    products,
    contactResponses,
    jobPostings,
    investorDocuments,
  };
}

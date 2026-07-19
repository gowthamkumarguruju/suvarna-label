import type { prisma as prismaClient } from "@/lib/prisma";

export type MediaNudge = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  mediaStatus: string;
  reason: string;
};

const STAGE_LABEL: Record<string, string> = {
  PHOTOGRAPHY_PENDING: "photos not uploaded yet",
  IMAGES_UPLOADED: "awaiting verification",
  INTERNAL_REVIEW: "awaiting verification",
  APPROVED: "approved but not yet posted",
};

export async function getMediaPipelineNudges(
  prisma: typeof prismaClient,
): Promise<MediaNudge[]> {
  const orders = await prisma.order.findMany({
    where: {
      status: "COMPLETED",
      mediaStatus: {
        in: ["PHOTOGRAPHY_PENDING", "IMAGES_UPLOADED", "INTERNAL_REVIEW", "APPROVED"],
      },
    },
    include: {
      customer: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  const now = new Date();

  return orders.map((order) => {
    const ageDays = Math.floor(
      (now.getTime() - order.updatedAt.getTime()) / 86_400_000,
    );

    const stage = STAGE_LABEL[order.mediaStatus] ?? order.mediaStatus;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      mediaStatus: order.mediaStatus,
      reason: `${stage} (${ageDays} day${ageDays === 1 ? "" : "s"} since last update)`,
    };
  });
}

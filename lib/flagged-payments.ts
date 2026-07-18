import type { prisma as prismaClient } from "@/lib/prisma";

const STALE_UNPAID_DAYS = 3;

function decimalToNumber(value: unknown): number {
  return Number(value ?? 0);
}

export type FlaggedPayment = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  balance: number;
  paymentStatus: string;
  requiredBy: Date | null;
  reason: string;
  createdAt: Date;
};

export async function getFlaggedPayments(
  prisma: typeof prismaClient,
): Promise<FlaggedPayment[]> {
  const now = new Date();

  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: {
        in: ["UNPAID", "ADVANCE_PAID", "PARTIALLY_PAID", "COD_PENDING"],
      },
    },
    include: {
      customer: true,
      payments: true,
      shipments: true,
    },
  });

  const flagged: FlaggedPayment[] = [];

  for (const order of orders) {
    const total = decimalToNumber(order.total);
    const balance =
      total -
      order.payments
        .filter((payment) => payment.status !== "REFUNDED")
        .reduce((sum, payment) => sum + decimalToNumber(payment.amount), 0);

    if (balance <= 0) {
      continue;
    }

    let reason: string | null = null;

    if (order.requiredBy && order.requiredBy < now) {
      reason = `Required-by date has passed with ${balance.toFixed(2)} still due`;
    }

    if (!reason && order.paymentStatus === "UNPAID") {
      const ageDays = Math.floor(
        (now.getTime() - order.createdAt.getTime()) / 86_400_000,
      );

      if (ageDays >= STALE_UNPAID_DAYS) {
        reason = `No payment recorded ${ageDays} days after the order was placed`;
      }
    }

    if (!reason && order.paymentStatus === "COD_PENDING") {
      const overdueShipment = order.shipments.find(
        (shipment) =>
          shipment.estimatedDelivery &&
          shipment.estimatedDelivery < now &&
          !shipment.deliveredAt,
      );

      if (overdueShipment) {
        reason = "COD collection is pending past the estimated delivery date";
      }
    }

    if (reason) {
      flagged.push({
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        total,
        balance,
        paymentStatus: order.paymentStatus,
        requiredBy: order.requiredBy,
        reason,
        createdAt: order.createdAt,
      });
    }
  }

  return flagged;
}

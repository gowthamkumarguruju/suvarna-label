import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getFlaggedPayments } from "@/lib/flagged-payments";

type MeasurementInput = {
  field: string;
  value: string;
};

type OrderItemInput = {
  articleType: string;
  orderType: string;
  description: string;
  color?: string;
  fabric?: string;
  quantity: number;
  unitPrice: number;
  stitchingCharge?: number;
  customizationCharge?: number;
  measurements: MeasurementInput[];
};

type CreateOrderInput = {
  customer: {
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    preferredLanguage?: string;
    marketingConsent?: string;
  };
  source:
    | "PHONE"
    | "WHATSAPP"
    | "WEBSITE"
    | "INSTAGRAM"
    | "WALK_IN"
    | "MARKETPLACE"
    | "ADMIN";
  items: OrderItemInput[];
  shippingCharge?: number;
  discount?: number;
  advance?: number;
  paymentMethod?: string;
  requiredBy?: string;
  notes?: string;
  mediaRequired?: boolean;
  customerPreview?: boolean;
  websiteListing?: boolean;
  instagram?: boolean;
  youtube?: boolean;
};

function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (phone.startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }

  throw new Error("Enter a valid Indian mobile number");
}

function createOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().slice(0, 8).toUpperCase();

  return `SL-${date}-${suffix}`;
}

function decimalToNumber(value: unknown): number {
  return Number(value ?? 0);
}

function dateToString(value: unknown): string | null {
  if (!value) {
    return null;
  }

  return value instanceof Date
    ? value.toISOString()
    : new Date(String(value)).toISOString();
}

function measurementsToObject(
  measurements: MeasurementInput[],
): Record<string, string> {
  return Object.fromEntries(
    measurements.map(({ field, value }) => [field, value]),
  );
}

function snapshotToMeasurements(
  snapshot: unknown,
): MeasurementInput[] {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    return [];
  }

  return Object.entries(snapshot as Record<string, unknown>).map(
    ([field, value]) => ({
      field,
      value: String(value),
    }),
  );
}

const orderIncludes = {
  customer: {
    include: {
      addresses: true,
      measurementProfiles: {
        include: {
          values: true,
        },
      },
    },
  },
  items: true,
  payments: true,
  productionJobs: true,
  shipments: true,
} as const;

const LOW_STOCK_THRESHOLD = 10;

type CreateProductInput = {
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
};

type UpdateProductInput = {
  id: string;
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
};

type RecordPaymentInput = {
  orderId: string;
  method: string;
  amount: number;
  provider?: string;
  transactionReference?: string;
  markPaid?: boolean;
};

type UpdatePaymentStatusInput = {
  paymentId: string;
  status: string;
};

function paidSum(payments: Array<{ amount: unknown; status: string }>): number {
  return payments
    .filter((payment) => payment.status !== "REFUNDED")
    .reduce((sum, payment) => sum + decimalToNumber(payment.amount), 0);
}

export const resolvers = {
  Query: {
    customerByPhone: async (
      _parent: unknown,
      args: { phone: string },
    ) => {
      const phone = normalizeIndianPhone(args.phone);

      return prisma.customer.findUnique({
        where: { phone },
        include: {
          addresses: true,
          measurementProfiles: {
            include: {
              values: true,
            },
          },
          orders: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    },

    customer: async (_parent: unknown, args: { id: string }) => {
      return prisma.customer.findUnique({
        where: {
          id: args.id,
        },
        include: {
          addresses: true,
          measurementProfiles: {
            include: {
              values: true,
            },
          },
          orders: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    },

    customers: async (
      _parent: unknown,
      args: { search?: string },
    ) => {
      return prisma.customer.findMany({
        where: args.search
          ? {
              OR: [
                {
                  name: {
                    contains: args.search,
                    mode: "insensitive",
                  },
                },
                {
                  phone: {
                    contains: args.search,
                  },
                },
              ],
            }
          : undefined,
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      });
    },

    order: async (_parent: unknown, args: { id: string }) => {
      return prisma.order.findUnique({
        where: {
          id: args.id,
        },
        include: orderIncludes,
      });
    },

    orderByNumber: async (
      _parent: unknown,
      args: { orderNumber: string },
    ) => {
      return prisma.order.findUnique({
        where: {
          orderNumber: args.orderNumber,
        },
        include: orderIncludes,
      });
    },

    orders: async (
      _parent: unknown,
      args: {
        status?: string;
        productionStatus?: string;
        paymentStatus?: string;
        limit?: number;
      },
    ) => {
      return prisma.order.findMany({
        where: {
          status: args.status as never,
          productionStatus: args.productionStatus as never,
          paymentStatus: args.paymentStatus as never,
        },
        include: orderIncludes,
        orderBy: {
          createdAt: "desc",
        },
        take: Math.min(args.limit ?? 50, 100),
      });
    },

    products: async (_parent: unknown, args: { search?: string }) => {
      return prisma.product.findMany({
        where: args.search
          ? {
              OR: [
                { name: { contains: args.search, mode: "insensitive" } },
                { sku: { contains: args.search, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
      });
    },

    payments: async (_parent: unknown, args: { status?: string }) => {
      return prisma.payment.findMany({
        where: {
          status: args.status as never,
        },
        include: {
          order: {
            include: orderIncludes,
          },
        },
        orderBy: {
          id: "desc",
        },
      });
    },

    flaggedPayments: async () => getFlaggedPayments(prisma),
  },

  Mutation: {
    createOrder: async (
      _parent: unknown,
      args: { input: CreateOrderInput },
    ) => {
      const input = args.input;

      if (!input.items.length) {
        throw new Error("At least one order item is required");
      }

      const phone = normalizeIndianPhone(input.customer.phone);
      const shippingCharge = input.shippingCharge ?? 0;
      const discount = input.discount ?? 0;
      const advance = input.advance ?? 0;

      const subtotal = input.items.reduce((sum, item) => {
        const itemTotal =
          item.unitPrice +
          (item.stitchingCharge ?? 0) +
          (item.customizationCharge ?? 0);

        return sum + itemTotal * item.quantity;
      }, 0);

      const total = subtotal + shippingCharge - discount;

      if (total < 0) {
        throw new Error("Order total cannot be negative");
      }

      if (advance > total) {
        throw new Error("Advance cannot exceed the order total");
      }

      const paymentStatus =
        advance <= 0
          ? "UNPAID"
          : advance >= total
            ? "PAID"
            : "ADVANCE_PAID";

      return prisma.$transaction(async (tx) => {
        const customer = await tx.customer.upsert({
          where: {
            phone,
          },
          create: {
            name: input.customer.name.trim(),
            phone,
            whatsapp: input.customer.whatsapp
              ? normalizeIndianPhone(input.customer.whatsapp)
              : phone,
            email: input.customer.email || null,
            preferredLanguage:
              input.customer.preferredLanguage || null,
            marketingConsent:
              input.customer.marketingConsent || null,
          },
          update: {
            name: input.customer.name.trim(),
            whatsapp: input.customer.whatsapp
              ? normalizeIndianPhone(input.customer.whatsapp)
              : undefined,
            email: input.customer.email || undefined,
            preferredLanguage:
              input.customer.preferredLanguage || undefined,
            marketingConsent:
              input.customer.marketingConsent || undefined,
          },
        });

        const order = await tx.order.create({
          data: {
            orderNumber: createOrderNumber(),
            customerId: customer.id,
            source: input.source,
            status: "CONFIRMED",
            productionStatus: "NOT_STARTED",
            paymentStatus,
            fulfilmentStatus: "NOT_READY",
            mediaStatus: input.mediaRequired
              ? "PHOTOGRAPHY_PENDING"
              : "NOT_REQUIRED",
            requiredBy: input.requiredBy
              ? new Date(input.requiredBy)
              : null,
            subtotal,
            discount,
            shippingCharge,
            total,
            notes: input.notes || null,
            items: {
              create: input.items.map((item) => ({
                articleType: item.articleType,
                orderType: item.orderType,
                description: item.description,
                color: item.color || null,
                fabric: item.fabric || null,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                stitchingCharge: item.stitchingCharge ?? 0,
                customizationCharge:
                  item.customizationCharge ?? 0,
                measurementSnapshot: measurementsToObject(
                  item.measurements,
                ),
                customizationSnapshot: {
                  customerPreview:
                    input.customerPreview ?? false,
                  websiteListing:
                    input.websiteListing ?? false,
                  instagram: input.instagram ?? false,
                  youtube: input.youtube ?? false,
                },
              })),
            },
          },
          include: {
            items: true,
          },
        });

        for (const item of order.items) {
          if (
            item.orderType === "Custom stitching" ||
            item.orderType === "Alteration"
          ) {
            await tx.productionJob.create({
              data: {
                orderId: order.id,
                orderItemId: item.id,
                status: "NOT_STARTED",
              },
            });
          }
        }

        if (advance > 0) {
          await tx.payment.create({
            data: {
              orderId: order.id,
              method: input.paymentMethod || "UPI / payment link",
              amount: advance,
              status: paymentStatus,
              paidAt:
                paymentStatus === "PAID" ||
                paymentStatus === "ADVANCE_PAID"
                  ? new Date()
                  : null,
            },
          });
        }

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            group: "ORDER",
            fromValue: "DRAFT",
            toValue: "CONFIRMED",
            notes: "Order created through GraphQL",
          },
        });

        return tx.order.findUniqueOrThrow({
          where: {
            id: order.id,
          },
          include: orderIncludes,
        });
      });
    },

    updateOrderStatus: async (
      _parent: unknown,
      args: {
        input: {
          orderId: string;
          status?: string;
          productionStatus?: string;
          paymentStatus?: string;
          fulfilmentStatus?: string;
          mediaStatus?: string;
          notes?: string;
        };
      },
    ) => {
      const input = args.input;

      const current = await prisma.order.findUniqueOrThrow({
        where: {
          id: input.orderId,
        },
      });

      const updated = await prisma.order.update({
        where: {
          id: input.orderId,
        },
        data: {
          status: input.status as never,
          productionStatus: input.productionStatus as never,
          paymentStatus: input.paymentStatus as never,
          fulfilmentStatus: input.fulfilmentStatus as never,
          mediaStatus: input.mediaStatus as never,
        },
        include: orderIncludes,
      });

      const historyEntries = [
        ["ORDER", current.status, input.status],
        [
          "PRODUCTION",
          current.productionStatus,
          input.productionStatus,
        ],
        ["PAYMENT", current.paymentStatus, input.paymentStatus],
        [
          "FULFILMENT",
          current.fulfilmentStatus,
          input.fulfilmentStatus,
        ],
        ["MEDIA", current.mediaStatus, input.mediaStatus],
      ].filter((entry) => entry[2] && entry[1] !== entry[2]);

      if (historyEntries.length) {
        await prisma.orderStatusHistory.createMany({
          data: historyEntries.map(
            ([group, fromValue, toValue]) => ({
              orderId: current.id,
              group: String(group),
              fromValue: String(fromValue),
              toValue: String(toValue),
              notes: input.notes || null,
            }),
          ),
        });
      }

      return updated;
    },

    createProduct: async (
      _parent: unknown,
      args: { input: CreateProductInput },
    ) => {
      const input = args.input;

      return prisma.product.create({
        data: {
          name: input.name.trim(),
          description: input.description || null,
          sku: input.sku.trim(),
          price: input.price,
          quantity: input.quantity ?? 0,
          imageUrl: input.imageUrl || null,
        },
      });
    },

    updateProduct: async (
      _parent: unknown,
      args: { input: UpdateProductInput },
    ) => {
      const input = args.input;

      return prisma.product.update({
        where: { id: input.id },
        data: {
          name: input.name?.trim(),
          description: input.description,
          sku: input.sku?.trim(),
          price: input.price,
          quantity: input.quantity,
          imageUrl: input.imageUrl,
        },
      });
    },

    recordPayment: async (
      _parent: unknown,
      args: { input: RecordPaymentInput },
    ) => {
      const input = args.input;

      const order = await prisma.order.findUniqueOrThrow({
        where: { id: input.orderId },
        include: { payments: true },
      });

      const total = decimalToNumber(order.total);
      const paidSoFar = paidSum(order.payments);
      const paidAfter = paidSoFar + input.amount;
      const isPaid = input.markPaid ?? true;

      return prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            provider: input.provider || null,
            method: input.method,
            amount: input.amount,
            status: isPaid ? "PAID" : "UNPAID",
            transactionReference: input.transactionReference || null,
            paidAt: isPaid ? new Date() : null,
          },
          include: {
            order: {
              include: orderIncludes,
            },
          },
        });

        const nextPaymentStatus = !isPaid
          ? order.paymentStatus
          : paidAfter <= 0
            ? "UNPAID"
            : paidAfter >= total
              ? "PAID"
              : order.paymentStatus === "COD_PENDING"
                ? "COD_PENDING"
                : "PARTIALLY_PAID";

        if (nextPaymentStatus !== order.paymentStatus) {
          await tx.order.update({
            where: { id: order.id },
            data: { paymentStatus: nextPaymentStatus },
          });

          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              group: "PAYMENT",
              fromValue: order.paymentStatus,
              toValue: nextPaymentStatus,
              notes: "Payment recorded",
            },
          });
        }

        return payment;
      });
    },

    updatePaymentStatus: async (
      _parent: unknown,
      args: { input: UpdatePaymentStatusInput },
    ) => {
      const input = args.input;

      const current = await prisma.payment.findUniqueOrThrow({
        where: { id: input.paymentId },
        include: { order: { include: { payments: true } } },
      });

      const updated = await prisma.payment.update({
        where: { id: input.paymentId },
        data: {
          status: input.status as never,
          paidAt:
            input.status === "PAID" || input.status === "ADVANCE_PAID"
              ? (current.paidAt ?? new Date())
              : current.paidAt,
          reconciledAt:
            input.status === "PAID" ? new Date() : current.reconciledAt,
        },
        include: {
          order: {
            include: orderIncludes,
          },
        },
      });

      return updated;
    },
  },

  Customer: {
    createdAt: (customer: { createdAt: Date }) =>
      customer.createdAt.toISOString(),

    updatedAt: (customer: { updatedAt: Date }) =>
      customer.updatedAt.toISOString(),

    orders: async (customer: { id: string; orders?: unknown[] }) => {
      if (customer.orders) {
        return customer.orders;
      }

      return prisma.order.findMany({
        where: {
          customerId: customer.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  },

  MeasurementProfile: {
    createdAt: (profile: { createdAt: Date }) =>
      profile.createdAt.toISOString(),

    approvedAt: (profile: { approvedAt?: Date | null }) =>
      dateToString(profile.approvedAt),
  },

  Order: {
    subtotal: (order: { subtotal: unknown }) =>
      decimalToNumber(order.subtotal),

    discount: (order: { discount: unknown }) =>
      decimalToNumber(order.discount),

    shippingCharge: (order: { shippingCharge: unknown }) =>
      decimalToNumber(order.shippingCharge),

    total: (order: { total: unknown }) =>
      decimalToNumber(order.total),

    balance: (order: {
      total: unknown;
      payments?: Array<{ amount: unknown; status: string }>;
    }) => {
      const paid =
        order.payments
          ?.filter((payment) => payment.status !== "REFUNDED")
          .reduce(
            (sum, payment) =>
              sum + decimalToNumber(payment.amount),
            0,
          ) ?? 0;

      return decimalToNumber(order.total) - paid;
    },

    requiredBy: (order: { requiredBy?: Date | null }) =>
      dateToString(order.requiredBy),

    createdAt: (order: { createdAt: Date }) =>
      order.createdAt.toISOString(),

    updatedAt: (order: { updatedAt: Date }) =>
      order.updatedAt.toISOString(),
  },

  OrderItem: {
    unitPrice: (item: { unitPrice: unknown }) =>
      decimalToNumber(item.unitPrice),

    stitchingCharge: (item: { stitchingCharge: unknown }) =>
      decimalToNumber(item.stitchingCharge),

    customizationCharge: (item: {
      customizationCharge: unknown;
    }) => decimalToNumber(item.customizationCharge),

    measurements: (item: { measurementSnapshot?: unknown }) =>
      snapshotToMeasurements(item.measurementSnapshot),
  },

  Payment: {
    amount: (payment: { amount: unknown }) =>
      decimalToNumber(payment.amount),

    paidAt: (payment: { paidAt?: Date | null }) =>
      dateToString(payment.paidAt),

    reconciledAt: (payment: { reconciledAt?: Date | null }) =>
      dateToString(payment.reconciledAt),

    order: async (payment: { orderId: string; order?: unknown }) => {
      if (payment.order) {
        return payment.order;
      }

      return prisma.order.findUniqueOrThrow({
        where: { id: payment.orderId },
        include: orderIncludes,
      });
    },
  },

  Product: {
    price: (product: { price: unknown }) => decimalToNumber(product.price),

    lowStock: (product: { quantity: number }) =>
      product.quantity <= LOW_STOCK_THRESHOLD,

    createdAt: (product: { createdAt: Date }) =>
      product.createdAt.toISOString(),

    updatedAt: (product: { updatedAt: Date }) =>
      product.updatedAt.toISOString(),
  },

  FlaggedPayment: {
    requiredBy: (flagged: { requiredBy: Date | null }) =>
      dateToString(flagged.requiredBy),

    createdAt: (flagged: { createdAt: Date }) =>
      flagged.createdAt.toISOString(),
  },

  ProductionJob: {
    startedAt: (job: { startedAt?: Date | null }) =>
      dateToString(job.startedAt),

    completedAt: (job: { completedAt?: Date | null }) =>
      dateToString(job.completedAt),
  },

  Shipment: {
    codAmount: (shipment: { codAmount?: unknown }) =>
      shipment.codAmount == null
        ? null
        : decimalToNumber(shipment.codAmount),

    estimatedDelivery: (shipment: {
      estimatedDelivery?: Date | null;
    }) => dateToString(shipment.estimatedDelivery),

    deliveredAt: (shipment: { deliveredAt?: Date | null }) =>
      dateToString(shipment.deliveredAt),
  },
};
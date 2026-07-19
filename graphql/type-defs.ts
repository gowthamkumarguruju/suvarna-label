export const typeDefs = /* GraphQL */ `
  enum OrderSource {
    PHONE
    WHATSAPP
    WEBSITE
    INSTAGRAM
    WALK_IN
    MARKETPLACE
    ADMIN
  }

  enum OrderStatus {
    DRAFT
    AWAITING_CONFIRMATION
    CONFIRMED
    ON_HOLD
    COMPLETED
    CANCELLED
  }

  enum ProductionStatus {
    NOT_STARTED
    CUTTING
    STITCHING
    FINISHING
    QUALITY_CHECK
    READY_FOR_PHOTOGRAPHY
    COMPLETED
  }

  enum PaymentStatus {
    UNPAID
    ADVANCE_PAID
    PARTIALLY_PAID
    PAID
    COD_PENDING
    REFUNDED
  }

  enum FulfilmentStatus {
    NOT_READY
    PACKED
    SHIPPED
    OUT_FOR_DELIVERY
    DELIVERED
    RETURNED
  }

  enum MediaStatus {
    NOT_REQUIRED
    PHOTOGRAPHY_PENDING
    IMAGES_UPLOADED
    AI_PROCESSING
    INTERNAL_REVIEW
    CUSTOMER_APPROVAL
    APPROVED
    PUBLISHED
  }

  type Customer {
    id: ID!
    name: String!
    phone: String!
    whatsapp: String
    email: String
    preferredLanguage: String
    marketingConsent: String
    addresses: [CustomerAddress!]!
    measurementProfiles: [MeasurementProfile!]!
    orders: [Order!]!
    createdAt: String!
    updatedAt: String!
  }

  type CustomerAddress {
    id: ID!
    label: String!
    line1: String!
    line2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  type MeasurementProfile {
    id: ID!
    name: String!
    articleType: String!
    measurementType: String!
    unit: String!
    version: Int!
    approvedAt: String
    values: [MeasurementValue!]!
    createdAt: String!
  }

  type MeasurementValue {
    id: ID
    field: String!
    value: String!
  }

  type Order {
    id: ID!
    orderNumber: String!
    customer: Customer!
    source: OrderSource!
    status: OrderStatus!
    productionStatus: ProductionStatus!
    paymentStatus: PaymentStatus!
    fulfilmentStatus: FulfilmentStatus!
    mediaStatus: MediaStatus!
    requiredBy: String
    subtotal: Float!
    discount: Float!
    shippingCharge: Float!
    total: Float!
    balance: Float!
    notes: String
    items: [OrderItem!]!
    payments: [Payment!]!
    productionJobs: [ProductionJob!]!
    shipments: [Shipment!]!
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    id: ID!
    articleType: String!
    orderType: String!
    description: String!
    color: String
    fabric: String
    quantity: Int!
    unitPrice: Float!
    stitchingCharge: Float!
    customizationCharge: Float!
    measurements: [MeasurementValue!]!
  }

  type Payment {
    id: ID!
    provider: String
    method: String!
    amount: Float!
    status: PaymentStatus!
    transactionReference: String
    paidAt: String
    reconciledAt: String
    order: Order!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    sku: String!
    price: Float!
    quantity: Int!
    lowStock: Boolean!
    imageUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type FlaggedPayment {
    orderId: ID!
    orderNumber: String!
    customerName: String!
    customerPhone: String!
    total: Float!
    balance: Float!
    paymentStatus: PaymentStatus!
    requiredBy: String
    reason: String!
    createdAt: String!
  }

  type ProductionJob {
    id: ID!
    status: ProductionStatus!
    assignedTo: String
    startedAt: String
    completedAt: String
    qcNotes: String
  }

  type Shipment {
    id: ID!
    type: String!
    provider: String
    trackingNumber: String
    deliveryPerson: String
    status: FulfilmentStatus!
    estimatedDelivery: String
    deliveredAt: String
    codAmount: Float
  }

  input CustomerInput {
    name: String!
    phone: String!
    whatsapp: String
    email: String
    preferredLanguage: String
    marketingConsent: String
  }

  input MeasurementInput {
    field: String!
    value: String!
  }

  input OrderItemInput {
    articleType: String!
    orderType: String!
    description: String!
    color: String
    fabric: String
    quantity: Int!
    unitPrice: Float!
    stitchingCharge: Float
    customizationCharge: Float
    measurements: [MeasurementInput!]!
  }

  input CreateOrderInput {
    customer: CustomerInput!
    source: OrderSource!
    items: [OrderItemInput!]!
    shippingCharge: Float
    discount: Float
    advance: Float
    paymentMethod: String
    requiredBy: String
    notes: String
    mediaRequired: Boolean
    customerPreview: Boolean
    websiteListing: Boolean
    instagram: Boolean
    youtube: Boolean
  }

  input UpdateOrderStatusInput {
    orderId: ID!
    status: OrderStatus
    productionStatus: ProductionStatus
    paymentStatus: PaymentStatus
    fulfilmentStatus: FulfilmentStatus
    mediaStatus: MediaStatus
    notes: String
  }

  input CreateProductInput {
    name: String!
    description: String
    sku: String!
    price: Float!
    quantity: Int
    imageUrl: String
  }

  input UpdateProductInput {
    id: ID!
    name: String
    description: String
    sku: String
    price: Float
    quantity: Int
    imageUrl: String
  }

  input RecordPaymentInput {
    orderId: ID!
    method: String!
    amount: Float!
    provider: String
    transactionReference: String
    markPaid: Boolean
  }

  input UpdatePaymentStatusInput {
    paymentId: ID!
    status: PaymentStatus!
  }

  type Query {
    customerByPhone(phone: String!): Customer
    customer(id: ID!): Customer
    customers(search: String): [Customer!]!

    order(id: ID!): Order
    orderByNumber(orderNumber: String!): Order
    orders(
      status: OrderStatus
      productionStatus: ProductionStatus
      paymentStatus: PaymentStatus
      limit: Int
    ): [Order!]!

    products(search: String): [Product!]!

    payments(status: PaymentStatus): [Payment!]!
    flaggedPayments: [FlaggedPayment!]!
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(input: UpdateOrderStatusInput!): Order!

    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!

    recordPayment(input: RecordPaymentInput!): Payment!
    updatePaymentStatus(input: UpdatePaymentStatusInput!): Payment!
  }
`;
export const CUSTOMER_BY_PHONE_QUERY = /* GraphQL */ `
  query CustomerByPhone($phone: String!) {
    customerByPhone(phone: $phone) {
      id
      name
      phone
      whatsapp
      email
      preferredLanguage
      marketingConsent

      addresses {
        id
        label
        line1
        line2
        city
        state
        postalCode
        country
      }

      measurementProfiles {
        id
        name
        articleType
        measurementType
        unit
        version

        values {
          field
          value
        }
      }

      orders {
        id
        orderNumber
        status
        productionStatus
        paymentStatus
        total
        createdAt
      }
    }
  }
`;

export const CREATE_ORDER_MUTATION = /* GraphQL */ `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      status
      productionStatus
      paymentStatus
      fulfilmentStatus
      mediaStatus
      subtotal
      discount
      shippingCharge
      total
      balance
      requiredBy
      createdAt

      customer {
        id
        name
        phone
        whatsapp
      }

      items {
        id
        articleType
        orderType
        description
        color
        fabric
        quantity
        unitPrice
        stitchingCharge
        customizationCharge

        measurements {
          field
          value
        }
      }

      payments {
        id
        method
        amount
        status
        paidAt
      }

      productionJobs {
        id
        status
      }
    }
  }
`;

export const CUSTOMERS_QUERY = /* GraphQL */ `
  query Customers($search: String) {
    customers(search: $search) {
      id
      name
      phone
      whatsapp
      email
      createdAt
      orders {
        id
        orderNumber
        status
        total
        createdAt
      }
    }
  }
`;

export const ORDERS_QUERY = /* GraphQL */ `
  query Orders(
    $status: OrderStatus
    $productionStatus: ProductionStatus
    $paymentStatus: PaymentStatus
    $limit: Int
  ) {
    orders(
      status: $status
      productionStatus: $productionStatus
      paymentStatus: $paymentStatus
      limit: $limit
    ) {
      id
      orderNumber
      source
      status
      productionStatus
      paymentStatus
      fulfilmentStatus
      mediaStatus
      requiredBy
      total
      balance
      createdAt
      customer {
        id
        name
        phone
      }
      items {
        id
        articleType
        description
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = /* GraphQL */ `
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      id
      status
      productionStatus
      paymentStatus
      fulfilmentStatus
      mediaStatus
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($search: String) {
    products(search: $search) {
      id
      name
      description
      sku
      price
      quantity
      lowStock
      imageUrl
      createdAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
      price
      quantity
      lowStock
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = /* GraphQL */ `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      sku
      price
      quantity
      lowStock
    }
  }
`;

export const PAYMENTS_QUERY = /* GraphQL */ `
  query Payments($status: PaymentStatus) {
    payments(status: $status) {
      id
      provider
      method
      amount
      status
      transactionReference
      paidAt
      reconciledAt
      order {
        id
        orderNumber
        total
        balance
        customer {
          id
          name
          phone
        }
      }
    }
  }
`;

export const FLAGGED_PAYMENTS_QUERY = /* GraphQL */ `
  query FlaggedPayments {
    flaggedPayments {
      orderId
      orderNumber
      customerName
      customerPhone
      total
      balance
      paymentStatus
      requiredBy
      reason
      createdAt
    }
  }
`;

export const RECORD_PAYMENT_MUTATION = /* GraphQL */ `
  mutation RecordPayment($input: RecordPaymentInput!) {
    recordPayment(input: $input) {
      id
      status
      amount
      paidAt
      order {
        id
        paymentStatus
        balance
      }
    }
  }
`;

export const UPDATE_PAYMENT_STATUS_MUTATION = /* GraphQL */ `
  mutation UpdatePaymentStatus($input: UpdatePaymentStatusInput!) {
    updatePaymentStatus(input: $input) {
      id
      status
      paidAt
      reconciledAt
    }
  }
`;

export const MEDIA_ORDERS_QUERY = /* GraphQL */ `
  query MediaOrders($status: OrderStatus, $limit: Int) {
    orders(status: $status, limit: $limit) {
      id
      orderNumber
      mediaStatus
      customer {
        name
        phone
      }
      items {
        articleType
        description
        color
      }
      media {
        id
        url
        caption
        approved
        createdAt
      }
    }
  }
`;

export const ADD_ORDER_MEDIA_MUTATION = /* GraphQL */ `
  mutation AddOrderMedia($input: AddOrderMediaInput!) {
    addOrderMedia(input: $input) {
      id
      mediaStatus
      media {
        id
        url
        approved
      }
    }
  }
`;

export const APPROVE_ORDER_MEDIA_MUTATION = /* GraphQL */ `
  mutation ApproveOrderMedia($input: ApproveOrderMediaInput!) {
    approveOrderMedia(input: $input) {
      id
      mediaStatus
      media {
        id
        approved
      }
    }
  }
`;

export const PUBLISH_ORDER_MEDIA_MUTATION = /* GraphQL */ `
  mutation PublishOrderMedia($input: PublishOrderMediaInput!) {
    publishOrderMedia(input: $input) {
      id
      mediaStatus
    }
  }
`;

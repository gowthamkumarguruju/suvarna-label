"use client";

import Link from "next/link";
import { useGraphQL } from "@/lib/use-graphql";
import {
  ORDERS_QUERY,
  PRODUCTS_QUERY,
  FLAGGED_PAYMENTS_QUERY,
} from "@/graphql/operations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type OrderRow = {
  id: string;
  orderNumber: string;
  source: string;
  productionStatus: string;
  paymentStatus: string;
  mediaStatus: string;
  total: number;
  createdAt: string;
  customer: { name: string; phone: string };
};

type ProductRow = {
  id: string;
  lowStock: boolean;
};

type FlaggedPaymentRow = {
  orderId: string;
};

export default function DashboardPage() {
  const orders = useGraphQL<{ orders: OrderRow[] }, Record<string, never>>(
    ORDERS_QUERY,
    {},
  );
  const products = useGraphQL<
    { products: ProductRow[] },
    Record<string, never>
  >(PRODUCTS_QUERY, {});
  const flagged = useGraphQL<
    { flaggedPayments: FlaggedPaymentRow[] },
    Record<string, never>
  >(FLAGGED_PAYMENTS_QUERY, {});

  const orderList = orders.data?.orders ?? [];
  const revenue = orderList.reduce((sum, order) => sum + order.total, 0);
  const lowStockCount =
    products.data?.products.filter((product) => product.lowStock).length ?? 0;
  const flaggedCount = flagged.data?.flaggedPayments.length ?? 0;

  const loading = orders.loading || products.loading || flagged.loading;
  const errorMessage = orders.error || products.error || flagged.error;

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Suvarna Label dashboard</h1>
          <p className="muted">
            Manage orders from the first phone call through delivery and
            payment.
          </p>
        </div>
        <Link href="/admin/orders/new" className="button primary">
          + Create phone order
        </Link>
      </header>

      {errorMessage && <p className="muted">Couldn&apos;t load data: {errorMessage}</p>}

      <section className="stat-grid">
        <article className="stat-card">
          <span>Open orders</span>
          <strong>{loading ? "…" : orderList.length}</strong>
          <small>Across all channels</small>
        </article>
        <article className="stat-card">
          <span>Pipeline value</span>
          <strong>{loading ? "…" : currency.format(revenue)}</strong>
          <small>Current orders</small>
        </article>
        <article className="stat-card warning">
          <span>Low stock</span>
          <strong>{loading ? "…" : lowStockCount}</strong>
          <small>Products need reorder</small>
        </article>
        <article className="stat-card warning">
          <span>Payments needing attention</span>
          <strong>{loading ? "…" : flaggedCount}</strong>
          <small>See payments page</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel span-2">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Live workflow</p>
              <h2>Recent orders</h2>
            </div>
            <Link href="/admin/orders">View all</Link>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Production</th>
                  <th>Payment</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderList.slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                      <br />
                      <span className="muted small">{order.source}</span>
                    </td>
                    <td>
                      {order.customer.name}
                      <br />
                      <span className="muted small">{order.customer.phone}</span>
                    </td>
                    <td>
                      <span className="badge">{order.productionStatus}</span>
                    </td>
                    <td>
                      <span className="badge soft">{order.paymentStatus}</span>
                    </td>
                    <td>{currency.format(order.total)}</td>
                  </tr>
                ))}
                {!loading && orderList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="muted">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Next actions</p>
          <h2>Operations queue</h2>
          <ol className="activity-list">
            <li>
              <span>1</span>
              <div>
                <strong>Review flagged payments</strong>
                <p>{flaggedCount} order(s) need follow-up.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Restock low inventory</strong>
                <p>{lowStockCount} product(s) below reorder level.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Confirm new phone orders</strong>
                <p>Use the guided wizard for phone and WhatsApp orders.</p>
              </div>
            </li>
          </ol>
        </article>
      </section>
    </>
  );
}

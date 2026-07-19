"use client";

import { useState } from "react";
import Link from "next/link";
import { useGraphQL } from "@/lib/use-graphql";
import { ORDERS_QUERY } from "@/graphql/operations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type OrderRow = {
  id: string;
  orderNumber: string;
  source: string;
  status: string;
  productionStatus: string;
  mediaStatus: string;
  total: number;
  customer: { name: string; phone: string };
  items: Array<{ articleType: string; description: string }>;
};

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, loading, error } = useGraphQL<
    { orders: OrderRow[] },
    { status?: string }
  >(
    ORDERS_QUERY,
    { status: statusFilter === "all" ? undefined : statusFilter },
    [statusFilter],
  );

  const orders = data?.orders ?? [];

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Order management</p>
          <h1>Orders</h1>
          <p className="muted">
            Phone, WhatsApp, website, Instagram and walk-in orders in one
            place.
          </p>
        </div>
        <Link href="/admin/orders/new" className="button primary">
          + New order
        </Link>
      </header>

      <section className="panel">
        <div className="filter-row">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="AWAITING_CONFIRMATION">Awaiting confirmation</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ON_HOLD">On hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {error && <p className="muted">Couldn&apos;t load orders: {error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Article</th>
                <th>Order status</th>
                <th>Production</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                  <td>{order.items[0]?.description ?? "—"}</td>
                  <td>
                    <span className="badge soft">{order.status}</span>
                  </td>
                  <td>
                    <span className="badge">{order.productionStatus}</span>
                  </td>
                  <td>{currency.format(order.total)}</td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted">
                    No orders match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

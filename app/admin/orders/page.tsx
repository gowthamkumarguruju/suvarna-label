import Link from "next/link";
import { orders } from "@/lib/mock-data";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function OrdersPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Order management</p>
          <h1>Orders</h1>
          <p className="muted">
            Phone, WhatsApp, website, Instagram and walk-in orders in one place.
          </p>
        </div>
        <Link href="/admin/orders/new" className="button primary">
          + New order
        </Link>
      </header>

      <section className="panel">
        <div className="filter-row">
          <input placeholder="Search order, customer or phone" />
          <select defaultValue="all">
            <option value="all">All sources</option>
            <option>Phone</option>
            <option>Website</option>
            <option>Instagram</option>
          </select>
          <select defaultValue="all">
            <option value="all">All statuses</option>
            <option>Confirmed</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Article</th>
                <th>Order</th>
                <th>Production</th>
                <th>Media</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                    <br />
                    <span className="muted small">{order.source}</span>
                  </td>
                  <td>
                    {order.customer}
                    <br />
                    <span className="muted small">{order.phone}</span>
                  </td>
                  <td>{order.article}</td>
                  <td>
                    <span className="badge soft">{order.orderStatus}</span>
                  </td>
                  <td>
                    <span className="badge">{order.productionStatus}</span>
                  </td>
                  <td>{order.mediaStatus}</td>
                  <td>{currency.format(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { inventory, orders } from "@/lib/mock-data";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function DashboardPage() {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = inventory.filter(
    (item) => item.onHand - item.reserved <= item.reorder,
  );

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Suvarna Label dashboard</h1>
          <p className="muted">
            Manage orders from the first phone call through delivery and product
            promotion.
          </p>
        </div>
        <Link href="/admin/orders/new" className="button primary">
          + Create phone order
        </Link>
      </header>

      <section className="stat-grid">
        <article className="stat-card">
          <span>Open orders</span>
          <strong>{orders.length}</strong>
          <small>Across all channels</small>
        </article>
        <article className="stat-card">
          <span>Pipeline value</span>
          <strong>{currency.format(revenue)}</strong>
          <small>Current sample orders</small>
        </article>
        <article className="stat-card">
          <span>Media tasks</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.mediaStatus !== "Not required" &&
                  order.mediaStatus !== "Published",
              ).length
            }
          </strong>
          <small>Need team action</small>
        </article>
        <article className="stat-card warning">
          <span>Low stock</span>
          <strong>{lowStock.length}</strong>
          <small>Purchase attention</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel span-2">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Live workflow</p>
              <h2>Orders needing attention</h2>
            </div>
            <Link href="/admin/orders">View all</Link>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Article</th>
                  <th>Production</th>
                  <th>Payment</th>
                  <th>Due</th>
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
                      <span className="badge">{order.productionStatus}</span>
                    </td>
                    <td>
                      <span className="badge soft">{order.paymentStatus}</span>
                    </td>
                    <td>{order.dueDate}</td>
                  </tr>
                ))}
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
                <strong>Photograph SL-1025</strong>
                <p>Upload front, back, detail and vertical video.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Buy maroon silk</strong>
                <p>Only 3.5 metres remain available.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Collect COD for SL-1026</strong>
                <p>Reconcile after delivery confirmation.</p>
              </div>
            </li>
          </ol>
        </article>
      </section>
    </>
  );
}

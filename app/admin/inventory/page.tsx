import { inventory } from "@/lib/mock-data";

export default function InventoryPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Raw materials</p>
          <h1>Inventory</h1>
          <p className="muted">
            Track on-hand, reserved, available and reorder quantities.
          </p>
        </div>
        <button className="button primary">+ Record purchase</button>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Unit</th>
                <th>On hand</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Reorder level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const available = item.onHand - item.reserved;
                const low = available <= item.reorder;

                return (
                  <tr key={item.code}>
                    <td>
                      <strong>{item.name}</strong>
                      <br />
                      <span className="muted small">{item.code}</span>
                    </td>
                    <td>{item.unit}</td>
                    <td>{item.onHand}</td>
                    <td>{item.reserved}</td>
                    <td>{available}</td>
                    <td>{item.reorder}</td>
                    <td>
                      <span className={low ? "badge danger" : "badge soft"}>
                        {low ? "Reorder" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="eyebrow">Movement rules</p>
          <h2>Stock integrity</h2>
          <p className="muted">
            Every purchase, reservation, consumption, release, damage and
            correction becomes an immutable inventory movement.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Production</p>
          <h2>Material reservation</h2>
          <p className="muted">
            Confirming a custom order reserves estimated fabric. Cutting records
            actual consumption and releases unused quantity.
          </p>
        </article>
      </section>
    </>
  );
}

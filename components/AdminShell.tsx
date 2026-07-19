import Link from "next/link";

const navigation = [
  ["Dashboard", "/admin"],
  ["Customers", "/admin/customers"],
  ["Orders", "/admin/orders"],
  ["New phone order", "/admin/orders/new"],
  ["Inventory", "/admin/inventory"],
  ["Payments", "/admin/payments"],
  ["Customer shop", "/shop"],
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">SL</div>
        <div>
          <strong>Suvarna Label</strong>
          <p className="muted small">Operations portal</p>
        </div>

        <nav>
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="avatar">GK</span>
          <div>
            <strong>Owner</strong>
            <p className="muted small">Full access</p>
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useGraphQL } from "@/lib/use-graphql";
import { CUSTOMERS_QUERY } from "@/graphql/operations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  createdAt: string;
  orders: Array<{ id: string; orderNumber: string; total: number }>;
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const { data, loading, error } = useGraphQL<
    { customers: CustomerRow[] },
    { search?: string }
  >(CUSTOMERS_QUERY, { search: search || undefined }, [search]);

  const customers = data?.customers ?? [];

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Customer relationships</p>
          <h1>Customers</h1>
          <p className="muted">
            Every customer created through a phone, website or walk-in order.
          </p>
        </div>
      </header>

      <section className="panel">
        <div className="filter-row">
          <input
            placeholder="Search by name or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && <p className="muted">Couldn&apos;t load customers: {error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Lifetime value</th>
                <th>Customer since</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const lifetimeValue = customer.orders.reduce(
                  (sum, order) => sum + order.total,
                  0,
                );

                return (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>
                      {customer.phone}
                      {customer.email && (
                        <>
                          <br />
                          <span className="muted small">{customer.email}</span>
                        </>
                      )}
                    </td>
                    <td>{customer.orders.length}</td>
                    <td>{currency.format(lifetimeValue)}</td>
                    <td>
                      {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                );
              })}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No customers found.
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

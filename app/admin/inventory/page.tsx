"use client";

import { FormEvent, useState } from "react";
import { useGraphQL } from "@/lib/use-graphql";
import { graphqlRequest } from "@/lib/graphql-client";
import { PRODUCTS_QUERY, CREATE_PRODUCT_MUTATION } from "@/graphql/operations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  lowStock: boolean;
};

const emptyForm = { name: "", sku: "", price: "", quantity: "" };

export default function InventoryPage() {
  const { data, loading, error, refetch } = useGraphQL<
    { products: Product[] },
    Record<string, never>
  >(PRODUCTS_QUERY, {});

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const products = data?.products ?? [];

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      await graphqlRequest(CREATE_PRODUCT_MUTATION, {
        input: {
          name: form.name,
          sku: form.sku,
          price: Number(form.price),
          quantity: Number(form.quantity || 0),
        },
      });

      setForm(emptyForm);
      setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Couldn't save the product",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Product inventory</p>
          <h1>Inventory</h1>
          <p className="muted">
            Track stock on hand for every product sold in the shop.
          </p>
        </div>
        <button
          className="button primary"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </header>

      {showForm && (
        <section className="panel">
          <h2>New product</h2>
          <form onSubmit={createProduct} className="form-grid compact">
            <label>
              Name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((f) => ({ ...f, name: event.target.value }))
                }
              />
            </label>
            <label>
              SKU
              <input
                required
                value={form.sku}
                onChange={(event) =>
                  setForm((f) => ({ ...f, sku: event.target.value }))
                }
              />
            </label>
            <label>
              Price
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  setForm((f) => ({ ...f, price: event.target.value }))
                }
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(event) =>
                  setForm((f) => ({ ...f, quantity: event.target.value }))
                }
              />
            </label>
            <div className="full">
              {formError && <p className="muted">{formError}</p>}
              <button type="submit" className="button primary" disabled={saving}>
                {saving ? "Saving…" : "Save product"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        {error && <p className="muted">Couldn&apos;t load inventory: {error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Price</th>
                <th>On hand</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.sku}</td>
                  <td>{currency.format(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span
                      className={product.lowStock ? "badge danger" : "badge soft"}
                    >
                      {product.lowStock ? "Reorder" : "Healthy"}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No products yet — add one to start selling.
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

"use client";

import Link from "next/link";
import { useGraphQL } from "@/lib/use-graphql";
import { PRODUCTS_QUERY } from "@/graphql/operations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function ShopPage() {
  const { data, loading } = useGraphQL<
    { products: Product[] },
    Record<string, never>
  >(PRODUCTS_QUERY, {});

  const products = data?.products ?? [];

  return (
    <main className="storefront">
      <header className="store-header">
        <div>
          <span className="brand-mark">SL</span>
          <strong>Suvarna Label</strong>
        </div>
        <nav>
          <a href="#collection">Collection</a>
          <a href="#custom">Custom stitching</a>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Designed and made with care</p>
        <h1>Clothing that fits your story.</h1>
        <p>
          Ready-made collections and custom stitching with guided
          measurements, transparent status updates and delivery across India.
        </p>
        <div>
          <a href="#collection" className="button primary large">
            Explore collection
          </a>
          <button className="button large">Order on WhatsApp</button>
        </div>
      </section>

      <section id="collection" className="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">New collection</p>
            <h2>Featured articles</h2>
          </div>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <article key={product.id} className="product-card">
              <div className={`product-placeholder product-${(index % 3) + 1}`}>
                Product image
              </div>
              <h3>{product.name}</h3>
              <strong>{currency.format(product.price)}</strong>
              <p className="muted">
                {product.quantity > 0 ? "In stock" : "Made to order"}
              </p>
            </article>
          ))}

          {!loading && products.length === 0 && (
            <p className="muted">New arrivals coming soon.</p>
          )}
        </div>
      </section>
    </main>
  );
}

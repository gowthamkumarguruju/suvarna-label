import Link from "next/link";

const products = [
  {
    name: "Green Festive Anarkali",
    price: "₹4,999",
    note: "Made to order · 10–14 days",
  },
  {
    name: "Embroidered Maroon Blouse",
    price: "₹2,450",
    note: "Custom measurements available",
  },
  {
    name: "Everyday Blue Cotton Kurti",
    price: "₹1,499",
    note: "Ready-made · Limited stock",
  },
];

export default function ShopPage() {
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
          <a href="#track">Track order</a>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Designed and made with care</p>
        <h1>Clothing that fits your story.</h1>
        <p>
          Ready-made collections and custom stitching with guided measurements,
          transparent status updates and delivery across India.
        </p>
        <div>
          <button className="button primary large">Explore collection</button>
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
            <article key={product.name} className="product-card">
              <div className={`product-placeholder product-${index + 1}`}>
                Product image
              </div>
              <h3>{product.name}</h3>
              <strong>{product.price}</strong>
              <p className="muted">{product.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

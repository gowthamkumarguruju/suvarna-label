"use client";

import { FormEvent, useMemo, useState } from "react";

const steps = [
  "Customer",
  "Article",
  "Measurements",
  "Pricing",
  "Media & delivery",
  "Review",
];

const measurementFields: Record<string, string[]> = {
  Blouse: [
    "Bust",
    "Waist",
    "Shoulder",
    "Armhole",
    "Sleeve length",
    "Sleeve round",
    "Blouse length",
    "Front neck depth",
    "Back neck depth",
  ],
  Kurti: [
    "Bust",
    "Waist",
    "Hip",
    "Shoulder",
    "Armhole",
    "Sleeve length",
    "Kurti length",
    "Side slit length",
  ],
  Dress: [
    "Bust",
    "Waist",
    "Hip",
    "Shoulder",
    "Dress length",
    "Sleeve length",
  ],
  Lehenga: [
    "Waist",
    "Hip",
    "Lehenga length",
    "Blouse bust",
    "Blouse waist",
    "Blouse length",
  ],
  Alteration: [
    "Existing garment size",
    "Required adjustment",
    "Target fitting notes",
  ],
};

type Draft = {
  phone: string;
  customerName: string;
  whatsapp: string;
  source: string;
  article: string;
  orderType: string;
  design: string;
  color: string;
  fabric: string;
  quantity: number;
  notes: string;
  measurementUnit: string;
  price: number;
  stitching: number;
  customization: number;
  shipping: number;
  discount: number;
  advance: number;
  paymentMethod: string;
  dueDate: string;
  shippingType: string;
  mediaRequired: boolean;
  customerPreview: boolean;
  marketingConsent: string;
  websiteListing: boolean;
  instagram: boolean;
  youtube: boolean;
};

const initialDraft: Draft = {
  phone: "",
  customerName: "",
  whatsapp: "",
  source: "Phone",
  article: "Blouse",
  orderType: "Custom stitching",
  design: "",
  color: "",
  fabric: "",
  quantity: 1,
  notes: "",
  measurementUnit: "inches",
  price: 0,
  stitching: 0,
  customization: 0,
  shipping: 0,
  discount: 0,
  advance: 0,
  paymentMethod: "UPI / payment link",
  dueDate: "",
  shippingType: "Courier",
  mediaRequired: true,
  customerPreview: true,
  marketingConsent: "Product only",
  websiteListing: true,
  instagram: true,
  youtube: false,
};

export default function NewOrderPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const total = useMemo(
    () =>
      draft.price +
      draft.stitching +
      draft.customization +
      draft.shipping -
      draft.discount,
    [draft],
  );
  const balance = total - draft.advance;

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const updateMoney = (
    key:
      | "price"
      | "stitching"
      | "customization"
      | "shipping"
      | "discount"
      | "advance",
    value: string,
  ) => update(key, Number(value));

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const order = {
      ...draft,
      measurements,
      total,
      balance,
      createdAt: new Date().toISOString(),
      orderNumber: `SL-${Date.now().toString().slice(-6)}`,
    };

    const current = JSON.parse(
      localStorage.getItem("suvarna-orders") || "[]",
    ) as unknown[];

    localStorage.setItem(
      "suvarna-orders",
      JSON.stringify([order, ...current]),
    );
    setSaved(true);
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Guided phone-order agent</p>
          <h1>Create a new order</h1>
          <p className="muted">
            Capture every required detail before confirming production.
          </p>
        </div>
        <span className="badge">Draft</span>
      </header>

      <div className="wizard-layout">
        <aside className="stepper">
          {steps.map((label, index) => (
            <button
              type="button"
              key={label}
              className={
                index === step
                  ? "step active"
                  : index < step
                    ? "step complete"
                    : "step"
              }
              onClick={() => setStep(index)}
            >
              <span>{index < step ? "✓" : index + 1}</span>
              {label}
            </button>
          ))}
        </aside>

        <form className="panel wizard-panel" onSubmit={submit}>
          {step === 0 && (
            <section>
              <p className="eyebrow">Step 1</p>
              <h2>Find or create customer</h2>
              <div className="form-grid">
                <label>
                  Mobile number
                  <input
                    required
                    value={draft.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label>
                  Customer name
                  <input
                    required
                    value={draft.customerName}
                    onChange={(event) =>
                      update("customerName", event.target.value)
                    }
                    placeholder="Customer name"
                  />
                </label>
                <label>
                  WhatsApp number
                  <input
                    value={draft.whatsapp}
                    onChange={(event) => update("whatsapp", event.target.value)}
                    placeholder="Same or alternate number"
                  />
                </label>
                <label>
                  Order source
                  <select
                    value={draft.source}
                    onChange={(event) => update("source", event.target.value)}
                  >
                    <option>Phone</option>
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Website</option>
                    <option>Walk-in</option>
                  </select>
                </label>
              </div>
              <div className="info-box">
                After database integration, mobile search will load saved
                addresses, measurements and previous orders.
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <p className="eyebrow">Step 2</p>
              <h2>Article and design</h2>
              <div className="form-grid">
                <label>
                  Order type
                  <select
                    value={draft.orderType}
                    onChange={(event) =>
                      update("orderType", event.target.value)
                    }
                  >
                    <option>Custom stitching</option>
                    <option>Ready-made</option>
                    <option>Alteration</option>
                    <option>Preorder</option>
                  </select>
                </label>
                <label>
                  Article type
                  <select
                    value={draft.article}
                    onChange={(event) => {
                      update("article", event.target.value);
                      setMeasurements({});
                    }}
                  >
                    <option>Blouse</option>
                    <option>Kurti</option>
                    <option>Dress</option>
                    <option>Lehenga</option>
                    <option>Alteration</option>
                  </select>
                </label>
                <label>
                  Design / product
                  <input
                    value={draft.design}
                    onChange={(event) => update("design", event.target.value)}
                    placeholder="Embroidered bridal blouse"
                  />
                </label>
                <label>
                  Color
                  <input
                    value={draft.color}
                    onChange={(event) => update("color", event.target.value)}
                    placeholder="Maroon"
                  />
                </label>
                <label>
                  Fabric
                  <input
                    value={draft.fabric}
                    onChange={(event) => update("fabric", event.target.value)}
                    placeholder="Silk"
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    min="1"
                    value={draft.quantity}
                    onChange={(event) =>
                      update("quantity", Number(event.target.value))
                    }
                  />
                </label>
                <label className="full">
                  Special instructions
                  <textarea
                    value={draft.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="Neck design, lining, padding, embroidery, occasion..."
                  />
                </label>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Step 3</p>
                  <h2>{draft.article} measurements</h2>
                </div>
                <select
                  className="unit-select"
                  value={draft.measurementUnit}
                  onChange={(event) =>
                    update("measurementUnit", event.target.value)
                  }
                >
                  <option>inches</option>
                  <option>centimetres</option>
                </select>
              </div>

              <div className="measurement-grid">
                {(measurementFields[draft.article] || []).map((field) => (
                  <label key={field}>
                    {field}
                    <input
                      value={measurements[field] || ""}
                      onChange={(event) =>
                        setMeasurements((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      placeholder={
                        field.includes("notes") ||
                        field.includes("adjustment")
                          ? "Enter details"
                          : `0 ${draft.measurementUnit}`
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="info-box">
                Every order stores its own measurement snapshot so future
                customer profile edits cannot alter the original job card.
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <p className="eyebrow">Step 4</p>
              <h2>Pricing and payment</h2>

              <div className="form-grid compact">
                <MoneyInput
                  label="Product / fabric"
                  value={draft.price}
                  onChange={(value) => updateMoney("price", value)}
                />
                <MoneyInput
                  label="Stitching"
                  value={draft.stitching}
                  onChange={(value) => updateMoney("stitching", value)}
                />
                <MoneyInput
                  label="Customization"
                  value={draft.customization}
                  onChange={(value) => updateMoney("customization", value)}
                />
                <MoneyInput
                  label="Shipping"
                  value={draft.shipping}
                  onChange={(value) => updateMoney("shipping", value)}
                />
                <MoneyInput
                  label="Discount"
                  value={draft.discount}
                  onChange={(value) => updateMoney("discount", value)}
                />
                <MoneyInput
                  label="Advance paid"
                  value={draft.advance}
                  onChange={(value) => updateMoney("advance", value)}
                />

                <label>
                  Payment method
                  <select
                    value={draft.paymentMethod}
                    onChange={(event) =>
                      update("paymentMethod", event.target.value)
                    }
                  >
                    <option>UPI / payment link</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank transfer</option>
                    <option>Cash on delivery</option>
                  </select>
                </label>
              </div>

              <div className="price-summary">
                <div>
                  <span>Total</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span>Advance</span>
                  <strong>₹{draft.advance.toLocaleString("en-IN")}</strong>
                </div>
                <div className="balance">
                  <span>Balance due</span>
                  <strong>₹{balance.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <p className="eyebrow">Step 5</p>
              <h2>Delivery, images and promotion</h2>

              <div className="form-grid">
                <label>
                  Required delivery date
                  <input
                    type="date"
                    value={draft.dueDate}
                    onChange={(event) => update("dueDate", event.target.value)}
                  />
                </label>
                <label>
                  Fulfilment
                  <select
                    value={draft.shippingType}
                    onChange={(event) =>
                      update("shippingType", event.target.value)
                    }
                  >
                    <option>Courier</option>
                    <option>Local delivery</option>
                    <option>Customer pickup</option>
                  </select>
                </label>
                <label>
                  Marketing consent
                  <select
                    value={draft.marketingConsent}
                    onChange={(event) =>
                      update("marketingConsent", event.target.value)
                    }
                  >
                    <option>Product only</option>
                    <option>Product and approved model images</option>
                    <option>No marketing use</option>
                  </select>
                </label>
              </div>

              <div className="check-grid">
                <Check
                  label="Photography required"
                  checked={draft.mediaRequired}
                  onChange={(value) => update("mediaRequired", value)}
                />
                <Check
                  label="Send preview to customer"
                  checked={draft.customerPreview}
                  onChange={(value) => update("customerPreview", value)}
                />
                <Check
                  label="Publish on website"
                  checked={draft.websiteListing}
                  onChange={(value) => update("websiteListing", value)}
                />
                <Check
                  label="Prepare Instagram content"
                  checked={draft.instagram}
                  onChange={(value) => update("instagram", value)}
                />
                <Check
                  label="Prepare YouTube content"
                  checked={draft.youtube}
                  onChange={(value) => update("youtube", value)}
                />
              </div>

              <div className="info-box">
                Completion creates photography, AI enhancement, approval and
                publishing tasks. Customer images are usable only according to
                recorded consent.
              </div>
            </section>
          )}

          {step === 5 && (
            <section>
              <p className="eyebrow">Step 6</p>
              <h2>Review before confirmation</h2>

              <div className="review-grid">
                <Review
                  label="Customer"
                  value={draft.customerName || "Not entered"}
                  note={draft.phone}
                />
                <Review
                  label="Article"
                  value={draft.design || draft.article}
                  note={`${draft.orderType} · ${draft.color} ${draft.fabric}`}
                />
                <Review
                  label="Measurements"
                  value={`${Object.keys(measurements).length} captured`}
                  note={draft.measurementUnit}
                />
                <Review
                  label="Delivery"
                  value={draft.dueDate || "Not selected"}
                  note={draft.shippingType}
                />
                <Review
                  label="Payment"
                  value={`₹${balance.toLocaleString("en-IN")} balance`}
                  note={draft.paymentMethod}
                />
                <Review
                  label="Media"
                  value={
                    draft.mediaRequired ? "Workflow required" : "Not required"
                  }
                  note={
                    [
                      draft.websiteListing && "Website",
                      draft.instagram && "Instagram",
                      draft.youtube && "YouTube",
                    ]
                      .filter(Boolean)
                      .join(", ") || "No publishing"
                  }
                />
              </div>

              {saved ? (
                <div className="success-box">
                  <strong>Order saved locally.</strong>
                  <p>
                    The starter uses browser storage until the database/API
                    layer is connected.
                  </p>
                </div>
              ) : (
                <button type="submit" className="button primary large">
                  Confirm and create order
                </button>
              )}
            </section>
          )}

          <footer className="wizard-footer">
            <button
              type="button"
              className="button"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              Back
            </button>

            {step < steps.length - 1 && (
              <button
                type="button"
                className="button primary"
                onClick={() =>
                  setStep((current) => Math.min(steps.length - 1, current + 1))
                }
              >
                Continue
              </button>
            )}
          </footer>
        </form>
      </div>
    </>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <div className="money-input">
        <span>₹</span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="check-card">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function Review({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

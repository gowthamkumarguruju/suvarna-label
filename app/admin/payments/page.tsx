"use client";

import { useState } from "react";
import { useGraphQL } from "@/lib/use-graphql";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  PAYMENTS_QUERY,
  FLAGGED_PAYMENTS_QUERY,
  UPDATE_PAYMENT_STATUS_MUTATION,
  RECORD_PAYMENT_MUTATION,
} from "@/graphql/operations";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type Payment = {
  id: string;
  method: string;
  amount: number;
  status: string;
  paidAt: string | null;
  reconciledAt: string | null;
  order: {
    id: string;
    orderNumber: string;
    balance: number;
    customer: { name: string; phone: string };
  };
};

type FlaggedPayment = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  balance: number;
  reason: string;
};

export default function PaymentsPage() {
  const payments = useGraphQL<{ payments: Payment[] }, Record<string, never>>(
    PAYMENTS_QUERY,
    {},
  );
  const flagged = useGraphQL<
    { flaggedPayments: FlaggedPayment[] },
    Record<string, never>
  >(FLAGGED_PAYMENTS_QUERY, {});

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [recordingOrderId, setRecordingOrderId] = useState<string | null>(
    null,
  );
  const [recordAmount, setRecordAmount] = useState("");
  const [recordSaving, setRecordSaving] = useState(false);

  const markReconciled = async (paymentId: string) => {
    setUpdatingId(paymentId);

    try {
      await graphqlRequest(UPDATE_PAYMENT_STATUS_MUTATION, {
        input: { paymentId, status: "PAID" },
      });
      payments.refetch();
      flagged.refetch();
    } finally {
      setUpdatingId(null);
    }
  };

  const openRecordForm = (orderId: string, suggestedAmount: number) => {
    setRecordingOrderId(orderId);
    setRecordAmount(suggestedAmount.toString());
  };

  const recordPayment = async (orderId: string) => {
    setRecordSaving(true);

    try {
      await graphqlRequest(RECORD_PAYMENT_MUTATION, {
        input: {
          orderId,
          method: "Cash",
          amount: Number(recordAmount),
        },
      });
      setRecordingOrderId(null);
      payments.refetch();
      flagged.refetch();
    } finally {
      setRecordSaving(false);
    }
  };

  const paymentList = payments.data?.payments ?? [];
  const flaggedList = flagged.data?.flaggedPayments ?? [];

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Payment operations</p>
          <h1>Payments</h1>
          <p className="muted">
            Every payment recorded against an order, and which ones need
            follow-up.
          </p>
        </div>
      </header>

      <section className="panel span-2" style={{ marginBottom: 18 }}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Needs attention</p>
            <h2>Flagged payments</h2>
          </div>
        </div>

        {flagged.error && (
          <p className="muted">Couldn&apos;t load flagged payments: {flagged.error}</p>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Balance due</th>
                <th>Reason</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {flaggedList.map((item) => (
                <tr key={item.orderId}>
                  <td>
                    <strong>{item.orderNumber}</strong>
                  </td>
                  <td>
                    {item.customerName}
                    <br />
                    <span className="muted small">{item.customerPhone}</span>
                  </td>
                  <td>{currency.format(item.balance)}</td>
                  <td>
                    <span className="badge danger">{item.reason}</span>
                  </td>
                  <td>
                    {recordingOrderId === item.orderId ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="number"
                          min="0"
                          value={recordAmount}
                          onChange={(event) =>
                            setRecordAmount(event.target.value)
                          }
                          style={{ width: 100 }}
                        />
                        <button
                          className="button primary"
                          disabled={recordSaving}
                          onClick={() => recordPayment(item.orderId)}
                        >
                          {recordSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          className="button"
                          onClick={() => setRecordingOrderId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="button"
                        onClick={() => openRecordForm(item.orderId, item.balance)}
                      >
                        Record payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!flagged.loading && flaggedList.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    Nothing flagged — all payments are on track.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">All payments</p>
            <h2>Payment history</h2>
          </div>
        </div>

        {payments.error && (
          <p className="muted">Couldn&apos;t load payments: {payments.error}</p>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid at</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paymentList.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <strong>{payment.order.orderNumber}</strong>
                  </td>
                  <td>
                    {payment.order.customer.name}
                    <br />
                    <span className="muted small">
                      {payment.order.customer.phone}
                    </span>
                  </td>
                  <td>{payment.method}</td>
                  <td>{currency.format(payment.amount)}</td>
                  <td>
                    <span className="badge soft">{payment.status}</span>
                  </td>
                  <td>
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    {payment.status !== "PAID" && (
                      <button
                        className="button"
                        disabled={updatingId === payment.id}
                        onClick={() => markReconciled(payment.id)}
                      >
                        {updatingId === payment.id ? "Saving…" : "Mark paid"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!payments.loading && paymentList.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted">
                    No payments recorded yet.
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

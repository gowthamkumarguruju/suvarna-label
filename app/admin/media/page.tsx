"use client";

import { useState } from "react";
import { useGraphQL } from "@/lib/use-graphql";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  MEDIA_ORDERS_QUERY,
  ADD_ORDER_MEDIA_MUTATION,
  APPROVE_ORDER_MEDIA_MUTATION,
  PUBLISH_ORDER_MEDIA_MUTATION,
} from "@/graphql/operations";
import { buildInstagramCaption } from "@/lib/social-caption";

type Media = {
  id: string;
  url: string;
  approved: boolean;
};

type MediaOrder = {
  id: string;
  orderNumber: string;
  mediaStatus: string;
  customer: { name: string; phone: string };
  items: Array<{ articleType: string; description: string; color?: string | null }>;
  media: Media[];
};

async function uploadFiles(orderId: string, files: FileList): Promise<string[]> {
  const formData = new FormData();
  formData.append("orderId", orderId);

  for (const file of Array.from(files)) {
    formData.append("files", file);
  }

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Upload failed");
  }

  return result.urls as string[];
}

function PhotographyCard({
  order,
  onDone,
}: {
  order: MediaOrder;
  onDone: () => void;
}) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!files || !files.length) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const urls = await uploadFiles(order.id, files);
      await graphqlRequest(ADD_ORDER_MEDIA_MUTATION, {
        input: { orderId: order.id, urls },
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <article className="panel media-order-card">
      <strong>{order.orderNumber}</strong>
      <p className="muted small">
        {order.customer.name} · {order.items[0]?.description ?? "—"}
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => setFiles(event.target.files)}
        />
        <button
          className="button primary"
          disabled={uploading || !files?.length}
          onClick={submit}
        >
          {uploading ? "Uploading…" : "Upload photos"}
        </button>
      </div>

      {error && <p className="muted small">{error}</p>}
    </article>
  );
}

function ReviewCard({
  order,
  onDone,
}: {
  order: MediaOrder;
  onDone: () => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(
    new Set(order.media.filter((media) => media.approved).map((media) => media.id)),
  );
  const [saving, setSaving] = useState(false);

  const toggle = (mediaId: string) => {
    setChecked((prev) => {
      const next = new Set(prev);

      if (next.has(mediaId)) {
        next.delete(mediaId);
      } else {
        next.add(mediaId);
      }

      return next;
    });
  };

  const allChecked = order.media.length > 0 && checked.size === order.media.length;

  const approve = async () => {
    setSaving(true);

    try {
      await graphqlRequest(APPROVE_ORDER_MEDIA_MUTATION, {
        input: { orderId: order.id, mediaIds: Array.from(checked) },
      });
      onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="panel media-order-card">
      <strong>{order.orderNumber}</strong>
      <p className="muted small">
        {order.customer.name} · {order.items[0]?.description ?? "—"}
      </p>

      <div className="media-grid">
        {order.media.map((media) => (
          <label key={media.id} className="media-thumb">
            <img src={media.url} alt="" />
            <span>
              <input
                type="checkbox"
                checked={checked.has(media.id)}
                onChange={() => toggle(media.id)}
              />
              Verified
            </span>
          </label>
        ))}
      </div>

      <button
        className="button primary"
        disabled={!allChecked || saving}
        onClick={approve}
        style={{ marginTop: 12 }}
      >
        {saving ? "Saving…" : "Approve & continue"}
      </button>
    </article>
  );
}

function ApprovedCard({
  order,
  onDone,
}: {
  order: MediaOrder;
  onDone: () => void;
}) {
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const caption = buildInstagramCaption(order);

  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const publish = async () => {
    const confirmed = window.confirm(
      "Auto-posting to Instagram isn't connected yet — share the images and caption manually, then confirm here to mark this order as published.",
    );

    if (!confirmed) {
      return;
    }

    setPublishing(true);

    try {
      await graphqlRequest(PUBLISH_ORDER_MEDIA_MUTATION, {
        input: { orderId: order.id },
      });
      onDone();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <article className="panel media-order-card showcase-card">
      <strong>{order.orderNumber}</strong>
      <p className="muted small">
        {order.customer.name} · {order.items[0]?.description ?? "—"}
      </p>

      <div className="showcase-hero">
        {order.media[0] && <img src={order.media[0].url} alt="" />}
        <div className="media-grid">
          {order.media.slice(1).map((media) => (
            <div key={media.id} className="media-thumb">
              <img src={media.url} alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="caption-box">
        <textarea readOnly value={caption} rows={5} />
        <button type="button" className="button" onClick={copyCaption}>
          {copied ? "Copied!" : "Copy caption"}
        </button>
      </div>

      <p className="muted small">
        Auto-posting isn&apos;t connected yet — share manually, then confirm below.
      </p>

      <button
        className="button primary"
        disabled={publishing}
        onClick={publish}
      >
        {publishing ? "Publishing…" : "Publish to Instagram"}
      </button>
    </article>
  );
}

export default function MediaPage() {
  const { data, loading, error, refetch } = useGraphQL<
    { orders: MediaOrder[] },
    { status: string; limit: number }
  >(MEDIA_ORDERS_QUERY, { status: "COMPLETED", limit: 100 });

  const orders = data?.orders ?? [];

  const needsPhotography = orders.filter((o) => o.mediaStatus === "PHOTOGRAPHY_PENDING");
  const readyForReview = orders.filter(
    (o) => o.mediaStatus === "IMAGES_UPLOADED" || o.mediaStatus === "INTERNAL_REVIEW",
  );
  const approved = orders.filter((o) => o.mediaStatus === "APPROVED");
  const published = orders.filter((o) => o.mediaStatus === "PUBLISHED").slice(0, 6);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Media & publishing</p>
          <h1>Media pipeline</h1>
          <p className="muted">
            Completed orders move through photography, verification and
            publishing here.
          </p>
        </div>
      </header>

      {error && <p className="muted">Couldn&apos;t load orders: {error}</p>}

      <section style={{ marginBottom: 24 }}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2>Needs photography</h2>
          </div>
        </div>

        {needsPhotography.map((order) => (
          <PhotographyCard key={order.id} order={order} onDone={refetch} />
        ))}
        {!loading && needsPhotography.length === 0 && (
          <p className="muted small">Nothing waiting on photos.</p>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Step 2</p>
            <h2>Ready for review</h2>
          </div>
        </div>

        {readyForReview.map((order) => (
          <ReviewCard key={order.id} order={order} onDone={refetch} />
        ))}
        {!loading && readyForReview.length === 0 && (
          <p className="muted small">Nothing waiting on verification.</p>
        )}
      </section>

      <section style={{ marginBottom: 24 }}>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Step 3</p>
            <h2>Approved — ready to publish</h2>
          </div>
        </div>

        {approved.map((order) => (
          <ApprovedCard key={order.id} order={order} onDone={refetch} />
        ))}
        {!loading && approved.length === 0 && (
          <p className="muted small">Nothing approved and waiting to publish.</p>
        )}
      </section>

      <section>
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Reference</p>
            <h2>Recently published</h2>
          </div>
        </div>

        {published.map((order) => (
          <article key={order.id} className="panel media-order-card">
            <strong>{order.orderNumber}</strong>
            <span className="badge soft" style={{ marginLeft: 8 }}>
              Published
            </span>
          </article>
        ))}
        {!loading && published.length === 0 && (
          <p className="muted small">Nothing published yet.</p>
        )}
      </section>
    </>
  );
}

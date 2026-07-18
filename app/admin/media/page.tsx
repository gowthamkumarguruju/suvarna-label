const mediaQueue = [
  {
    order: "SL-1025",
    product: "Green Anarkali dress",
    stage: "Photography pending",
    owner: "Photo team",
    next: "Upload 4 photos + vertical video",
  },
  {
    order: "CAT-204",
    product: "Maroon bridal blouse",
    stage: "AI review",
    owner: "Content editor",
    next: "Compare product accuracy",
  },
  {
    order: "CAT-198",
    product: "Blue cotton kurti",
    stage: "Customer approval",
    owner: "Customer coordinator",
    next: "Send approved preview",
  },
  {
    order: "CAT-190",
    product: "Festive lehenga",
    stage: "Social draft",
    owner: "Social manager",
    next: "Review caption and schedule",
  },
];

export default function MediaPage() {
  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Product content pipeline</p>
          <h1>Media & publishing</h1>
          <p className="muted">
            Original upload → AI enhancement → review → customer approval →
            publishing.
          </p>
        </div>
        <button className="button primary">+ Upload media</button>
      </header>

      <section className="workflow-strip">
        <div>
          1<strong>Originals</strong>
        </div>
        <span>→</span>
        <div>
          2<strong>AI enhancement</strong>
        </div>
        <span>→</span>
        <div>
          3<strong>Internal review</strong>
        </div>
        <span>→</span>
        <div>
          4<strong>Customer approval</strong>
        </div>
        <span>→</span>
        <div>
          5<strong>Publish</strong>
        </div>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Product</th>
                <th>Stage</th>
                <th>Owner</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              {mediaQueue.map((item) => (
                <tr key={item.order}>
                  <td>
                    <strong>{item.order}</strong>
                  </td>
                  <td>{item.product}</td>
                  <td>
                    <span className="badge">{item.stage}</span>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <p className="eyebrow">AI guardrail</p>
          <h2>Preserve product truth</h2>
          <p className="muted">
            Generated media must not change color, embroidery, neckline,
            sleeves, fabric texture, accessories or garment fit.
          </p>
        </article>
        <article className="panel">
          <p className="eyebrow">Publishing</p>
          <h2>Channel-specific drafts</h2>
          <p className="muted">
            Create website descriptions, Instagram posts and YouTube assets,
            but require human approval before publishing.
          </p>
        </article>
      </section>
    </>
  );
}

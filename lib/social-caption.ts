type CaptionOrder = {
  orderNumber: string;
  items: Array<{ articleType: string; description: string; color?: string | null }>;
};

export function buildInstagramCaption(order: CaptionOrder): string {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Our label";
  const [firstItem] = order.items;

  const itemLine = firstItem
    ? [firstItem.articleType, firstItem.color, "—", firstItem.description]
        .filter(Boolean)
        .join(" ")
    : "New piece";

  const hashtags = [
    "#handcrafted",
    "#madeinindia",
    "#customstitching",
    `#${businessName.replace(/\s+/g, "").toLowerCase()}`,
  ].join(" ");

  return [
    `✨ ${itemLine} ✨`,
    "",
    `Freshly finished at ${businessName}. DM or WhatsApp us to order your own.`,
    "",
    hashtags,
  ].join("\n");
}

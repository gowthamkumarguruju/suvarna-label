import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { getMediaPipelineNudges } from "@/lib/media-pipeline-status";

async function main() {
  const nudges = await getMediaPipelineNudges(prisma);

  if (nudges.length === 0) {
    console.log("No completed orders waiting on the media pipeline.");
    return;
  }

  console.log(`${nudges.length} order(s) waiting on the media pipeline:\n`);

  for (const item of nudges) {
    console.log(`- ${item.orderNumber} — ${item.customerName}`);
    console.log(`  Stage: ${item.mediaStatus}`);
    console.log(`  ${item.reason}\n`);
  }
}

main()
  .catch((error) => {
    console.error("check-media failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

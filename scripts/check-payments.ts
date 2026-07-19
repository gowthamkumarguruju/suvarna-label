import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { getFlaggedPayments } from "@/lib/flagged-payments";

async function main() {
  const flagged = await getFlaggedPayments(prisma);

  if (flagged.length === 0) {
    console.log("No payments need attention.");
    return;
  }

  console.log(`${flagged.length} payment(s) need attention:\n`);

  for (const item of flagged) {
    console.log(
      `- ${item.orderNumber} — ${item.customerName} (${item.customerPhone})`,
    );
    console.log(
      `  Balance due: ₹${item.balance.toFixed(2)} | Status: ${item.paymentStatus}`,
    );
    console.log(`  Reason: ${item.reason}\n`);
  }
}

main()
  .catch((error) => {
    console.error("check-payments failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

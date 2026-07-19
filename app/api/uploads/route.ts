import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const orderId = formData.get("orderId");
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);

  if (typeof orderId !== "string" || !orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400 });
  }

  if (!files.length) {
    return Response.json({ error: "At least one file is required" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return Response.json(
        { error: `${file.name} is larger than 8MB` },
        { status: 400 },
      );
    }
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "orders", orderId);
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const extension = EXTENSION_BY_TYPE[file.type];
    const filename = `${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/orders/${orderId}/${filename}`);
  }

  return Response.json({ urls });
}

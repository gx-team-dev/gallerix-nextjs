// app/api/spaces-upload/route.ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { createReadStream, statSync } from "fs";
import { resolve } from "path";
import mime from "mime";
import path from "path";

export async function POST(req: Request) {
  try {
    const { filePath, key, acl } = await req.json();

    const imgPath = path.join(process.cwd(), '/public', filePath);

    console.log("Data:", { filePath, key, acl });

    if (!filePath || !key) {
      return NextResponse.json(
        { error: "Missing 'filePath' or 'key'." },
        { status: 400 }
      );
    }

    const absPath = resolve(filePath);
    const stats = statSync(absPath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: "Given path is not a file." },
        { status: 400 }
      );
    }

    const stream = createReadStream(absPath);
    const ContentType = mime.getType(key) || "application/octet-stream";

    const Bucket = process.env.DO_SPACES_BUCKET!;
    const command = new PutObjectCommand({
      Bucket,
      Key: key,                 // var filen ska hamna i bucketen
      Body: stream,             // stream från disk
      ContentType,
      ACL: acl ?? "private",    // "public-read" om du vill exponera filen publikt
    });

    await s3.send(command);

    // Om du använder "public-read" och din Space är CDN/website-enabled:
    const publicUrl =
      acl === "public-read"
        ? `${process.env.DO_SPACES_ENDPOINT!.replace("https://", `https://${Bucket}.`)}/${key}`
        : null;

    return NextResponse.json({
      ok: true,
      bucket: Bucket,
      key,
      size: stats.size,
      contentType: ContentType,
      url: publicUrl,
    });
  } catch (err: any) {
    console.error("Spaces upload error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
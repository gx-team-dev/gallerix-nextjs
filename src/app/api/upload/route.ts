// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "node:stream";

export const runtime = "nodejs"; // krävs för AWS SDK/streams
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as unknown as File | null;

    if (!file) {
      return NextResponse.json({ error: "Ingen fil hittades i form-data (field: file)" }, { status: 400 });
    }

    // Metadata
    const contentType = file.type || "application/octet-stream";
    const fileSize = typeof file.size === "number" ? file.size : undefined;
    const originalName = (file as any).name || "upload.bin";

    // Skapa nyckel (mapp/UUID/filnamn)
    const datePrefix = new Date().toISOString().slice(0, 10);
    const safeName = String(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${datePrefix}/${randomUUID()}-${safeName}`;
    // const key = `${randomUUID()}-${safeName}`;

     // Gräns: använd enkel PUT för mindre filer, multipart för större
    const MULTIPART_THRESHOLD = 1 * 1024 * 1024; // 8 MB (min 5 MB per del för S3)

    if(fileSize && fileSize <= MULTIPART_THRESHOLD) {
      // Konvertera web ReadableStream -> Node Readable (Node 18+)
      const bodyStream = Readable.fromWeb(file.stream() as any);

      // Ladda upp till Backblaze B2 (S3 API)
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.BACKBLAZE_S3_BUCKET!,
          Key: key,
          Body: bodyStream,
          ContentType: contentType,
          ContentLength: fileSize, // ← fixar "x-amz-decoded-content-length: undefined"
        })
      );
  } else {
    // Multipart-upload (kräver inte total Content-Length)
      const uploader = new Upload({
        client: s3,
        params: {
          Bucket: process.env.BACKBLAZE_S3_BUCKET!,
          Key: key,
          Body: Readable.fromWeb(file.stream() as any),
          ContentType: contentType,
        },
        queueSize: 3,
        partSize: 8 * 1024 * 1024, // ≥ 5 MB
        leavePartsOnError: false,
      });
      await uploader.done();
  }

    const publicBase = process.env.BACKBLAZE_PUBLIC_URL_BASE?.replace(/\/+$/, "");
    const publicUrl = publicBase ? `${publicBase}/${key}` : null;

    return NextResponse.json({
      ok: true,
      key,
      contentType,
      bytes: file.size,
      publicUrl, // null om bucketen är privat
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Uppladdningen misslyckades", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

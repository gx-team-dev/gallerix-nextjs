import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from "crypto"

const {
  DO_SPACES_KEY,
  DO_SPACES_SECRET,
  DO_SPACES_ENDPOINT,
  DO_SPACES_REGION = "us-east-1",
  DO_SPACES_BUCKET,
} = process.env

if (!DO_SPACES_KEY || !DO_SPACES_SECRET || !DO_SPACES_ENDPOINT || !DO_SPACES_BUCKET) {
  console.warn("Missing DO Spaces env vars")
}

const s3 = new S3Client({
  region: DO_SPACES_REGION,                  // DO Spaces accepterar valfritt värde, använd din region
  endpoint: DO_SPACES_ENDPOINT,              // t.ex. https://nyc3.digitaloceanspaces.com
  forcePathStyle: false,                     // använd virtual-hosted-style (bucket.region.digitaloceanspaces.com)
  credentials: {
    accessKeyId: DO_SPACES_KEY!,
    secretAccessKey: DO_SPACES_SECRET!,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json()
    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename och contentType krävs" }, { status: 400 })
    }

    // Skapa en unik nyckel i en år/månad-mapp
    const now = new Date()
    const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}-${filename}`

    const command = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET!,
      Key: key,
      ContentType: contentType,
      ACL: "public-read", // ta bort/ändra om du vill ha privata objekt
    })

    // Presignad PUT-URL (giltig i 60s)
    const url = await getSignedUrl(s3, command, { expiresIn: 60 })

    // Publik URL för visning efter uppladdning
    const publicUrl = `https://${DO_SPACES_BUCKET}.${process.env.NEXT_PUBLIC_DO_SPACES_REGION}.digitaloceanspaces.com/${encodeURI(key)}`

    return NextResponse.json({
      method: "PUT",
      url,
      headers: {
        "Content-Type": contentType,
        "x-amz-acl": "public-read",
      },
      key,
      publicUrl,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: "Kunde inte generera presigned URL." }, { status: 500 })
  }
}

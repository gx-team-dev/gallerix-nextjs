// lib/s3.ts
import { S3Client } from "@aws-sdk/client-s3";

const required = (name: string, v?: string) => {
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
};

export const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION!,
  endpoint: process.env.DO_SPACES_ENDPOINT!, // DO Spaces kräver custom endpoint
  forcePathStyle: false, // DO Spaces funkar bäst utan path-style
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});
// lib/s3.ts
import { S3Client } from "@aws-sdk/client-s3";

const required = (name: string, v?: string) => {
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
};

export const s3 = new S3Client({
  region: required("BACKBLAZE_S3_REGION", process.env.BACKBLAZE_S3_REGION),
  endpoint: required("BACKBLAZE_S3_ENDPOINT", process.env.BACKBLAZE_S3_ENDPOINT),
  credentials: {
    accessKeyId: required("BACKBLAZE_S3_KEY_ID", process.env.BACKBLAZE_S3_KEY_ID),
    secretAccessKey: required("BACKBLAZE_S3_APP_KEY", process.env.BACKBLAZE_S3_APP_KEY),
  },
  // forcePathStyle: true, // slå på om din miljö kräver path-style
});
import path from "node:path";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createReadStream } from "node:fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const CLOUDFLARE_ACCOUNT_ID = process.env["CLOUDFLARE_ACCOUNT_ID"];
const CLOUDFLARE_ACCESS_KEY_ID = process.env["CLOUDFLARE_ACCESS_KEY_ID"];
const CLOUDFLARE_ACCESS_KEY_SECRET =
  process.env["CLOUDFLARE_ACCESS_KEY_SECRET"];
const R2_S3_IMAGE_BUCKET = process.env["R2_S3_IMAGE_BUCKET"];
const R2_TEMP_BUCKET = process.env["R2_TEMP_BUCKET"];
const R2_PUBLIC_URL = process.env["R2_PUBLIC_URL"];

if (!R2_S3_IMAGE_BUCKET) console.log("image storage bucket is required!");

const config: S3ClientConfig = {
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
};

if (CLOUDFLARE_ACCESS_KEY_ID && CLOUDFLARE_ACCESS_KEY_SECRET)
  config.credentials = {
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_ACCESS_KEY_SECRET,
  };

const s3 = new S3Client(config);

export const uploadFile = async (filepath: string): Promise<string> => {
  const objectKey = path.basename(filepath);
  const readStream = createReadStream(filepath);

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_S3_IMAGE_BUCKET,
      Key: objectKey,
      Body: readStream,
      ContentType: "image/jpeg",
    }),
  );

  //   ("https://<bucket>.s3.<region>.amazonaws.com/<key>");
  return `${R2_PUBLIC_URL}/${encodeURIComponent(objectKey)}`;
};

export const deleteFile = async (s3ObjectUrl: string) => {
  //"https://<bucket>.s3.<region>.amazonaws.com/<key>"
  const url = new URL(s3ObjectUrl);
  const objectKey = url.pathname.slice(1);

  await s3.send(
    new DeleteObjectCommand({ Bucket: R2_S3_IMAGE_BUCKET, Key: objectKey }),
  );
};

export const uploadFilePresignedUrl = async (
  objectKey: string,
  contentType: string,
  contentLength: number,
) => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: R2_TEMP_BUCKET,
    Key: objectKey,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  return await getSignedUrl(s3, putObjectCommand, { expiresIn: 60 });
};

export const getFilePresignedUrl = async (objectKey: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: R2_TEMP_BUCKET,
    Key: objectKey,
  });

  return await getSignedUrl(s3, getObjectCommand, { expiresIn: 5 * 60 });
};

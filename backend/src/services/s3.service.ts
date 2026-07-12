import path from "node:path";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { createReadStream } from "node:fs";

const AWS_ACCESS_KEY_ID = process.env["AWS_ACCESS_KEY_ID"];
const AWS_ACCESS_KEY_SECRET = process.env["AWS_ACCESS_KEY_SECRET"];
const AWS_S3_IMAGE_BUCKET = process.env["AWS_S3_IMAGE_BUCKET"];
const AWS_S3_REGION = process.env["AWS_S3_REGION"];

if (!AWS_S3_IMAGE_BUCKET || !AWS_S3_REGION)
  throw new Error("image storage bucket and s3 region both are required!");

const config: S3ClientConfig = {};
if (AWS_ACCESS_KEY_ID && AWS_ACCESS_KEY_SECRET)
  config.credentials = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY_SECRET,
  };

const s3 = new S3Client(config);

export const uploadFile = async (filepath: string): Promise<string> => {
  const objectKey = path.basename(filepath);
  const readStream = createReadStream(filepath);

  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_S3_IMAGE_BUCKET,
      Key: objectKey,
      Body: readStream,
    }),
  );

  //   ("https://<bucket>.s3.<region>.amazonaws.com/<key>");
  const s3ObjectUrl = `https://${AWS_S3_IMAGE_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${encodeURIComponent(objectKey)}`;
  return s3ObjectUrl;
};

export const deleteFile = async (s3ObjectUrl: string) => {
  //"https://<bucket>.s3.<region>.amazonaws.com/<key>"
  const url = new URL(s3ObjectUrl);
  const objectKey = url.pathname;

  await s3.send(
    new DeleteObjectCommand({ Bucket: AWS_S3_IMAGE_BUCKET, Key: objectKey }),
  );
};

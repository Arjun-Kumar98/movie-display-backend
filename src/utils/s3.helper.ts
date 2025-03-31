import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const key = `movies/${uuidv4()}-${fileName}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const result = await s3.upload(params).promise();
  return result.Location; // Return the S3 file URL
}

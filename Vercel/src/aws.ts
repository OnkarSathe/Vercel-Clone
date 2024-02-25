import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "e7b1e79a805dcf40fa60d248b110d41a",
  secretAccessKey:
    "4b52f24d82be8aeb98c1ab12efd31b365fa75eb92ac0c0f7b41247b7fd54d733",
  endpoint: "https://fb52725bda914243c13d565f60da7a4b.r2.cloudflarestorage.com",
});

export const uploadFile = async(fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3.upload({
    Body : fileContent,   
    Bucket : "vercel",
    Key: fileName.replace(/\\/g, '/'),
  }).promise();
  console.log(response);
};

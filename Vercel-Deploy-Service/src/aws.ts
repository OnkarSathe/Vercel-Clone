import { S3 } from "aws-sdk";
//@ts-ignore
import path from "path";
//@ts-ignore
import fs from "fs";

const s3 = new S3({
  accessKeyId: "e7b1e79a805dcf40fa60d248b110d41a",
  secretAccessKey:
    "4b52f24d82be8aeb98c1ab12efd31b365fa75eb92ac0c0f7b41247b7fd54d733",
  endpoint: "https://fb52725bda914243c13d565f60da7a4b.r2.cloudflarestorage.com",
});

export async function downloadS3Folder(prefix: any) {
  const allFiles = await s3
    .listObjectsV2({
      Bucket: "vercel",
      Prefix: prefix,
    })
    .promise();
  console.log(allFiles);

  const allPromise =
    allFiles.Contents?.map(async ({ Key }) => {
      return new Promise(async (resolve) => {
        if (!Key) {
          resolve("");
          return;
        }
        //@ts-ignore
        const finalOutputPath = path.join(__dirname, Key);
        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }
        const outputFile = fs.createWriteStream(finalOutputPath);
        s3.getObject({
          Bucket: "vercel",
          Key: Key || "",
        })
          .createReadStream()
          .pipe(outputFile)
          .on("finish", () => {
            resolve("");
          });
      });
    }) || [];
  console.log("awating");
  await Promise.all(allPromise?.filter((x) => x !== undefined));
}

export function copyFinalDist(id: any) {
  //@ts-ignore
  const folderPath = path.join(__dirname, `output/${id}/dist`);
  const allFiles = getAllFiles(folderPath);
  allFiles.forEach((file) => {
    //@ts-ignore
    uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
  });
} 

const getAllFiles = (folderPath: any) => {
  let response: string[] = [];

  const fileList = fs.readdirSync(folderPath);
  for (const file of fileList) {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  }
  return response;
};

const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName.replace(/\\/g, "/"),
    })
    .promise();
  console.log(response);
};

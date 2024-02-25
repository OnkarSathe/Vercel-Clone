import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId: "e7b1e79a805dcf40fa60d248b110d41a",
    secretAccessKey:
      "4b52f24d82be8aeb98c1ab12efd31b365fa75eb92ac0c0f7b41247b7fd54d733",
    endpoint: "https://fb52725bda914243c13d565f60da7a4b.r2.cloudflarestorage.com",
  });

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    console.log(id , filePath)
    const contents = await s3.getObject({
        Bucket:"vercel",
        Key : `dist/${id}${filePath}`
    }).promise();

    const type = filePath.endsWith("html")?"text/html":filePath.endsWith("css") ? "text/css":"application/javascript"
    res.set("Content-Type" , type);
    res.send(contents.Body);
});

app.listen(3001, () => {
  console.log("Vercel-Request-Handler Server Started");
});

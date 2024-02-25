//id - e7b1e79a805dcf40fa60d248b110d41a
//secret key - 4b52f24d82be8aeb98c1ab12efd31b365fa75eb92ac0c0f7b41247b7fd54d733
//endpoint - https://fb52725bda914243c13d565f60da7a4b.r2.cloudflarestorage.com

import express from "express";
import cors from "cors";
import simpleGit, { SimpleGit } from "simple-git";
import path from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { RedisClientOptions, createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

const git: SimpleGit = simpleGit();

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  const repoPath = path.join(__dirname, `output/${id}`);

  try {
    await git.clone(repoUrl, repoPath);
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    files.forEach(async (file) => {
      await uploadFile(file.slice(__dirname.length + 1), file);
    });

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.status(200).json({
      id: id,
    });
  } catch (error) {
    console.error("Error during clone:", error);
    res.status(500).json({ messageText: "Clone failed", error: error });
  }
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000, () => {
  console.log("Server Started");
});

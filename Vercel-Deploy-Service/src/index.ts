import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./util";
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
  while (true) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
    //@ts-ignore
    const id = response.element;
    await downloadS3Folder(`output/${id}`);
    console.log("downloadComplete")
    await buildProject(id); 
    console.log("buildComplete")
    await copyFinalDist(id);
    console.log("copyComplete")
    publisher.hSet("status" , id , "deployed")
  }
}

main();

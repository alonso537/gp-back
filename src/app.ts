import { envs } from "./config/envs";
import { MongoDatabase } from "./data/mongo/mongo-database";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  await main();
})();

async function main() {
  const mongo = new MongoDatabase({
    mongo_uri: envs.MONGO_URI,
  });

  await mongo.connect();

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}

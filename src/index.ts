import createDebug from "debug";
import "./loadEnvironment.js";
import startServer from "./server/startServer.js";

const port = process.env.PORT ?? 4000;

const debug = createDebug("social:root");

try {
  await startServer(+port);
  debug(`Server listening on port ${port}`);
} catch (error: unknown) {
  debug((error as Error).message);
}

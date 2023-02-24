import "./loadEnvironment.js";
import createDebug from "debug";
import connectDatabase from "./database/connectDatabase.js";
import startServer from "./server/startServer.js";

const port: string | number = process.env.PORT ?? 4000;
const mongoUrl: string = process.env.MONGODB_CONNECTION_URL!;

const debug = createDebug("social:root");

try {
  await startServer(+port);
  debug(`Server listening on port ${port}`);

  await connectDatabase(mongoUrl);
  debug(`Connected to database ${mongoUrl}`);
} catch (error: unknown) {
  debug((error as Error).message);
}

import { configDotenv } from "dotenv";

configDotenv();

if (!process.env.PORT) {
    throw new Error("PORT is not set in the environment variables");
}

export default configDotenv;

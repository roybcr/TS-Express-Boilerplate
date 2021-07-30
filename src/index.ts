import connectRedis from "connect-redis";
import Redis from "ioredis";
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const bootstrap = async () => {
  const PORT = process.env.PORT;
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.ORIGIN_PROD_URL
          : process.env.ORIGIN_DEV_URL,
    }),
  );
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({ client: redis as any, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      secret: process.env.COOKIE_SECRET as string,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.get("/", (_req, res) => {
    res.send("Server is up on port" + PORT);
  });

  app.listen(PORT, () => {
    console.log("Server is up on port", PORT);
  });
};

bootstrap();

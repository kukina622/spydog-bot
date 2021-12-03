import { createConnection } from "typeorm";

interface DBConfig {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

export async function connectDB(DBConfig: DBConfig) {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_NAME
  } = DBConfig;
  return createConnection({
    type: "mariadb",
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [__dirname + "/*.ts", __dirname + "/*.js"],
    synchronize: true
  });
}

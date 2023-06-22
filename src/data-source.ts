import "dotenv/config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "oracle",
  host: "localhost",
  port: 1521,
  sid: "XE",
  //driver: "Oracle",
  username: "C##NODE",
  password: "node",
  database: "",
  //serviceName: "example",
  logging: false,
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],

});
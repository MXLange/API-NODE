import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import "reflect-metadata";
import { rotas } from "./shared/routes";
import { errorMiddleware } from "./shared/errors/errorMiddleware";
const app = express();

app.use(express.json());
app.use(rotas);
app.use(errorMiddleware);

export { app }
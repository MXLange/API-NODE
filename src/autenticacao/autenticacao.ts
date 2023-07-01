import { NextFunction, Request, Response } from "express";
import { validarToken } from "../pessoa/controller/controllerPessoa";
import AppError from "../shared/errors/AppErrors";


export async function autenticar(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (token === undefined) {
    throw new AppError("Token inválido");
  }

  const estaValido = await validarToken(token!);

  if (!estaValido) {
    throw new AppError("Token inválido");
  }

  next()
}
import { Request, Response, Router } from "express";

const rotaDeMunicipio = Router();

rotaDeMunicipio.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ mensagem: "municipio" });
});

export { rotaDeMunicipio };
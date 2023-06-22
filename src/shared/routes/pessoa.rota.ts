import { Request, Response, Router } from "express";

const rotaDePessoa = Router();

rotaDePessoa.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ mensagem: "Pessoa" });
});

export { rotaDePessoa };
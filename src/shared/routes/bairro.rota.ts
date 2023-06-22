import { Request, Response, Router } from "express";

const rotaDeBairro = Router();

rotaDeBairro.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ mensagem: "Bairro" });
});

export { rotaDeBairro };
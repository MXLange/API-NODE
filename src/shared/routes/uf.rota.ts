import { Router } from "express";
import { ControllerUf } from "../../uf/controller/controllerUf";

const rotaDeUf = Router();
const controllerUf = new ControllerUf();


rotaDeUf.get("/", controllerUf.buscar)
rotaDeUf.post("/", controllerUf.cadastrar);
rotaDeUf.put("/", controllerUf.atualizar);

export { rotaDeUf };
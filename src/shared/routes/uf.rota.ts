import { Router } from "express";
import { ControllerUf } from "../../uf/controller/controllerUf";
import { autenticar } from "../../autenticacao/autenticacao";

const rotaDeUf = Router();
const controllerUf = new ControllerUf();


rotaDeUf.get("/", controllerUf.buscar)
rotaDeUf.post("/", controllerUf.cadastrar);
rotaDeUf.put("/", controllerUf.atualizar);
rotaDeUf.delete("/:codigoUF", controllerUf.deletar);
//rotaDeUf.delete("/:codigoUF", autenticar, controllerUf.deletar);

export { rotaDeUf };
import { Router } from "express";
import { ControllerPessoa } from "../../pessoa/controller/controllerPessoa";

const rotaDePessoa = Router();
const controllerPessoa = new ControllerPessoa();

rotaDePessoa.post("/", controllerPessoa.cadastrar);
rotaDePessoa.get("/", controllerPessoa.buscar);
rotaDePessoa.put("/", controllerPessoa.atualizar);

export { rotaDePessoa };
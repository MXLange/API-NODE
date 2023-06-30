import { Router } from "express";
import { ControllerBairro } from "../../bairro/controller/controllerBairro";
import { autenticar } from "../../autenticacao/autenticacao";

const rotaDeBairro = Router();
const controllerBairro = new ControllerBairro();

rotaDeBairro.post("/", controllerBairro.cadastrar);
rotaDeBairro.get("/", controllerBairro.buscar);
rotaDeBairro.put("/", controllerBairro.atualizar);
rotaDeBairro.delete("/:codigoBairro", controllerBairro.deletar);
// rotaDeBairro.delete("/:codigoBairro", autenticar, controllerBairro.deletar);

export { rotaDeBairro };
import { Router } from "express";
import { ControllerBairro } from "../../bairro/controller/controllerBairro";

const rotaDeBairro = Router();
const controllerBairro = new ControllerBairro();

rotaDeBairro.post("/", controllerBairro.cadastrar);
rotaDeBairro.get("/", controllerBairro.buscar);
rotaDeBairro.put("/", controllerBairro.atualizar);

export { rotaDeBairro };
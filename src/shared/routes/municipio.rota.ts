import { Router } from "express";
import { ControllerMunicipio } from "../../municipio/controller/controllerMunicipio";
import { autenticar } from "../../autenticacao/autenticacao";

const rotaDeMunicipio = Router();
const controllerMunicipio = new ControllerMunicipio();

rotaDeMunicipio.post("/", controllerMunicipio.cadastrar);
rotaDeMunicipio.get("/", controllerMunicipio.buscar);
rotaDeMunicipio.put("/", controllerMunicipio.atualizar);
rotaDeMunicipio.delete("/:codigoMunicipio", controllerMunicipio.deletar);
// rotaDeMunicipio.delete("/:codigoMunicipio", autenticar ,controllerMunicipio.deletar);

export { rotaDeMunicipio };
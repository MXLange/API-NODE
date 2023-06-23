import { Router } from "express";
import { ControllerMunicipio } from "../../municipio/controller/controllermunicipio";

const rotaDeMunicipio = Router();
const controllerMunicipio = new ControllerMunicipio();

rotaDeMunicipio.post("/", controllerMunicipio.cadastrar);
rotaDeMunicipio.get("/", controllerMunicipio.buscar);
rotaDeMunicipio.put("/", controllerMunicipio.atualizar);

export { rotaDeMunicipio };
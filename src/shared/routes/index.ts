import { Router } from "express";
import { rotaDeMunicipio } from "./municipio.rota";
import { rotaDeUf } from "./uf.rota";
import { rotaDeBairro } from "./bairro.rota";
import { rotaDePessoa } from "./pessoa.rota";

const rotas = Router()

rotas.use("/uf", rotaDeUf);
rotas.use("/municipio", rotaDeMunicipio);
rotas.use("/bairro", rotaDeBairro);
rotas.use("/pessoa", rotaDePessoa)

export { rotas };
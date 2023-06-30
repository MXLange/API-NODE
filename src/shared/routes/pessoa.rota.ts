import { Router } from "express";
import { ControllerPessoa } from "../../pessoa/controller/controllerPessoa";
import { autenticar } from "../../autenticacao/autenticacao";

const rotaDePessoa = Router();
const controllerPessoa = new ControllerPessoa();

rotaDePessoa.post("/", controllerPessoa.cadastrar);
rotaDePessoa.get("/", controllerPessoa.buscar);
rotaDePessoa.put("/", controllerPessoa.atualizar);
rotaDePessoa.delete("/:codigoPessoa", controllerPessoa.deletar);
//rotaDePessoa.delete("/:codigoPessoa", autenticar, controllerPessoa.deletar);

rotaDePessoa.post("/login", controllerPessoa.login);

export { rotaDePessoa };
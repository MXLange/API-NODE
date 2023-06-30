import { Request, Response } from "express";
import { PessoaDAO } from "../DAO/pessoaDAO";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarPessoa, ICadastrarPessoa } from "../interfaces/interfacesPessoa";



export class ControllerPessoa {

  async cadastrar(req: Request, res: Response) {
    const { nome, sobrenome, idade, login, senha, status, enderecos } = req.body

    verificarParametrosPostPessoa({ nome, sobrenome, idade, login, senha, status, enderecos })

    const pessoaDAO = new PessoaDAO()
    const resposta = await pessoaDAO.criar({ nome, sobrenome, idade, login, senha, status, enderecos })

    return res.status(200).json(resposta)
  }

  async buscar(req: Request, res: Response) {
    const { codigoPessoa, login, status } = req.query;

    let pesquisar: any = {
      codigoPessoa: (codigoPessoa !== undefined ? Number(codigoPessoa) : "excluir"),
      login: (login !== undefined ? login : "excluir"),
      status: (status !== undefined ? Number(status) : "excluir")
    }

    if (pesquisar.codigoPessoa === "excluir") delete pesquisar.codigoPessoa
    if (pesquisar.login === "excluir") delete pesquisar.login
    if (pesquisar.status === "excluir") delete pesquisar.status

    const pessoaDAO = new PessoaDAO();
    const resposta: Array<any> = await pessoaDAO.pesquisa(pesquisar)

    return res.status(200).json(resposta)
  }

  async atualizar(req: Request, res: Response) {
    const { codigoPessoa, nome, sobrenome, idade, login, senha, status, enderecos } = req.body

    verificarParametrosPutPessoa({ codigoPessoa, nome, sobrenome, idade, login, senha, status, enderecos })

    const pessoaDAO = new PessoaDAO()
    const resposta = await pessoaDAO.alterar({ codigoPessoa, nome, sobrenome, idade, login, senha, status, enderecos })
    return res.status(200).json(resposta)
  }
}

function verificarParametrosPutPessoa({ codigoPessoa, nome, sobrenome, idade, login, senha, status, enderecos }: IAlterarPessoa) {
  if (!codigoPessoa) throw new AppError("Por favor insira um código de pessoa válido.")
  if (!nome) throw new AppError("Por favor insira um nome válido.")
  if (!sobrenome) throw new AppError("Por favor insira um sobrenome válido.")
  if (!idade) throw new AppError("Por favor insira uma idade válida.")
  if (!login) throw new AppError("Por favor insira um login válido.")
  if (!senha) throw new AppError("Por favor insira uma senha válida.")
  if (!status) throw new AppError("Por favor insira um status válido.")
  if (!enderecos || enderecos.length === 0) throw new AppError("Por favor insira pelo menos um endereço válido.")

  if (typeof codigoPessoa !== "number") throw new AppError("O campo codigoPessoa deve ser do tipo numérico.", 403)
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo string.", 403)
  if (typeof sobrenome !== "string") throw new AppError("O campo sobrenome deve ser do tipo string.", 403)
  if (typeof idade !== "number") throw new AppError("O campo idade deve ser do tipo numérico.", 403)
  if (typeof login !== "string") throw new AppError("O campo login deve ser do tipo string.", 403)
  if (typeof senha !== "string") throw new AppError("O campo senha deve ser do tipo string.", 403)
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403)

  if (nome.length > 256) throw new AppError("O nome deve possuir até 256 caracteres")
  if (sobrenome.length > 256) throw new AppError("O sobrenome deve possuir até 256 caracteres")
  if (login.length > 50) throw new AppError("O login deve possuir até 50 caracteres")
  if (senha.length > 50) throw new AppError("A senha deve possuir até 50 caracteres")
  if (status && status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")

  verificarEnderecos(enderecos)
}

function verificarParametrosPostPessoa({ nome, sobrenome, idade, login, senha, status, enderecos }: ICadastrarPessoa) {
  if (!nome) throw new AppError("Por favor insira um nome válido.")
  if (!sobrenome) throw new AppError("Por favor insira um sobrenome válido.")
  if (!idade) throw new AppError("Por favor insira uma idade válida.")
  if (!login) throw new AppError("Por favor insira um login válido.")
  if (!senha) throw new AppError("Por favor insira uma senha válida.")
  if (!status) throw new AppError("Por favor insira um status válido.")
  if (!enderecos || enderecos.length === 0) throw new AppError("Por favor insira pelo menos um endereço válido.")

  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo string.", 403)
  if (typeof sobrenome !== "string") throw new AppError("O campo sobrenome deve ser do tipo string.", 403)
  if (typeof idade !== "number") throw new AppError("O campo idade deve ser do tipo numérico.", 403)
  if (typeof login !== "string") throw new AppError("O campo login deve ser do tipo string.", 403)
  if (typeof senha !== "string") throw new AppError("O campo senha deve ser do tipo string.", 403)
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403)

  if (nome.length > 256) throw new AppError("O nome deve possuir até 256 caracteres")
  if (sobrenome.length > 256) throw new AppError("O sobrenome deve possuir até 256 caracteres")
  if (login.length > 50) throw new AppError("O login deve possuir até 50 caracteres")
  if (senha.length > 50) throw new AppError("A senha deve possuir até 50 caracteres")
  if (status && status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")
  verificarEnderecos(enderecos)
}

function verificarEnderecos(enderecos: Array<any>) {
  let num: number = 0
  for (let endereco of enderecos) {
    num++
    if (!endereco.nomeRua) throw new AppError(`Por favor insira um nomeRua válido para o ${num}º endereço.`)
    if (!endereco.numero) throw new AppError(`Por favor insira um numero válido para o ${num}º endereço.`)
    if (!endereco.complemento) throw new AppError(`Por favor insira uma complemento válida para o ${num}º endereço.`)
    if (!endereco.cep) throw new AppError(`Por favor insira um cep válido para o ${num}º endereço.`)
    if (!endereco.codigoBairro) throw new AppError(`Por favor insira uma codigoBairro válida para o ${num}º endereço.`)

    if (typeof endereco.nomeRua !== "string") throw new AppError(`O campo nomeRua deve ser do tipo string para o ${num}º endereço.`, 403)
    if (typeof endereco.numero !== "string") throw new AppError(`O campo número deve ser do tipo string para o ${num}º endereço.`, 403)
    if (typeof endereco.complemento !== "string") throw new AppError(`O campo complemento deve ser do tipo string para o ${num}º endereço.`, 403)
    if (typeof endereco.cep !== "string") throw new AppError(`O campo cep deve ser do tipo string para o ${num}º endereço.`, 403)
    if (typeof endereco.codigoBairro !== "number") throw new AppError(`O campo codigoBairro deve ser do tipo numérico para o ${num}º endereço.`, 403)

    if (endereco.nomeRua.length > 256) throw new AppError(`O nomeRua deve possuir até 256 caracteres para o ${num}º endereço.`)
    if (endereco.numero.length > 10) throw new AppError(`O número deve possuir até 10 caracteres para o ${num}º endereço.`)
    if (endereco.complemento.length > 20) throw new AppError(`O complemento deve possuir até 20 caracteres para o ${num}º endereço.`)
    if (endereco.cep.length > 50) throw new AppError(`O cep deve possuir até 10 caracteres para o ${num}º endereço.`)
  }
}
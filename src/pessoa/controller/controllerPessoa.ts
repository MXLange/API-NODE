import { Request, Response } from "express";
import { PessoaDAO } from "../DAO/pessoaDAO";
import AppError from "../../shared/errors/AppErrors";



export class ControllerPessoa {

  async cadastrar(req: Request, res: Response) {
    const { nome, sobrenome, idade, login, senha, status, enderecos } = req.body

    if (!nome) throw new AppError("Por favor insira um nome válido.")
    if (!sobrenome) throw new AppError("Por favor insira um sobrenome válido.")
    if (!idade) throw new AppError("Por favor insira uma idade válida.")
    if (!login) throw new AppError("Por favor insira um login válido.")
    if (!senha) throw new AppError("Por favor insira uma senha válida.")
    if (!status) throw new AppError("Por favor insira um status válido.")
    if (!enderecos || enderecos.length === 0) throw new AppError("Por favor insira pelo menos um endereço válido.")

    const pessoaDAO = new PessoaDAO()
    const resposta = await pessoaDAO.criar({ nome, sobrenome, idade, login, senha, status, enderecos })

    return res.status(200).json(resposta)
  }

  // async buscar(req: Request, res: Response) {
  //   const { codigoPessoa, codigoMunicipio, nome, status } = req.query;

  //   let pesquisar: any = {
  //     codigoPessoa: (codigoPessoa !== undefined ? Number(codigoPessoa) : "excluir"),
  //     codigoMunicipio: (codigoMunicipio !== undefined ? codigoMunicipio : "excluir"),
  //     nome: (nome !== undefined ? nome : "excluir"),
  //     status: (status !== undefined ? Number(status) : "excluir")
  //   }

  //   if (pesquisar.codigoPessoa === "excluir") delete pesquisar.codigoPessoa
  //   if (pesquisar.codigoMunicipio === "excluir") delete pesquisar.codigoMunicipio
  //   if (pesquisar.nome === "excluir") delete pesquisar.nome
  //   if (pesquisar.status === "excluir") delete pesquisar.status

  //   const pessoaDAO = new PessoaDAO();
  //   const resposta: Array<any> = await pessoaDAO.pesquisa(pesquisar)
  //   console.log(resposta)
  //   let retornar = [];
  //   for (let item of resposta) {
  //     const codigo = item.codigoMunicipio.codigoMunicipio
  //     item.codigoMunicipio = codigo
  //     let temp: any = {}
  //     temp.codigoPessoa = item.codigoPessoa
  //     temp.codigoMunicipio = item.codigoMunicipio
  //     temp.nome = item.nome
  //     temp.status = item.status
  //     retornar.push(temp)
  //   }
  //   return res.status(200).json(retornar)
  // }

  // async atualizar(req: Request, res: Response) {
  //   const { codigoPessoa, codigoMunicipio, nome, status } = req.body;

  //   if (!codigoPessoa) throw new AppError("Por favor insira uma código de pessoa.")
  //   if (!codigoMunicipio) throw new AppError("Por favor insira um código de UF.")
  //   if (!nome) throw new AppError("Por favor insira um nome.")
  //   if (!status) throw new AppError("Por favor insira um status.")

  //   const pessoaDAO = new PessoaDAO();

  //   const resposta: Array<any> = await pessoaDAO.alterar({ codigoPessoa, codigoMunicipio, nome, status })
  //   return res.status(200).json(resposta)
  // }

}
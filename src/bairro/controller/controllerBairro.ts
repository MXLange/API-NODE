import { Request, Response } from "express";
import { BairroDAO } from "../DAO/bairroDAO";
import AppError from "../../shared/errors/AppErrors";



export class ControllerBairro {

  async cadastrar(req: Request, res: Response) {
    const { codigoMunicipio, nome, status } = req.body

    if (!codigoMunicipio) throw new AppError("Por favor insira um código de município.")
    if (!nome) throw new AppError("Por favor insira um nome.")
    if (!status) throw new AppError("Por favor insira um status.")

    const bairroDAO = new BairroDAO()
    const resposta = await bairroDAO.criar({ codigoMunicipio, nome, status })

    return res.status(200).json(resposta)
  }

  async buscar(req: Request, res: Response) {
    const { codigoBairro, codigoMunicipio, nome, status } = req.query;

    let pesquisar: any = {
      codigoBairro: (codigoBairro !== undefined ? Number(codigoBairro) : "excluir"),
      codigoMunicipio: (codigoMunicipio !== undefined ? codigoMunicipio : "excluir"),
      nome: (nome !== undefined ? nome : "excluir"),
      status: (status !== undefined ? Number(status) : "excluir")
    }

    if (pesquisar.codigoBairro === "excluir") delete pesquisar.codigoBairro
    if (pesquisar.codigoMunicipio === "excluir") delete pesquisar.codigoMunicipio
    if (pesquisar.nome === "excluir") delete pesquisar.nome
    if (pesquisar.status === "excluir") delete pesquisar.status

    const bairroDAO = new BairroDAO();
    const resposta: Array<any> = await bairroDAO.pesquisa(pesquisar)
    let retornar = [];
    for (let item of resposta) {
      const codigo = item.codigoMunicipio.codigoMunicipio
      item.codigoMunicipio = codigo
      let temp: any = {}
      temp.codigoBairro = item.codigoBairro
      temp.codigoMunicipio = item.codigoMunicipio
      temp.nome = item.nome
      temp.status = item.status
      retornar.push(temp)
    }
    return res.status(200).json(retornar)
  }

  async atualizar(req: Request, res: Response) {
    const { codigoBairro, codigoMunicipio, nome, status } = req.body;

    if (!codigoBairro) throw new AppError("Por favor insira uma código de bairro.")
    if (!codigoMunicipio) throw new AppError("Por favor insira um código de UF.")
    if (!nome) throw new AppError("Por favor insira um nome.")
    if (!status) throw new AppError("Por favor insira um status.")

    const bairroDAO = new BairroDAO();

    const resposta: Array<any> = await bairroDAO.alterar({ codigoBairro, codigoMunicipio, nome, status })
    return res.status(200).json(resposta)
  }

}
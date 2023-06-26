import { Request, Response } from "express";
import { UfDAO } from "../DAO/ufDAO";
import AppError from "../../shared/errors/AppErrors";



export class ControllerUf {

  async cadastrar(req: Request, res: Response) {
    const { sigla, nome, status } = req.body

    if (!sigla) throw new AppError("Por favor insira uma sigla.")
    if (!nome) throw new AppError("Por favor insira um nome.")
    if (!status) throw new AppError("Por favor insira um status.")

    const ufDAO = new UfDAO()
    const resposta = await ufDAO.criar({ sigla, nome, status })
    return res.status(200).json(resposta)
  }

  async buscar(req: Request, res: Response) {
    const { codigoUf, sigla, nome, status } = req.query;

    let pesquisar: any = {
      codigoUf: (codigoUf !== undefined ? Number(codigoUf) : "excluir"),
      sigla: (sigla !== undefined ? sigla : "excluir"),
      nome: (nome !== undefined ? nome : "excluir"),
      status: (status !== undefined ? Number(status) : "excluir")
    }

    if (pesquisar.codigoUf === "excluir") delete pesquisar.codigoUf
    if (pesquisar.sigla === "excluir") delete pesquisar.sigla
    if (pesquisar.nome === "excluir") delete pesquisar.nome
    if (pesquisar.status === "excluir") delete pesquisar.status

    const ufDAO = new UfDAO();
    const resposta: unknown = await ufDAO.pesquisa(pesquisar)
    return res.status(200).json(resposta!)
  }

  async atualizar(req: Request, res: Response) {
    const { codigoUF, sigla, nome, status } = req.body;

    if (!codigoUF) throw new AppError("Por favor insira uma código de UF.")
    if (!sigla) throw new AppError("Por favor insira uma sigla.")
    if (!nome) throw new AppError("Por favor insira um nome.")
    if (!status) throw new AppError("Por favor insira um status.")

    const ufDAO = new UfDAO()
    const resposta = await ufDAO.alterar({ codigoUF, sigla, nome, status })

    return res.status(200).json(resposta)
  }
}
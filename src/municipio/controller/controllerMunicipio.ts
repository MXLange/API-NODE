import { Request, Response } from "express";
import { MunicipioDAO } from "../DAO/municipioDAO";
import AppError from "../../shared/errors/AppErrors";



export class ControllerMunicipio {

  async cadastrar(req: Request, res: Response) {
    const { codigoUF, nome, status } = req.body

    if (!codigoUF) throw new AppError("Por favor insira um código UF.")
    if (!nome) throw new AppError("Por favor insira um nome.")
    if (!status) throw new AppError("Por favor insira um status.")

    const municipioDAO = new MunicipioDAO()
    const resultado = await municipioDAO.criar({ codigoUF, nome, status })

    for (let item of resultado) {
      const codigo = item.codigoUf.codigoUf
      item.codigoUf = codigo;
    }

    return res.status(200).json(resultado)
  }

  async buscar(req: Request, res: Response) {
    const { codigoMunicipio, codigoUF, nome, status } = req.query;

    let pesquisar: any = {
      codigoMunicipio: (codigoMunicipio !== undefined ? Number(codigoMunicipio) : "excluir"),
      codigoUf: (codigoUF !== undefined ? codigoUF : "excluir"),
      nome: (nome !== undefined ? nome : "excluir"),
      status: (status !== undefined ? Number(status) : "excluir")
    }

    if (pesquisar.codigoMunicipio === "excluir") delete pesquisar.codigoMunicipio
    if (pesquisar.codigoUf === "excluir") delete pesquisar.codigoUf
    if (pesquisar.nome === "excluir") delete pesquisar.nome
    if (pesquisar.status === "excluir") delete pesquisar.status

    const municipioDAO = new MunicipioDAO();
    const resultado: Array<any> = await municipioDAO.pesquisa(pesquisar)

    for (let item of resultado) {
      const codigo = item.codigoUf.codigoUf
      item.codigoUf = codigo;
    }

    return res.status(200).json(resultado)
  }

  async atualizar(req: Request, res: Response) {
    const { codigoMunicipio, codigoUF, nome, status } = req.body;

    if (!codigoMunicipio) throw new AppError("Por favor insira uma código de municipio.")
    if (!codigoUF) throw new AppError("Por favor insira um código de UF.")
    if (!nome) throw new AppError("Por favor insira um nome.")
    if (!status) throw new AppError("Por favor insira um status.")

    const municipioDAO = new MunicipioDAO();

    const resultado: Array<any> = await municipioDAO.alterar({ codigoMunicipio, codigoUF, nome, status })

    for (let item of resultado) {
      const codigo = item.codigoUf.codigoUf
      item.codigoUf = codigo;
    }

    return res.status(200).json(resultado)
  }
}
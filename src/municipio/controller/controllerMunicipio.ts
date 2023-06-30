import { Request, Response } from "express";
import { MunicipioDAO } from "../DAO/municipioDAO";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarMunicipio, ICadastrarMunicipio } from "../interfaces/interfacesMunicipio";



export class ControllerMunicipio {

  async cadastrar(req: Request, res: Response) {
    const { codigoUF, nome, status } = req.body

    verificarParametrosPostMunicipio({ codigoUF, nome, status })

    const municipioDAO = new MunicipioDAO()
    const resposta = await municipioDAO.criar({ codigoUF, nome, status })
    return res.status(200).json(resposta)
  }

  async buscar(req: Request, res: Response) {
    const { codigoMunicipio, codigoUF, nome, status } = req.query;

    let pesquisar: any = {
      codigoMunicipio: (codigoMunicipio !== undefined ? Number(codigoMunicipio) : "excluir"),
      codigoUF: (codigoUF !== undefined ? codigoUF : "excluir"),
      nome: (nome !== undefined ? nome : "excluir"),
      status: (status !== undefined ? Number(status) : "excluir")
    }

    if (pesquisar.codigoMunicipio === "excluir") delete pesquisar.codigoMunicipio
    if (pesquisar.codigoUF === "excluir") delete pesquisar.codigoUF
    if (pesquisar.nome === "excluir") delete pesquisar.nome
    if (pesquisar.status === "excluir") delete pesquisar.status

    if (pesquisar.nome && pesquisar.nome.length > 256) throw new AppError("A nome deve possuir até 256 caracteres")
    if (pesquisar.status && pesquisar.status !== 1 && pesquisar.status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")

    const municipioDAO = new MunicipioDAO();
    const resposta: Array<any> = await municipioDAO.pesquisa(pesquisar)
    return res.status(200).json(resposta)
  }

  async atualizar(req: Request, res: Response) {
    const { codigoMunicipio, codigoUF, nome, status } = req.body;

    verificarParametrosPutMunicipio({ codigoMunicipio, codigoUF, nome, status })

    const municipioDAO = new MunicipioDAO();

    const resposta: Array<any> = await municipioDAO.alterar({ codigoMunicipio, codigoUF, nome, status })

    return res.status(200).json(resposta)
  }

}

function verificarParametrosPostMunicipio({ codigoUF, nome, status }: ICadastrarMunicipio) {
  if (!codigoUF) throw new AppError("Por favor insira um código UF.")
  if (!nome) throw new AppError("Por favor insira um nome.")
  if (!status) throw new AppError("Por favor insira um status.")

  if (typeof codigoUF !== "number") throw new AppError("O campo codigoUF deve ser do tipo numérico.", 403)
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo texto.", 403)
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403)

  if (nome.length > 256) throw new AppError("O nome deve possuir até 256 caracteres")
  if (status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")
}

function verificarParametrosPutMunicipio({ codigoMunicipio, codigoUF, nome, status }: IAlterarMunicipio) {
  if (!codigoMunicipio) throw new AppError("Por favor insira uma código de municipio.")
  if (!codigoUF) throw new AppError("Por favor insira um código de UF.")
  if (!nome) throw new AppError("Por favor insira um nome.")
  if (!status) throw new AppError("Por favor insira um status.")

  if (typeof codigoMunicipio !== "number") throw new AppError("O campo codigoMunicipio deve ser do tipo numérico.", 403)
  if (typeof codigoUF !== "number") throw new AppError("O campo codigoUF deve ser do tipo numérico.", 403)
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo texto.", 403)
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403)

  if (nome && nome.length > 256) throw new AppError("A nome deve possuir até 60 caracteres")
  if (status && status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")
}
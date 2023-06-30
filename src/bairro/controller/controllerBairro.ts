import { Request, Response } from "express";
import { BairroDAO } from "../DAO/bairroDAO";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarBairro, ICadastrarBairro } from "../interfaces/interfacesBairro";



export class ControllerBairro {

  async cadastrar(req: Request, res: Response) {
    const { codigoMunicipio, nome, status } = req.body

    verificarParametrosPostBairro({ codigoMunicipio, nome, status })

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

    if (pesquisar.nome && pesquisar.nome.length > 256) throw new AppError("A nome deve possuir até 60 caracteres")
    if (pesquisar.status && pesquisar.status !== 1 && pesquisar.status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")

    const bairroDAO = new BairroDAO();
    const resposta: Array<any> = await bairroDAO.pesquisa(pesquisar)
    return res.status(200).json(resposta)
  }

  async atualizar(req: Request, res: Response) {
    const { codigoBairro, codigoMunicipio, nome, status } = req.body;

    verificarParametrosPutBairro({ codigoBairro, codigoMunicipio, nome, status })

    const bairroDAO = new BairroDAO();

    const resposta: Array<any> = await bairroDAO.alterar({ codigoBairro, codigoMunicipio, nome, status })
    return res.status(200).json(resposta)
  }

  async deletar(req: Request, res: Response) {
    const { codigoBairro } = req.params
    const codigo = Number(codigoBairro)
    const bairroDAO = new BairroDAO()
    const resposta = await bairroDAO.deletar(codigo)
    if (resposta) {
      return res.status(200).json({ mensagem: "Registro excluído com sucesso" })
    }
  }

}

function verificarParametrosPostBairro({ codigoMunicipio, nome, status }: ICadastrarBairro) {
  if (!codigoMunicipio) throw new AppError("Por favor insira um código de município.")
  if (!nome) throw new AppError("Por favor insira um nome.")
  if (!status) throw new AppError("Por favor insira um status.")

  if (typeof codigoMunicipio !== "number") throw new AppError("O campo codigoMunicipio deve ser do tipo numérico.", 403)
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo texto.", 403)
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403)

  if (nome.length > 256) throw new AppError("O nome deve possuir até 256 caracteres")
  if (status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")
}

function verificarParametrosPutBairro({ codigoBairro, codigoMunicipio, nome, status }: IAlterarBairro) {
  if (!codigoBairro) throw new AppError("Por favor insira uma código de bairro.")
  if (!codigoMunicipio) throw new AppError("Por favor insira um código de UF.")
  if (!nome) throw new AppError("Por favor insira um nome.")
  if (!status) throw new AppError("Por favor insira um status.")

  if (typeof codigoBairro !== "number") throw new AppError("O campo codigoBairro deve ser do tipo numérico.", 403)
  if (typeof codigoMunicipio !== "number") throw new AppError("O campo codigoMunicipio deve ser do tipo numérico.", 403)
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo texto.", 403)
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403)

  if (nome && nome.length > 256) throw new AppError("A nome deve possuir até 60 caracteres")
  if (status && status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo")
}
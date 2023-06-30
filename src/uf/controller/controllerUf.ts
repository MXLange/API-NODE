import { Request, Response } from "express";
import { UfDAO } from "../DAO/ufDAO";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarUf, ICadastrarUf } from "../interfaces/interfacesUf";



export class ControllerUf {

  async cadastrar(req: Request, res: Response) {

    const { sigla, nome, status } = req.body;

    verificarParametrosPostUf({ sigla, nome, status });

    const ufDAO = new UfDAO();

    const resposta = await ufDAO.criar({ sigla, nome, status });

    return res.status(200).json(resposta);

  }

  async buscar(req: Request, res: Response) {

    const { codigoUF, sigla, nome, status } = req.query;

    let pesquisar: any = {
      codigoUF: (codigoUF !== undefined ? Number(codigoUF) : "excluir"),
      sigla: (sigla !== undefined ? sigla : "excluir"),
      nome: (nome !== undefined ? nome : "excluir"),
      status: (status !== undefined ? Number(status) : "excluir")
    }

    if (pesquisar.codigoUF === "excluir") delete pesquisar.codigoUF;
    if (pesquisar.sigla === "excluir") delete pesquisar.sigla;
    if (pesquisar.nome === "excluir") delete pesquisar.nome;
    if (pesquisar.status === "excluir") delete pesquisar.status;

    if (pesquisar.sigla && pesquisar.sigla.length > 3) {
      throw new AppError("A sigla deve possuir até 3 caracteres");
    }

    if (pesquisar.nome && pesquisar.nome.length > 60) {
      throw new AppError("A nome deve possuir até 60 caracteres");
    }

    if (pesquisar.status && pesquisar.status !== 1 && pesquisar.status !== 2) {
      throw new AppError("Insira status 1 para ativo ou 2 para inativo");
    }

    const ufDAO = new UfDAO();

    const resposta = await ufDAO.pesquisa(pesquisar);

    return res.status(200).json(resposta);

  }

  async atualizar(req: Request, res: Response) {

    const { codigoUF, sigla, nome, status } = req.body;

    verificarParametrosPutUf({ codigoUF, sigla, nome, status });

    const ufDAO = new UfDAO();

    const resposta = await ufDAO.alterar({ codigoUF, sigla, nome, status });

    return res.status(200).json(resposta);

  }

  async deletar(req: Request, res: Response) {

    const { codigoUF } = req.params;

    const codigo = Number(codigoUF);

    const ufDAO = new UfDAO();

    const resposta = await ufDAO.deletar(codigo);

    if (resposta) {
      return res.status(200).json({ mensagem: "Registro excluído com sucesso" });
    }

  }
}

function verificarParametrosPostUf({ sigla, nome, status }: ICadastrarUf) {

  if (!sigla) throw new AppError("Por favor insira uma sigla, campo obrigatório.");
  if (!nome) throw new AppError("Por favor insira um nome, campo obrigatório.");
  if (!status) throw new AppError("Por favor insira um status, campo obrigatório.");

  if (typeof sigla !== "string") throw new AppError("O campo sigla deve ser do tipo texto.", 403);
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo texto.", 403);
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403);

  if (sigla.length > 3) throw new AppError("A sigla deve possuir até 3 caracteres");
  if (nome.length > 60) throw new AppError("O nome deve possuir até 60 caracteres");
  if (status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo");

}

function verificarParametrosPutUf({ codigoUF, sigla, nome, status }: IAlterarUf) {

  if (!codigoUF) throw new AppError("Por favor insira uma código de UF.");
  if (!sigla) throw new AppError("Por favor insira uma sigla.");
  if (!nome) throw new AppError("Por favor insira um nome.");
  if (!status) throw new AppError("Por favor insira um status.");

  if (typeof codigoUF !== "number") throw new AppError("O campo codigoUF deve ser do tipo numérico.", 403);
  if (typeof sigla !== "string") throw new AppError("O campo sigla deve ser do tipo texto.", 403);
  if (typeof nome !== "string") throw new AppError("O campo nome deve ser do tipo texto.", 403);
  if (typeof status !== "number") throw new AppError("O campo status deve ser do tipo numérico.", 403);

  if (sigla && sigla.length > 3) throw new AppError("A sigla deve possuir até 3 caracteres");
  if (nome && nome.length > 60) throw new AppError("A nome deve possuir até 60 caracteres");
  if (status && status !== 1 && status !== 2) throw new AppError("Insira status 1 para ativo ou 2 para inativo");

}
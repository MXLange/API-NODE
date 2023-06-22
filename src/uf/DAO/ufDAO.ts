import { AppDataSource } from "../../data-source";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarUf, ICadastrarUf } from "../interfaces/interfacesUf";
import { ufRepository } from "../repository/ufRepository";

export class UfDAO {

  async criar({ sigla, nome, status }: ICadastrarUf): Promise<any> {
    const jaExisteSigla = await ufRepository.findOne({
      where: {
        sigla,
      }
    })
    if (jaExisteSigla) throw new AppError(`Já existe uma UF com a sigla ${sigla}.`)
    const jaExisteNome = await ufRepository.findOne({
      where: {
        nome,
      }
    })
    if (jaExisteNome) throw new AppError(`Já existe uma UF com o nome ${nome}.`)
    const queryRunner = await AppDataSource.createQueryRunner()
    const resultado = await queryRunner.manager.query(`INSERT INTO TB_UF (CODIGO_UF, SIGLA, NOME, STATUS) VALUES (SEQUENCE_UF.nextval, '${sigla}', '${nome}', ${status})`)
    if (!resultado) throw new AppError("Não foi possível incluir UF no banco de dados.", 404)

    const retorno = await ufRepository.find({
      order: {
        codigoUf: "DESC"
      }
    })
    return retorno;
  }

  async pesquisa(dados: any) {
    const resultado = await ufRepository.find({
      where: dados,
      order: {
        codigoUf: "DESC"
      }
    });

    if (!resultado) throw new AppError("Não foi possível consultar UF no banco de dados.", 404)
    return resultado;
  }

  async alterar({ codigoUf, sigla, nome, status }: IAlterarUf) {
    const jaExisteSigla = await ufRepository.findOne({
      where: {
        sigla,
      }
    })
    if (jaExisteSigla && jaExisteSigla.codigoUf !== codigoUf) throw new AppError(`Já existe uma UF com a sigla ${sigla}.`)
    const jaExisteNome = await ufRepository.findOne({
      where: {
        nome,
      }
    })
    if (jaExisteNome && jaExisteNome.codigoUf !== codigoUf) throw new AppError(`Já existe uma UF com o nome ${nome}.`)

    let uf: any = await ufRepository.findOne({
      where: {
        codigoUf,
      }
    });
    if (!uf) throw new AppError("Insira um código de UF válido")

    uf.sigla = sigla;
    uf.nome = nome;
    uf.status = status;

    const resultado = await ufRepository.save(uf)
    if (!resultado) throw new AppError("Não foi possível alterar o registro.")

    const retorno = await ufRepository.find({
      order: {
        codigoUf: "DESC"
      }
    })
    return retorno;
  }
}
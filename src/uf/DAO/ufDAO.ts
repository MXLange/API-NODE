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
    if (jaExisteSigla) throw new AppError(`Já existe uma UF com a sigla ${sigla}.`, 409)
    const jaExisteNome = await ufRepository.findOne({
      where: {
        nome,
      }
    })
    if (jaExisteNome) throw new AppError(`Já existe uma UF com o nome ${nome}.`, 409)

    const queryRunner = AppDataSource.createQueryRunner()
    const resultado = await queryRunner.manager.query(`INSERT INTO TB_UF (CODIGO_UF, SIGLA, NOME, STATUS) VALUES (SEQUENCE_UF.nextval, '${sigla}', '${nome}', ${status})`)
    if (!resultado) throw new AppError("Não foi possível incluir UF no banco de dados.")

    const retorno = await this.pesquisa({})
    if (!retorno) throw new AppError("Não foi possível gerar o retorno, porém seu cadastro foi concluído.")

    return retorno;
  }

  async pesquisa(dados: any) {
    const resultado = await ufRepository.find({
      where: dados,
      order: {
        codigoUF: "DESC"
      }
    });

    if (!resultado) throw new AppError("Não foi possível consultar UF no banco de dados.", 404)
    return resultado;
  }

  async alterar({ codigoUF, sigla, nome, status }: IAlterarUf) {
    const jaExisteSigla = await ufRepository.findOne({
      where: {
        sigla,
      }
    })
    if (jaExisteSigla && jaExisteSigla.codigoUF !== codigoUF) throw new AppError(`Já existe uma UF com a sigla ${sigla}.`)

    const jaExisteNome = await ufRepository.findOne({
      where: {
        nome,
      }
    })

    if (jaExisteNome && jaExisteNome.codigoUF !== codigoUF) throw new AppError(`Já existe uma UF com o nome ${nome}.`)

    let uf: any = await ufRepository.findOne({
      where: {
        codigoUF: codigoUF,
      }
    });
    if (!uf) throw new AppError("Insira um código de UF válido")

    uf.sigla = sigla;
    uf.nome = nome;
    uf.status = status;

    const resultado = await ufRepository.save(uf)
    if (!resultado) throw new AppError("Não foi possível alterar o registro.")


    const retorno = await this.pesquisa({});
    if (!retorno) throw new AppError("A UF foi atualizada, porém não conseguimos encontrar o retorno esperado.", 404)
    return retorno;
  }
}
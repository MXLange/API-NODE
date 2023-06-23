import { AppDataSource } from "../../data-source";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarMunicipio, ICadastrarMunicipio } from "../interfaces/interfacesMunicipio";
import { municipioRepository } from "../repository/municipioRepository";

export class MunicipioDAO {

  async criar({ codigoUF, nome, status }: ICadastrarMunicipio): Promise<any> {
    const queryRunner = await AppDataSource.createQueryRunner()
    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);

    if (jaExiste.length !== 0) throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`)

    const resultado = await queryRunner.manager.query(`INSERT INTO TB_MUNICIPIO (CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS) VALUES (SEQUENCE_MUNICIPIO.nextval, '${codigoUF}', '${nome}', ${status})`)

    if (!resultado) throw new AppError("Não foi possível incluir UF no banco de dados.", 404)

    const retorno = await municipioRepository.find({
      relations: {
        codigoUf: true
      },
      order: {
        codigoUf: "DESC"
      }
    });
    return retorno;
  }

  async pesquisa(dados: any): Promise<Array<any>> {
    const resultado = await municipioRepository.find({
      where: dados,
      relations: {
        codigoUf: true
      },
      order: {
        codigoUf: "DESC"
      }
    });

    if (!resultado) throw new AppError("Não foi possível consultar UF no banco de dados.", 404)
    return resultado;
  }

  async alterar({ codigoMunicipio, codigoUF, nome, status }: IAlterarMunicipio): Promise<Array<any>> {
    const queryRunner = await AppDataSource.createQueryRunner()
    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);
    console.log(jaExiste)
    if (jaExiste.length !== 0 && jaExiste[0].CODIGO_MUNICIPIO !== codigoMunicipio) throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`)

    let municipio: any = await municipioRepository.findOne({
      where: {
        codigoMunicipio,
      },
      relations: {
        codigoUf: true
      },
    });
    if (!municipio) throw new AppError("Insira um código de UF válido")

    municipio.nome = nome
    municipio.status = status
    municipio.codigoUf = codigoUF

    const resultado = await municipioRepository.save(municipio)
    if (!resultado) throw new AppError("Não foi possível alterar o registro.")

    const retorno = await municipioRepository.find({
      relations: {
        codigoUf: true
      },
      order: {
        codigoUf: "DESC"
      }
    });
    return retorno;
  }
}
import { AppDataSource } from "../../data-source";
import AppError from "../../shared/errors/AppErrors";
import { ufRepository } from "../../uf/repository/ufRepository";
import { IAlterarMunicipio, ICadastrarMunicipio } from "../interfaces/interfacesMunicipio";
import { municipioRepository } from "../repository/municipioRepository";

export class MunicipioDAO {

  async criar({ codigoUF, nome, status }: ICadastrarMunicipio): Promise<any> {
    const existeUf = await ufRepository.findOne({
      where: {
        codigoUF
      }
    })
    if (!existeUf) throw new AppError("Por favor, insira um código de UF válido")
    const queryRunner = AppDataSource.createQueryRunner()
    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);

    if (jaExiste.length !== 0) throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`)

    const resultado = await queryRunner.manager.query(`INSERT INTO TB_MUNICIPIO (CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS) VALUES (SEQUENCE_MUNICIPIO.nextval, '${codigoUF}', '${nome}', ${status})`)

    if (!resultado) throw new AppError("Não foi possível incluir UF no banco de dados.", 404)
    const retorno = await queryRunner.manager.query(`SELECT CODIGO_MUNICIPIO "codigoMunicipio", CODIGO_UF "codigoUF", NOME "nome", STATUS "status" FROM TB_MUNICIPIO ORDER BY "codigoMunicipio" DESC`)
    if (!retorno) throw new AppError("O município foi cadastrado, mas não foi possível encontrar o retorno esperado")
    return retorno;
  }

  async pesquisa(dados: any): Promise<Array<any>> {
    console.log(dados)
    const resultado = await municipioRepository.find({
      where: dados,
      relations: {
        codigoUF: true
      },
      order: {
        codigoUF: "DESC"
      }
    });

    if (!resultado) throw new AppError("Não foi possível consultar UF no banco de dados.", 404)

    return resultado;
  }

  async alterar({ codigoMunicipio, codigoUF, nome, status }: IAlterarMunicipio): Promise<Array<any>> {
    const queryRunner = AppDataSource.createQueryRunner()
    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);
    if (jaExiste.length !== 0 && jaExiste[0].CODIGO_MUNICIPIO !== codigoMunicipio) throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`)

    let municipio: any = await municipioRepository.findOne({
      where: {
        codigoMunicipio,
      },
      relations: {
        codigoUF: true
      },
    });

    if (!municipio) throw new AppError("Insira um código de município válido.")

    const existeUf = await ufRepository.findOne({
      where: {
        codigoUF
      }
    })
    if (!existeUf) throw new AppError("Por favor, insira um código de UF válido")

    municipio.nome = nome
    municipio.status = status
    municipio.codigoUf = codigoUF

    const resultado = await municipioRepository.save(municipio)
    if (!resultado) throw new AppError("Não foi possível alterar o registro.")

    const retorno = await queryRunner.manager.query(`SELECT CODIGO_MUNICIPIO "codigoMunicipio", CODIGO_UF "codigoUF", NOME "nome", STATUS "status" FROM TB_MUNICIPIO ORDER BY "codigoMunicipio" DESC`)
    if (!retorno) throw new AppError("O município foi cadastrado, mas não foi possível encontrar o retorno esperado")
    return retorno;
  }
}
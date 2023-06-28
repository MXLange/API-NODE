import { AppDataSource } from "../../data-source";
import { municipioRepository } from "../../municipio/repository/municipioRepository";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarBairro, ICadastrarBairro } from "../interfaces/interfacesBairro";
import { bairroRepository } from "../repository/bairroRepository";

export class BairroDAO {

  async criar({ codigoMunicipio, nome, status }: ICadastrarBairro): Promise<any> {
    const existeMunicipio = await municipioRepository.findOne({
      where: {
        codigoMunicipio,
      }
    })
    if (!existeMunicipio) throw new AppError("Por favor insira um código de município válido.")
    const queryRunner = AppDataSource.createQueryRunner()
    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_MUNICIPIO='${codigoMunicipio}' AND NOME='${nome}'`);

    if (jaExiste.length !== 0) throw new AppError(`Já existe um bairro com o nome ${nome} para este município.`)

    const resultado = await queryRunner.manager.query(`INSERT INTO TB_BAIRRO (CODIGO_BAIRRO, CODIGO_MUNICIPIO, NOME, STATUS) VALUES (SEQUENCE_BAIRRO.nextval, '${codigoMunicipio}', '${nome}', ${status})`)

    if (!resultado) throw new AppError("Não foi possível incluir MUNICIPIO no banco de dados.", 404)

    const retorno = await this.pesquisa({})
    return retorno;
  }

  async pesquisa(dados: any): Promise<Array<any>> {
    const resultado: any = await bairroRepository.find({
      where: dados,
      relations: {
        codigoMunicipio: true
      },
      order: {
        codigoBairro: "DESC"
      }
    });

    for (let item of resultado) {
      item.codigoMunicipio = item.codigoMunicipio.codigoMunicipio
    }

    if (!resultado) throw new AppError("Não foi possível consultar o bairro no banco de dados.", 404)
    return resultado;
  }

  async alterar({ codigoBairro, codigoMunicipio, nome, status }: IAlterarBairro): Promise<Array<any>> {
    const queryRunner = AppDataSource.createQueryRunner()
    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_BAIRRO WHERE CODIGO_MUNICIPIO='${codigoMunicipio}' AND NOME='${nome}'`);
    if (jaExiste.length !== 0 && jaExiste[0].CODIGO_BAIRRO !== codigoBairro)
      throw new AppError(`Já existe um bairro com o nome ${nome} para este município.`)

    let municipio: any = await municipioRepository.findOne({
      where: {
        codigoMunicipio,
      }
    })
    if (!municipio) throw new AppError("Insira um código de município válido")
    let bairro: any = await bairroRepository.findOne({
      where: {
        codigoBairro,
      },
      relations: {
        codigoMunicipio: true
      },
    });
    if (!bairro) throw new AppError("Insira um código de bairro válido")

    bairro.nome = nome
    bairro.status = status
    bairro.codigoMunicipio = codigoMunicipio

    const resultado = await bairroRepository.save(bairro)
    if (!resultado) throw new AppError("Não foi possível alterar o registro.")

    const retorno = await this.pesquisa({})
    if (!retorno) throw new AppError("O bairro foi cadastrado, porém não foi possível endontrar o retorno desejado")
    return retorno;
  }
}
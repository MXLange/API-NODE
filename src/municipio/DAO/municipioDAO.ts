import { bairroRepository } from "../../bairro/repository/bairroRepository";
import { AppDataSource } from "../../data-source";
import { enderecoRepository } from "../../endereco/repository/enderecoRepository";
import AppError from "../../shared/errors/AppErrors";
import { ufRepository } from "../../uf/repository/ufRepository";
import { IAlterarMunicipio, ICadastrarMunicipio } from "../interfaces/interfacesMunicipio";
import { municipioRepository } from "../repository/municipioRepository";

export class MunicipioDAO {

  async criar({ codigoUF, nome, status }: ICadastrarMunicipio): Promise<any> {

    const existeUf = await ufRepository.findOne({
      where: {
        codigoUF,
      }
    })

    if (!existeUf) {
      throw new AppError("Por favor, insira um código de UF válido");
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();

    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);

    if (jaExiste.length !== 0) {
      throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`, 400, queryRunner);
    }

    const resultado = await queryRunner.manager.query(`INSERT INTO TB_MUNICIPIO (CODIGO_MUNICIPIO, CODIGO_UF, NOME, STATUS) VALUES (SEQUENCE_MUNICIPIO.nextval, '${codigoUF}', '${nome}', ${status})`);

    await queryRunner.release();

    if (!resultado) {
      throw new AppError("Não foi possível incluir UF no banco de dados.", 404);
    }

    const retorno = await this.pesquisa({});

    if (!retorno) throw new AppError("O município foi cadastrado, mas não foi possível encontrar o retorno esperado");

    return retorno;
  }

  async pesquisa(dados: any): Promise<Array<any>> {

    const resultado: any = await municipioRepository.find({
      where: dados,
      relations: {
        codigoUF: true,
      },
      order: {
        codigoMunicipio: "DESC",
      }
    });

    if (!resultado) {
      throw new AppError("Não foi possível consultar UF no banco de dados.", 404);
    }

    for (let item of resultado) {
      item.codigoUF = item.codigoUF.codigoUF;
    }

    return resultado;
  }

  async alterar({ codigoMunicipio, codigoUF, nome, status }: IAlterarMunicipio): Promise<Array<any>> {

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();

    const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);

    if (jaExiste.length !== 0 && jaExiste[0].CODIGO_MUNICIPIO !== codigoMunicipio) {
      throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`, 400, queryRunner);
    }

    let municipio: any = await municipioRepository.findOne({
      where: {
        codigoMunicipio,
      },
      relations: {
        codigoUF: true,
      },
    });

    if (!municipio) {
      throw new AppError("Insira um código de município válido.", 400, queryRunner);
    }

    const existeUf = await ufRepository.findOne({
      where: {
        codigoUF,
      }
    });

    if (!existeUf) {
      throw new AppError("Por favor, insira um código de UF válido", 400, queryRunner);
    }

    const resultado = await queryRunner.manager.query(`UPDATE TB_MUNICIPIO SET CODIGO_UF=${codigoUF}, NOME='${nome}', STATUS=${status} WHERE CODIGO_MUNICIPIO=${codigoMunicipio}`);

    await queryRunner.release();

    if (!resultado) {
      throw new AppError("Não foi possível alterar o registro.");
    }

    const retorno = await this.pesquisa({});

    if (!retorno) {
      throw new AppError("O município foi cadastrado, mas não foi possível encontrar o retorno esperado");
    }

    return retorno;
  }

  async deletar(codigoMunicipio: number) {

    const existeMunicipio = municipioRepository.find({
      where: {
        codigoMunicipio,
      }
    })

    if (!existeMunicipio) {
      throw new AppError("Insira um código de município válido.");
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();

    const bairros = await queryRunner.manager.query(`SELECT * FROM TB_BAIRRO WHERE CODIGO_MUNICIPIO=${codigoMunicipio}`);

    let codigosBairros = [];
    let enderecos = [];
    let codigosEnderecos = [];

    for (let bairro of bairros) {

      codigosBairros.push(bairro.CODIGO_BAIRRO);

      let res = await queryRunner.manager.query(`SELECT * FROM TB_ENDERECO WHERE CODIGO_BAIRRO=${bairro.CODIGO_BAIRRO}`);

      if (res.length > 0) {
        enderecos.push(res);
      }
    }

    await queryRunner.release();

    for (let item of enderecos) {
      for (let endereco of item) {
        codigosEnderecos.push(endereco.CODIGO_ENDERECO);
      }
    }

    if (codigosEnderecos.length > 0) {
      await enderecoRepository.delete(codigosEnderecos);
    }

    if (codigosBairros.length > 0) {
      await bairroRepository.delete(codigosBairros);
    }

    await municipioRepository.delete({ codigoMunicipio });

    return true;
  }
}
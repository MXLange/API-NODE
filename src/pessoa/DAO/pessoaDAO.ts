import { AppDataSource } from "../../data-source";
import { EnderecoDAO } from "../../endereco/DAO/enderecoDAO";
import { municipioRepository } from "../../municipio/repository/municipioRepository";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarPessoa, ICadastrarPessoa } from "../interfaces/interfacesPessoa";
import { pessoaRepository } from "../repository/pessoaRepository";

export class PessoaDAO {

  //login unico
  async criar({ nome, sobrenome, idade, login, senha, status, enderecos }: ICadastrarPessoa): Promise<any> {
    const existeLogin = await pessoaRepository.findOne({
      where: {
        login,
      }
    })
    if (existeLogin) throw new AppError(`Este login, ${login}, já está em uso. Insira um login diferente.`)
    const queryRunner = AppDataSource.createQueryRunner()

    const resultado = await queryRunner.manager.query(`INSERT INTO TB_PESSOA (CODIGO_PESSOA ,NOME, SOBRENOME, IDADE, LOGIN, SENHA, STATUS) VALUES (SEQUENCE_PESSOA.nextval, '${nome}', '${sobrenome}', '${idade}', '${login}', '${senha}', ${status})`)
    if (!resultado) throw new AppError("Não foi possível incluir esse cadastro no banco de dados.", 404)


    let codigoPessoa: any = await pessoaRepository.find({
      order: {
        codigoPessoa: "DESC",
      }
    });
    codigoPessoa = codigoPessoa[0].codigoPessoa
    const enderecoDAO = new EnderecoDAO();
    for (let endereco of enderecos) {
      let codigoBairro = Number(endereco.codigoBairro)
      let nomeRua = endereco.nomeRua.toString()
      let numero = endereco.numero.toString()
      let complemento = endereco.complemento.toString()
      let cep = endereco.cep.toString()
      await enderecoDAO.criar({ codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep })
    }
    // const retorno = await queryRunner.manager.query(`SELECT CODIGO_PESSOA "codigoPessoa", CODIGO_MUNICIPIO "codigoMunicipio", NOME "nome", STATUS "status" FROM TB_PESSOA ORDER BY "codigoPessoa" DESC`)
    // if (!retorno) throw new AppError("O pessoa foi cadastrado, porém não foi possível endontrar o retorno desejado")
    // return retorno;
  }

  // async pesquisa(dados: any): Promise<Array<any>> {
  //   const resultado = await pessoaRepository.find({
  //     where: dados,
  //     relations: {
  //       codigoMunicipio: true
  //     },
  //     order: {
  //       codigoMunicipio: "DESC"
  //     }
  //   });

  //   if (!resultado) throw new AppError("Não foi possível consultar o pessoa no banco de dados.", 404)
  //   return resultado;
  // }

  // async alterar({ codigoPessoa, codigoMunicipio, nome, status }: IAlterarPessoa): Promise<Array<any>> {
  //   const queryRunner = AppDataSource.createQueryRunner()
  //   const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_PESSOA WHERE CODIGO_MUNICIPIO='${codigoMunicipio}' AND NOME='${nome}'`);
  //   if (jaExiste.length !== 0 && jaExiste[0].CODIGO_PESSOA !== codigoPessoa)
  //     throw new AppError(`Já existe um pessoa com o nome ${nome} para este município.`)

  //   let municipio: any = await municipioRepository.findOne({
  //     where: {
  //       codigoMunicipio,
  //     }
  //   })
  //   if (!municipio) throw new AppError("Insira um código de município válido")
  //   let pessoa: any = await pessoaRepository.findOne({
  //     where: {
  //       codigoPessoa,
  //     },
  //     relations: {
  //       codigoMunicipio: true
  //     },
  //   });
  //   if (!pessoa) throw new AppError("Insira um código de pessoa válido")

  //   pessoa.nome = nome
  //   pessoa.status = status
  //   pessoa.codigoMunicipio = codigoMunicipio

  //   const resultado = await pessoaRepository.save(pessoa)
  //   if (!resultado) throw new AppError("Não foi possível alterar o registro.")

  //   const retorno = await queryRunner.manager.query(`SELECT CODIGO_PESSOA "codigoPessoa", CODIGO_MUNICIPIO "codigoMunicipio", NOME "nome", STATUS "status" FROM TB_PESSOA ORDER BY "codigoPessoa" DESC`)
  //   if (!retorno) throw new AppError("O pessoa foi cadastrado, porém não foi possível endontrar o retorno desejado")
  //   return retorno;
  // }
}
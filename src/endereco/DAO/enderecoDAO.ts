import { AppDataSource } from "../../data-source";
import AppError from "../../shared/errors/AppErrors";
import { ufRepository } from "../../uf/repository/ufRepository";
import { IAlterarEndereco, ICadastrarEndereco } from "../interfaces/interfacesEndereco";
import { enderecoRepository } from "../repository/enderecoRepository";

export class EnderecoDAO {

  async criar({ codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep }: ICadastrarEndereco): Promise<any> {
    const queryRunner = AppDataSource.createQueryRunner()
    // retorno 0 significa que esse endereço já está cadastrado para essa pessoa
    // retorno 1 significa que o endereço foi cadastrado com sucesso
    const existeEndereco = await queryRunner.manager.query(`SELECT * FROM TB_ENDERECO WHERE CODIGO_PESSOA=${codigoPessoa} AND CODIGO_BAIRRO=${codigoBairro} AND NOME_RUA='${nomeRua}' AND NUMERO='${numero}' AND COMPLEMENTO='${complemento}' AND CEP='${cep}'`)
    if (existeEndereco.length > 0) return 0
    if (existeEndereco.length === 0) {
      const resultado = await queryRunner.manager.query(`INSERT INTO TB_ENDERECO (CODIGO_ENDERECO, CODIGO_PESSOA, CODIGO_BAIRRO, NOME_RUA, NUMERO, COMPLEMENTO, CEP) VALUES (SEQUENCE_ENDERECO.nextval, ${codigoPessoa}, ${codigoBairro}, '${nomeRua}', '${numero}', '${complemento}', '${cep}')`)
      if (resultado) {
        return 1
      } else {
        throw new AppError(`Não foi possível cadastrar o endereço de com codigo de bairro: ${codigoBairro}, nome da rua: ${nomeRua}, número: ${numero}, complemento: ${complemento} e CEP: ${cep}.`)
      }
    }
  }

  // async pesquisa(dados: any): Promise<Array<any>> {
  //   const resultado = await enderecoRepository.find({
  //     where: dados,
  //     relations: {
  //       codigoUf: true
  //     },
  //     order: {
  //       codigoUf: "DESC"
  //     }
  //   });

  //   if (!resultado) throw new AppError("Não foi possível consultar UF no banco de dados.", 404)
  //   return resultado;
  // }

  // async alterar({ codigoEndereco, codigoUF, nome, status }: IAlterarEndereco): Promise<Array<any>> {
  //   const queryRunner = AppDataSource.createQueryRunner()
  //   const jaExiste = await queryRunner.manager.query(`SELECT * FROM TB_ENDERECO WHERE CODIGO_UF='${codigoUF}' AND NOME='${nome}'`);
  //   if (jaExiste.length !== 0 && jaExiste[0].CODIGO_ENDERECO !== codigoEndereco) throw new AppError(`Já existe uma município com o nome ${nome} para esta UF.`)

  //   let endereco: any = await enderecoRepository.findOne({
  //     where: {
  //       codigoEndereco,
  //     },
  //     relations: {
  //       codigoUf: true
  //     },
  //   });

  //   if (!endereco) throw new AppError("Insira um código de município válido.")

  //   const existeUf = await ufRepository.findOne({
  //     where: {
  //       codigoUf: codigoUF,
  //     }
  //   })
  //   if (!existeUf) throw new AppError("Por favor, insira um código de UF válido")

  //   endereco.nome = nome
  //   endereco.status = status
  //   endereco.codigoUf = codigoUF

  //   const resultado = await enderecoRepository.save(endereco)
  //   if (!resultado) throw new AppError("Não foi possível alterar o registro.")

  //   const retorno = await queryRunner.manager.query(`SELECT CODIGO_ENDERECO "codigoEndereco", CODIGO_UF "codigoUF", NOME "nome", STATUS "status" FROM TB_ENDERECO ORDER BY "codigoEndereco" DESC`)
  //   if (!retorno) throw new AppError("O município foi cadastrado, mas não foi possível encontrar o retorno esperado")
  //   return retorno;
  // }
}
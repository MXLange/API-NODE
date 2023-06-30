import { bairroRepository } from "../../bairro/repository/bairroRepository";
import { AppDataSource } from "../../data-source";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarEndereco, ICadastrarEndereco } from "../interfaces/interfacesEndereco";
import { enderecoRepository } from "../repository/enderecoRepository";

export class EnderecoDAO {

  async criar({ codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep }: ICadastrarEndereco): Promise<any> {

    const existeBairro = await bairroRepository.find({
      where: {
        codigoBairro
      }
    })

    if (!existeBairro) throw new AppError(`O codigoBairro ${codigoBairro} não existe no sistema, isira um código válido.`)

    const queryRunner = AppDataSource.createQueryRunner()

    await queryRunner.connect()

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

  async deletarVarios(enderecos: Array<number>) {
    await enderecoRepository.delete(enderecos);
  }

  async alterar({ codigoEndereco, codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep }: IAlterarEndereco): Promise<void> {

    let endereco: any = await enderecoRepository.findOne({
      where: {
        codigoEndereco,
      }
    })
    if (!endereco) return

    endereco.codigoBairro = codigoBairro
    endereco.codigoPessoa = codigoPessoa
    endereco.nomeRua = nomeRua
    endereco.numero = numero
    endereco.complemento = complemento
    endereco.cep = cep
    console.log(endereco)
    await enderecoRepository.save(endereco)
  }

  async alterarVarios(enderecos: Array<any>) {
    for (let endereco of enderecos) {
      let { codigoEndereco, nomeRua, numero, complemento, cep, codigoBairro, codigoPessoa } = endereco
      await this.alterar({ codigoEndereco, codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep })
    }
  }
}
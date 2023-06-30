import { AppDataSource } from "../../data-source";
import { EnderecoDAO } from "../../endereco/DAO/enderecoDAO";
import { enderecoRepository } from "../../endereco/repository/enderecoRepository";
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
    const retorno = await this.pesquisa({})
    if (!retorno) throw new AppError("O pessoa foi cadastrado, porém não foi possível endontrar o retorno desejado")
    return retorno;
  }

  async pesquisa(dados: any): Promise<Array<any>> {
    let count = 0;
    let keys = 0;
    let resultado: any;
    for (let key in dados) {
      if (key === "codigoPessoa") count++
      keys++
    }
    if (count !== 1 && keys !== 1) {
      resultado = await pessoaRepository.find({
        where: dados,
        order: {
          codigoPessoa: "DESC"
        }
      })
      for (let item of resultado) {
        item.enderecos = []
      }
    } else {
      resultado = await pessoaRepository.find({
        where: dados,
        relations: {
          tbEnderecos: {
            codigoBairro: {
              codigoMunicipio: {
                codigoUF: true
              }
            }
          }
        }
      });
      resultado = resultado[0]
      resultado.enderecos = resultado.tbEnderecos
      delete resultado.tbEnderecos
      let arrayEnderecos = resultado.enderecos
      for (let item of arrayEnderecos) {
        item.codigoPessoa = resultado.codigoPessoa
        item.bairro = item.codigoBairro
        item.codigoBairro = item.bairro.codigoBairro
        item.bairro.municipio = item.bairro.codigoMunicipio
        item.bairro.codigoMunicipio = item.bairro.municipio.codigoMunicipio
        item.bairro.municipio.uf = item.bairro.municipio.codigoUF
        item.bairro.municipio.codigoUF = item.bairro.municipio.uf.codigoUF
      }
    }

    if (!resultado) throw new AppError("Não foi possível consultar o pessoa no banco de dados.", 404)
    return resultado;
  }

  async alterar({ codigoPessoa, nome, sobrenome, idade, login, senha, status, enderecos }: IAlterarPessoa): Promise<Array<any>> {
    const loginJaExiste = await pessoaRepository.findOne({
      where: {
        login,
      }
    })
    if (loginJaExiste !== null && loginJaExiste.codigoPessoa !== codigoPessoa) throw new AppError(`O login ${login} já está em uso.`)

    const pessoa = await pessoaRepository.findOne({
      where: {
        codigoPessoa,
      }
    })
    if (!pessoa) throw new AppError("Por favor insira um código de pessoa válido.")

    pessoa.nome = nome
    pessoa.sobrenome = sobrenome
    pessoa.idade = idade
    pessoa.login = login
    pessoa.senha = senha
    pessoa.status = status

    const salvarPessoa = await pessoaRepository.save(pessoa)
    if (!salvarPessoa) throw new AppError("Não foi possível alterar o registro")

    let enderecosAtuais: any = await this.pesquisa({ codigoPessoa: pessoa.codigoPessoa })
    enderecosAtuais = enderecosAtuais.enderecos
    let enderecosParaDeletar: Array<any> = []
    let enderecosParaIncluir: Array<any> = []
    let enderecosParaAlterar: Array<any> = []
    let controle: Array<any> = []
    for (let endereco of enderecos) {
      if (endereco.codigoEndereco === undefined) {
        enderecosParaIncluir.push(endereco)
      } else {
        controle[endereco.codigoEndereco] = 1
        enderecosParaAlterar.push(endereco)
      }
    }
    for (let endereco of enderecosAtuais) {
      if (controle[endereco.codigoEndereco] !== 1) {
        enderecosParaDeletar.push(endereco.codigoEndereco)
      }
    }

    const enderecoDAO = new EnderecoDAO()
    if (enderecosParaDeletar.length > 0) {
      await enderecoDAO.deletarVarios(enderecosParaDeletar)
    }
    if (enderecosParaIncluir.length > 0) {
      for (let endereco of enderecosParaIncluir) {
        let { codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep } = endereco
        await enderecoDAO.criar({ codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep })
      }
    }
    if (enderecosParaAlterar.length > 0) {
      await enderecoDAO.alterarVarios(enderecosParaAlterar)
    }
    const retorno = await this.pesquisa({})
    if (!retorno) throw new AppError("O pessoa foi cadastrado, porém não foi possível endontrar o retorno desejado")
    return retorno;
  }
}
import { compare, hash } from "bcrypt";
import { AppDataSource } from "../../data-source";
import { EnderecoDAO } from "../../endereco/DAO/enderecoDAO";
import { enderecoRepository } from "../../endereco/repository/enderecoRepository";
import AppError from "../../shared/errors/AppErrors";
import { IAlterarPessoa, ICadastrarPessoa, ILogin } from "../interfaces/interfacesPessoa";
import { pessoaRepository } from "../repository/pessoaRepository";

export class PessoaDAO {

  async criar({ nome, sobrenome, idade, login, senha, status, enderecos }: ICadastrarPessoa): Promise<any> {
    const existeLogin = await pessoaRepository.findOne({
      where: {
        login,
      }
    })

    if (existeLogin) {
      throw new AppError(`Este login, ${login}, já está em uso. Insira um login diferente.`);
    }

    const queryRunner = AppDataSource.createQueryRunner();

    senha = await encriptar(senha);

    await queryRunner.connect();

    const resultado = await queryRunner.manager.query(`INSERT INTO TB_PESSOA (CODIGO_PESSOA ,NOME, SOBRENOME, IDADE, LOGIN, SENHA, STATUS) VALUES (SEQUENCE_PESSOA.nextval, '${nome}', '${sobrenome}', '${idade}', '${login}', '${senha}', ${status})`);

    await queryRunner.release();

    if (!resultado) {
      throw new AppError("Não foi possível incluir esse cadastro no banco de dados.", 404);
    }

    let codigoPessoa: any = await pessoaRepository.find({
      order: {
        codigoPessoa: "DESC",
      }
    });

    codigoPessoa = codigoPessoa[0].codigoPessoa;

    const enderecoDAO = new EnderecoDAO();

    for (let endereco of enderecos) {
      let codigoBairro = Number(endereco.codigoBairro);
      let nomeRua = endereco.nomeRua.toString();
      let numero = endereco.numero.toString();
      let complemento = endereco.complemento.toString();
      let cep = endereco.cep.toString();
      await enderecoDAO.criar({ codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep });
    }

    const retorno = await this.pesquisa({});

    if (!retorno) {
      throw new AppError("O pessoa foi cadastrado, porém não foi possível endontrar o retorno desejado");
    }

    return retorno;
  }

  async pesquisa(dados: any): Promise<Array<any>> {
    const { codigoPessoa, login, status } = dados;

    let resultado: any;

    if (codigoPessoa !== undefined && login === undefined && status === undefined) {

      resultado = await pessoaRepository.find({
        where: {
          codigoPessoa,
        },
        relations: {
          tbEnderecos: {
            codigoBairro: {
              codigoMunicipio: {
                codigoUF: true,
              }
            }
          }
        }
      });

      if (resultado.length > 0) {
        resultado = resultado[0];
        resultado.enderecos = resultado.tbEnderecos;
        delete resultado.tbEnderecos;
        let arrayEnderecos = resultado.enderecos;

        for (let item of arrayEnderecos) {
          item.codigoPessoa = resultado.codigoPessoa;
          item.bairro = item.codigoBairro;
          item.codigoBairro = item.bairro.codigoBairro;
          item.bairro.municipio = item.bairro.codigoMunicipio;
          item.bairro.codigoMunicipio = item.bairro.municipio.codigoMunicipio;
          item.bairro.municipio.uf = item.bairro.municipio.codigoUF;
          item.bairro.municipio.codigoUF = item.bairro.municipio.uf.codigoUF;
        }

      }
    } else {
      resultado = await pessoaRepository.find({
        where: dados,
        order: {
          codigoPessoa: "DESC",
        }
      })

      for (let item of resultado) {
        item.enderecos = [];
      }
    }

    if (!resultado) {
      throw new AppError("Não foi possível consultar o pessoa no banco de dados.", 404);
    }
    return resultado;
  }

  async alterar({ codigoPessoa, nome, sobrenome, idade, login, senha, status, enderecos }: IAlterarPessoa): Promise<Array<any>> {
    const loginJaExiste = await pessoaRepository.findOne({
      where: {
        login,
      }
    })

    if (loginJaExiste !== null && loginJaExiste.codigoPessoa !== codigoPessoa) {
      throw new AppError(`O login ${login} já está em uso.`);
    }

    const pessoa = await pessoaRepository.findOne({
      where: {
        codigoPessoa,
      }
    });

    if (!pessoa) {
      throw new AppError("Por favor insira um código de pessoa válido.");
    }

    senha = await encriptar(senha);

    pessoa.nome = nome;
    pessoa.sobrenome = sobrenome;
    pessoa.idade = idade;
    pessoa.login = login;
    pessoa.senha = senha;
    pessoa.status = status;

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();

    const salvarPessoa = await queryRunner.manager.query(`UPDATE TB_PESSOA SET NOME='${nome}', SOBRENOME='${sobrenome}', IDADE=${idade}, LOGIN='${login}', SENHA='${senha}', STATUS=${status} WHERE CODIGO_PESSOA=${codigoPessoa}`);

    await queryRunner.release();

    if (!salvarPessoa) {
      throw new AppError("Não foi possível alterar o registro");
    }

    let enderecosAtuais: any = await this.pesquisa({ codigoPessoa: pessoa.codigoPessoa });

    enderecosAtuais = enderecosAtuais.enderecos;

    let enderecosParaDeletar: Array<any> = [];
    let enderecosParaIncluir: Array<any> = [];
    let enderecosParaAlterar: Array<any> = [];
    let controle: Array<any> = [];

    for (let endereco of enderecos) {
      if (endereco.codigoEndereco === undefined) {
        enderecosParaIncluir.push(endereco);
      } else {
        controle[endereco.codigoEndereco] = 1;
        enderecosParaAlterar.push(endereco);
      }
    }

    for (let endereco of enderecosAtuais) {
      if (controle[endereco.codigoEndereco] !== 1) {
        enderecosParaDeletar.push(endereco.codigoEndereco);
      }

    }

    const enderecoDAO = new EnderecoDAO();

    if (enderecosParaDeletar.length > 0) {
      await enderecoDAO.deletarVarios(enderecosParaDeletar);
    }

    if (enderecosParaIncluir.length > 0) {
      for (let endereco of enderecosParaIncluir) {

        let { codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep } = endereco;
        await enderecoDAO.criar({ codigoPessoa, codigoBairro, nomeRua, numero, complemento, cep });
      }
    }

    if (enderecosParaAlterar.length > 0) {
      await enderecoDAO.alterarVarios(enderecosParaAlterar);
    }

    const retorno = await this.pesquisa({});

    if (!retorno) throw new AppError("O pessoa foi cadastrado, porém não foi possível endontrar o retorno desejado");

    return retorno;
  }

  async deletar(codigoPessoa: number) {
    const existePessoa = await pessoaRepository.findOne({
      where: {
        codigoPessoa,
      }
    });

    if (!existePessoa) {
      throw new AppError("Insira um código de pessoa válido.");
    }

    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();

    const enderecos = await queryRunner.manager.query(`SELECT * FROM TB_ENDERECO WHERE CODIGO_PESSOA=${codigoPessoa}`);

    await queryRunner.release();

    let codigosEnderecos = [];

    for (let endereco of enderecos) {
      codigosEnderecos.push(endereco.CODIGO_ENDERECO);
    }

    if (codigosEnderecos.length > 0) {
      await enderecoRepository.delete(codigosEnderecos);
    }

    await pessoaRepository.delete({ codigoPessoa });

    return true;
  }

  async login({ login, senha }: ILogin) {
    const pessoa: any = await pessoaRepository.findOne({
      where: {
        login,
      }
    })

    if (!pessoa) {
      throw new AppError("Login ou senha incorretos");
    }
    senha = await encriptar(senha);

    const senhaValida = senha === pessoa.senha ? true : false;

    if (!senhaValida) {
      throw new AppError("Login ou senha incorretos");
    }

    return ({ nome: pessoa.nome, login: pessoa.login });
  }
}

async function encriptar(senha: string) {
  return (senha + process.env.JWT_ACCESS_SECRET);
}
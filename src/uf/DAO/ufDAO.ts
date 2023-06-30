import { bairroRepository } from "../../bairro/repository/bairroRepository";
import { AppDataSource } from "../../data-source";
import { enderecoRepository } from "../../endereco/repository/enderecoRepository";
import { TbBairro } from "../../entities/TbBairro";
import { MunicipioDAO } from "../../municipio/DAO/municipioDAO";
import { municipioRepository } from "../../municipio/repository/municipioRepository";
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

  async deletar(codigoUF: number) {
    const queryRunner = AppDataSource.createQueryRunner()
    const municipios = await queryRunner.manager.query(`SELECT * FROM TB_MUNICIPIO WHERE CODIGO_UF=${codigoUF}`)
    let codigosMunicipios = []
    let bairros = []
    let codigosBairros = []
    let enderecos = []
    let codigosEnderecos = []

    for (let municipio of municipios) {
      codigosMunicipios.push(municipio.CODIGO_MUNICIPIO)
      let res = await queryRunner.manager.query(`SELECT * FROM TB_BAIRRO WHERE CODIGO_MUNICIPIO=${municipio.CODIGO_MUNICIPIO}`)
      if (res.length > 0) {
        bairros.push(res)
      }
    }
    for (let item of bairros) {
      for (let bairro of item) {
        codigosBairros.push(bairro.CODIGO_BAIRRO)
        let res = await queryRunner.manager.query(`SELECT * FROM TB_ENDERECO WHERE CODIGO_BAIRRO=${bairro.CODIGO_BAIRRO}`)
        if (res.length > 0) {
          enderecos.push(res)
        }
      }
    }
    for (let item of enderecos) {
      for (let endereco of item) {
        codigosEnderecos.push(endereco.CODIGO_ENDERECO)
      }
    }
    await enderecoRepository.delete(codigosEnderecos)
    await bairroRepository.delete(codigosBairros)
    await municipioRepository.delete(codigosMunicipios)
    await ufRepository.delete({ codigoUF })
    return true
  }
}
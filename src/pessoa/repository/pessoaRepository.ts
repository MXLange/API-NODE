import { AppDataSource } from "../../data-source";
import { TbPessoa } from "../../entities/TbPessoa";

export const pessoaRepository = AppDataSource.getRepository(TbPessoa);
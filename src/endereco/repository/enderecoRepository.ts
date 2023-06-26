import { AppDataSource } from "../../data-source";
import { TbEndereco } from "../../entities/TbEndereco";


export const enderecoRepository = AppDataSource.getRepository(TbEndereco);
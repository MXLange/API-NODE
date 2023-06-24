import { AppDataSource } from "../../data-source";
import { TbBairro } from "../../entities/TbBairro";


export const bairroRepository = AppDataSource.getRepository(TbBairro);
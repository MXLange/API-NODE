import { AppDataSource } from "../../data-source";
import { TbUf } from "../../entities/TbUf";

export const ufRepository = AppDataSource.getRepository(TbUf);
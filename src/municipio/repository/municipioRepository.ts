import { AppDataSource } from "../../data-source";
import { TbMunicipio } from "../../entities/TbMunicipio";

export const municipioRepository = AppDataSource.getRepository(TbMunicipio);
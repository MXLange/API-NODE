import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TbBairro } from "./TbBairro";
import { TbUf } from "./TbUf";

@Index("TB_MUNICIPIO_PK", ["codigoMunicipio"], { unique: true })
@Entity("TB_MUNICIPIO")
export class TbMunicipio {
  @Column("number", {
    primary: true,
    name: "CODIGO_MUNICIPIO",
    precision: 9,
    scale: 0,
  })
  codigoMunicipio: number;

  @Column("varchar2", { name: "NOME", nullable: true, length: 256 })
  nome: string | null;

  @Column("number", { name: "STATUS", nullable: true, precision: 3, scale: 0 })
  status: number | null;

  @OneToMany(() => TbBairro, (tbBairro) => tbBairro.codigoMunicipio)
  tbBairros: TbBairro[];

  @ManyToOne(() => TbUf, (tbUf) => tbUf.tbMunicipios)
  @JoinColumn([{ name: "CODIGO_UF", referencedColumnName: "codigoUF" }])
  codigoUF: TbUf;
}

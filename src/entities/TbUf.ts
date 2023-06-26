import { Column, Entity, Index, OneToMany } from "typeorm";
import { TbMunicipio } from "./TbMunicipio";

@Index("TB_UF_PK", ["codigoUF"], { unique: true })
@Entity("TB_UF")
export class TbUf {
  @Column("number", {
    primary: true,
    name: "CODIGO_UF",
    precision: 9,
    scale: 0,
  })
  codigoUF: number;

  @Column("varchar2", { name: "SIGLA", length: 3 })
  sigla: string;

  @Column("varchar2", { name: "NOME", length: 60 })
  nome: string;

  @Column("number", { name: "STATUS", precision: 3, scale: 0 })
  status: number;

  @OneToMany(() => TbMunicipio, (tbMunicipio) => tbMunicipio.codigoUF)
  tbMunicipios: TbMunicipio[];
}

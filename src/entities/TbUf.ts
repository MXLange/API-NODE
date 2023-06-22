import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TbMunicipio } from "./TbMunicipio";
import { NextVal } from "typeorm-sequence";

@Index("TB_UF_PK", ["codigoUf"], { unique: true })
@Entity("TB_UF")
export class TbUf {
  @Column("number", {
    primary: true,
    name: "CODIGO_UF",
    precision: 9,
    scale: 0,
  })
  @NextVal("SEQUENCE_UF")
  codigoUf: number;

  @Column("varchar2", { name: "SIGLA", length: 3 })
  sigla: string;

  @Column("varchar2", { name: "NOME", length: 60 })
  nome: string;

  @Column("number", { name: "STATUS", precision: 3, scale: 0 })
  status: number;

  @OneToMany(() => TbMunicipio, (tbMunicipio) => tbMunicipio.codigoUf)
  tbMunicipios: TbMunicipio[];
}

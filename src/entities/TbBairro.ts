import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TbMunicipio } from "./TbMunicipio";
import { TbEndereco } from "./TbEndereco";

@Index("TB_BAIRRO_PK", ["codigoBairro"], { unique: true })
@Entity("TB_BAIRRO")
export class TbBairro {
  @Column("number", {
    primary: true,
    name: "CODIGO_BAIRRO",
    precision: 9,
    scale: 0,
  })
  codigoBairro: number;

  @Column("varchar2", { name: "NOME", length: 256 })
  nome: string;

  @Column("number", { name: "STATUS", nullable: true, precision: 3, scale: 0 })
  status: number | null;

  @ManyToOne(() => TbMunicipio, (tbMunicipio) => tbMunicipio.tbBairros)
  @JoinColumn([
    { name: "CODIGO_MUNICIPIO", referencedColumnName: "codigoMunicipio" },
  ])
  codigoMunicipio: TbMunicipio;

  @OneToMany(() => TbEndereco, (tbEndereco) => tbEndereco.codigoBairro)
  tbEnderecos: TbEndereco[];
}

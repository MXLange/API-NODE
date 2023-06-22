import { Column, Entity, Index, OneToMany } from "typeorm";
import { TbEndereco } from "./TbEndereco";

@Index("TB_PESSOA_PK", ["codigoPessoa"], { unique: true })
@Entity("TB_PESSOA")
export class TbPessoa {
  @Column("number", {
    primary: true,
    name: "CODIGO_PESSOA",
    precision: 9,
    scale: 0,
  })
  codigoPessoa: number;

  @Column("varchar2", { name: "NOME", length: 256 })
  nome: string;

  @Column("varchar2", { name: "SOBRENOME", length: 256 })
  sobrenome: string;

  @Column("number", { name: "IDADE", precision: 3, scale: 0 })
  idade: number;

  @Column("varchar2", { name: "LOGIN", length: 50 })
  login: string;

  @Column("varchar2", { name: "SENHA", length: 50 })
  senha: string;

  @Column("number", { name: "STATUS", precision: 3, scale: 0 })
  status: number;

  @OneToMany(() => TbEndereco, (tbEndereco) => tbEndereco.codigoPessoa)
  tbEnderecos: TbEndereco[];
}

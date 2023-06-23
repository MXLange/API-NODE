import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbPessoa } from "./TbPessoa";
import { TbBairro } from "./TbBairro";

@Index("TB_ENDERECO_PK", ["codigoEndereco"], { unique: true })
@Entity("TB_ENDERECO")
export class TbEndereco {
  @Column("number", {
    primary: true,
    name: "CODIGO_ENDERECO",
    precision: 9,
    scale: 0,
  })
  codigoEndereco: number;

  @Column("varchar2", { name: "NOME_RUA", length: 256 })
  nomeRua: string;

  @Column("varchar2", { name: "NUMERO", length: 10 })
  numero: string;

  @Column("varchar2", { name: "COMPLEMENTO", nullable: true, length: 20 })
  complemento: string | null;

  @Column("varchar2", { name: "CEP", length: 10 })
  cep: string;

  @ManyToOne(() => TbPessoa, (tbPessoa) => tbPessoa.tbEnderecos)
  @JoinColumn([{ name: "CODIGO_PESSOA", referencedColumnName: "codigoPessoa" }])
  codigoPessoa: TbPessoa;

  @ManyToOne(() => TbBairro, (tbBairro) => tbBairro.tbEnderecos)
  @JoinColumn([{ name: "CODIGO_BAIRRO", referencedColumnName: "codigoBairro" }])
  codigoBairro: TbBairro;
}

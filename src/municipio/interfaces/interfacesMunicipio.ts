export interface ICadastrarMunicipio {
  codigoUF: number;
  nome: string;
  status: number;
}

export interface IAlterarMunicipio {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;
}

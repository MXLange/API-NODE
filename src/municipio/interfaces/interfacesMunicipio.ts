export interface ICadastrarMunicipio {
  codigoUF: number;
  nome: string;
  status: number;
}

export interface IAlterarMunicipio {
  codigoMunicipio: number;
  codigoUF: string;
  nome: string;
  status: number;
}

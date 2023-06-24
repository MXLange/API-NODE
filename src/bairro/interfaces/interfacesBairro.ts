export interface ICadastrarBairro {
  codigoMunicipio: number;
  nome: string;
  status: number;
}

export interface IAlterarBairro {
  codigoBairro: number;
  codigoMunicipio: number;
  nome: string;
  status: number;
}

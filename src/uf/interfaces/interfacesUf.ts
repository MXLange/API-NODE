export interface ICadastrarUf {
  sigla: string;
  nome: string;
  status: number;
}

export interface IAlterarUf {
  codigoUf: number;
  sigla: string;
  nome: string;
  status: number;
}

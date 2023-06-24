export interface ICadastrarUf {
  sigla: string;
  nome: string;
  status: number;
}

export interface IAlterarUf {
  codigoUF: number;
  sigla: string;
  nome: string;
  status: number;
}

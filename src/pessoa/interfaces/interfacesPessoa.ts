export interface ICadastrarPessoa {
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Array<any>;
}

export interface IAlterarPessoa {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Array<any>;
}

export interface ILogin {
  login: string;
  senha: string;
}

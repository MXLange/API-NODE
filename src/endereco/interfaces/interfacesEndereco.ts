export interface ICadastrarEndereco {
  codigoPessoa: number;
  codigoBairro: number;
  nomeRua: string;
  numero: string;
  complemento: string;
  cep: string;

}

export interface IAlterarEndereco {
  codigoEndereco: number;
  codigoPessosa: number;
  codigoBairro: number;
  nomeRua: string;
  numero: string;
  complemento: string;
  cep: string;
}

export interface Dia {
  dia: number;
  titulo: string;
  teoria: string;
  topicos: string[];
  exercicio: string;
  codigoInicial?: string;
  codigoSolucao?: string;
}

export interface Semana {
  semana: number;
  titulo: string;
  descricao: string;
  dias: Dia[];
  miniProjeto: {
    titulo: string;
    descricao: string;
    requisitos: string[];
  };
}

export interface Progresso {
  diasConcluidos: string[];
  dataInicio: string | null;
  observacoes: Record<string, string>;
  datasEstudo: string[];
}
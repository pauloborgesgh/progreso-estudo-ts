export interface Topico {
  titulo: string;
  descricao: string;
  exemplo?: string;
}

export interface Dia {
  dia: number;
  titulo: string;
  teoria: string;
  topicos: Topico[];
  exercicio: string;
  codigoInicial?: string;
  codigoSolucao?: string;
}

export interface Semana {
  semana: number;
  titulo: string;
  descricao: string;
  instrucoes: string;
  dias: Dia[];
  miniProjeto: {
    titulo: string;
    descricao: string;
    requisitos: string[];
  };
}

export type CursoId = 'ts' | 'js';

export interface Progresso {
  diasConcluidos: string[];
  dataInicio: string | null;
  observacoes: Record<string, string>;
  observacoesTopicos: Record<string, string>;
  codigosUsuario: Record<string, string>;
  datasEstudo: string[];
}

export const cursos: { id: CursoId; nome: string; semanas: number; totalDias: number; cor: string }[] = [
  { id: 'ts', nome: 'TypeScript', semanas: 6, totalDias: 30, cor: 'blue' },
  { id: 'js', nome: 'JavaScript', semanas: 10, totalDias: 50, cor: 'yellow' },
];
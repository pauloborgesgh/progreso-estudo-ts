import type { Semana } from '../types/study';

export const planoEstudo: Semana[] = [
  {
    semana: 1,
    titulo: 'Tipos Básicos e Configuração',
    descricao: 'Aprenda os tipos fundamentais do TypeScript e configure seu ambiente',
    dias: [
      {
        dia: 1,
        titulo: 'Introdução ao TypeScript',
        teoria: 'TypeScript é um superset do JavaScript que adiciona tipos estáticos. Foi criado pela Microsoft em 2012 para tornar o desenvolvimento JavaScript mais robusto e escalável.',
        topicos: [
          'O que é TypeScript e por que usar',
          'Diferença entre TS e JS',
          'Instalação e configuração',
          'Compilação com tsc'
        ],
        exercicio: 'Configure um projeto TypeScript do zero, compile um arquivo .ts e execute no navegador.'
      },
      {
        dia: 2,
        titulo: 'Tipos Primitivos',
        teoria: 'TypeScript suporta os mesmos tipos primitivos do JavaScript mais anotações de tipo: string, number, boolean, null e undefined.',
        topicos: [
          'string, number, boolean',
          'null e undefined',
          'Annotations vs Inference',
          'Tipo any e unknown'
        ],
        exercicio: 'Crie variáveis com diferentes tipos primitivos e use anotações explícitas.',
        codigoInicial: `// Declare variáveis com tipos explícitos\nlet nome: string;\nlet idade: number;\nlet ativo: boolean;`,
        codigoSolucao: `let nome: string = "Paulo";\nlet idade: number = 25;\nlet ativo: boolean = true;\n\n// Type inference\let cidade = "São Paulo"; // inferido como string\n\n// Evite usar 'any'\nlet dado: unknown = "texto";\nif (typeof dado === "string") {\n  console.log(dado.toUpperCase());\n}`
      },
      {
        dia: 3,
        titulo: 'Arrays e Tuplas',
        teoria: 'Arrays em TypeScript podem ser tipados de duas formas: array<T> ou T[]. Tuplas permitem arrays com tamanho fixo e tipos específicos.',
        topicos: [
          'Arrays tipados',
          'Sintaxe Array<T> e T[]',
          'Tuplas (tuples)',
          'Operações básicas com arrays'
        ],
        exercicio: 'Crie arrays de diferentes tipos e uma tupla para representar coordenadas.',
        codigoInicial: `// Array de números\nconst numeros: number[] = [];\n\n// Como tipar um array?\nconst nomes = [];`,
        codigoSolucao: `const numeros: number[] = [1, 2, 3, 4, 5];\nconst nomes: Array<string> = ["Ana", "Bruno", "Carlos"];\n\n// Tupla: coordenadas (x, y)\nconst ponto: [number, number] = [10, 20];\n\n// Tupla com tipos diferentes\nconst usuario: [string, number, boolean] = ["Maria", 30, true];`
      },
      {
        dia: 4,
        titulo: 'Enums e Types',
        teoria: 'Enums permitem definir um conjunto de constantes nomeadas. Type aliases (type) permitem criar nomes para tipos complexos.',
        topicos: [
          'Enums numéricos e string',
          'Type aliases',
          'Union types',
          'Literal types'
        ],
        exercicio: 'Crie um Enum para dias da semana e um type para status de usuário.',
        codigoInicial: `// Como representar status de um usuário?\n// pending, approved, rejected\n\n// Como representar cores?\n// red, green, blue, yellow`,
        codigoSolucao: `enum StatusUsuario {\n  Pendente = "PENDING",\n  Aprovado = "APPROVED",\n  Rejeitado = "REJECTED"\n}\n\nenum Cor {\n  Vermelho,\n  Verde,\n  Azul\n}\n\ntype StatusLogin = "sucesso" | "falha" | "pendente";\ntype UsuarioID = string | number;`
      },
      {
        dia: 5,
        titulo: 'Interfaces Básicas',
        teoria: 'Interfaces definem a estrutura que um objeto deve seguir. São fundamentais para garantir consistência nos dados.',
        topicos: [
          'Declarando interfaces',
          'Propriedades opcionais',
          'Propriedades readonly',
          'Objetos anônimos'
        ],
        exercicio: 'Crie uma interface para um produto de e-commerce com validação de tipos.',
        codigoInicial: `// Defina uma interface para um produto\n// com nome, preço, categoria e se está em estoque`,
        codigoSolucao: `interface Produto {\n  readonly id: string;\n  nome: string;\n  preco: number;\n  categoria: string;\n  emEstoque: boolean;\n  descricao?: string; // opcional\n}\n\nconst produto: Produto = {\n  id: "p001",\n  nome: "Notebook",\n  preco: 3500,\n  categoria: "Eletrônicos",\n  emEstoque: true\n};`
      }
    ],
    miniProjeto: {
      titulo: 'Sistema de Cadastro de Produtos',
      descricao: 'Crie um sistema simples de cadastro de produtos com validação de tipos',
      requisitos: [
        'Interface Produto com validação',
        'Lista de produtos tipada',
        'Função para adicionar produto',
        'Função para filtrar por preço',
        'Compilação sem erros'
      ]
    }
  },
  {
    semana: 2,
    titulo: 'Interfaces e Funções Tipadas',
    descricao: 'Aprofunde em interfaces e aprenda a tipar funções',
    dias: [
      {
        dia: 1,
        titulo: 'Interfaces com Métodos',
        teoria: 'Interfaces podem definir não apenas propriedades, mas também métodos. Isso permite criar contratos para classes e objetos.',
        topicos: [
          'Métodos em interfaces',
          'Parâmetros e retorno tipados',
          'this em interfaces',
          'Callable interfaces'
        ],
        exercicio: 'Crie uma interface Calculadora com operações matemáticas.'
      },
      {
        dia: 2,
        titulo: 'Interfaces Avançadas',
        teoria: 'TypeScript permite estender interfaces, criar interfaces híbridas e usar intersecção de tipos.',
        topicos: [
          'Herança de interfaces (extends)',
          'Intersecção de tipos (&)',
          'Interface vs Type alias',
          'Duck typing'
        ],
        exercicio: 'Crie interfaces herdadas para um sistema de персонажи de jogo.'
      },
      {
        dia: 3,
        titulo: 'Funções: Parâmetros e Retorno',
        teoria: 'Funções em TypeScript podem ter tipos explícitos nos parâmetros e no retorno. Isso previne erros em tempo de desenvolvimento.',
        topicos: [
          'Tipagem de parâmetros',
          'Parâmetros opcionais',
          'Valores padrão',
          'Tipo de retorno'
        ],
        exercicio: 'Implemente funções utilitárias com tipos corretos.',
        codigoInicial: `function saudar(nome, idade) {\n  return "Olá " + nome + ", você tem " + idade;\n}`,
        codigoSolucao: `function saudar(nome: string, idade: number): string {\n  return \`Olá \${nome}, você tem \${idade} anos\`;\n}\n\nfunction somar(a: number, b: number = 0): number {\n  return a + b;\n}\n\nfunction buscarUsuario(id: string): { nome: string; email: string } | null {\n  return null;\n}`
      },
      {
        dia: 4,
        titulo: 'Funções: Overloads e Callbacks',
        teoria: 'Function overloads permitem múltiplas assinaturas. Callbacks são funções passadas como argumento.',
        topicos: [
          'Function overloads',
          'Parâmetros rest',
          'Typed callbacks',
          'this em funções'
        ],
        exercicio: 'Implemente uma função com overloads e um callback tipado.'
      },
      {
        dia: 5,
        titulo: 'Generics em Funções',
        teoria: 'Generics permitem criar funções reutilizáveis que funcionam com múltiplos tipos mantendo a segurança de tipos.',
        topicos: [
          'Introdução a generics',
          'Generic functions',
          'Constraints (limitações)',
          'infer keyword'
        ],
        exercicio: 'Crie funções genéricas para manipulação de arrays.',
        codigoInicial: `// Como criar uma função que retorna o primeiro elemento de qualquer array?`,
        codigoSolucao: `function primeiro<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nfunction agrupar<T, K extends keyof T>(arr: T[], chave: K): Record<string, T[]> {\n  return arr.reduce((acc, item) => {\n    const key = String(item[chave]);\n    (acc[key] ??= []).push(item);\n    return acc;\n  }, {} as Record<string, T[]>);\n}\n\nconst nums = primeiro([1, 2, 3]); // number | undefined\nconst strs = primeiro(["a", "b", "c"]); // string | undefined`
      }
    ],
    miniProjeto: {
      titulo: 'Biblioteca de Funções Utilitárias',
      descricao: 'Crie uma biblioteca com funções tipadas para manipulação de dados',
      requisitos: [
        'Função de ordenação genérica',
        'Função de filtro com predicate',
        'Função de agrupamento',
        'Função de redução tipada',
        'Testes com diferentes tipos'
      ]
    }
  },
  {
    semana: 3,
    titulo: 'Classes e POO',
    descricao: 'Aprenda orientação a objetos com TypeScript',
    dias: [
      {
        dia: 1,
        titulo: 'Classes Básicas',
        teoria: 'Classes sãotemplates para criar objetos. TypeScript adiciona tipagem forte a classes com modificadores de acesso.',
        topicos: [
          'Declarando classes',
          'Constructor',
          'Propriedades e métodos',
          'Instanciação'
        ],
        exercicio: 'Crie uma classe Pessoa com propriedades e métodos.',
        codigoInicial: `class Pessoa {\n  // Adicione nome, idade e método saudar()\n}\n\nconst p = new Pessoa();`,
        codigoSolucao: `class Pessoa {\n  nome: string;\n  idade: number;\n\n  constructor(nome: string, idade: number) {\n    this.nome = nome;\n    this.idade = idade;\n  }\n\n  saudar(): string {\n    return \`Olá, sou \${this.nome}!\`;\n  }\n}\n\nconst p = new Pessoa("Ana", 25);\nconsole.log(p.saudar()); // "Olá, sou Ana!"`
      },
      {
        dia: 2,
        titulo: 'Modificadores de Acesso',
        teoria: 'TypeScript oferece modificadores: public (padrão), private, protected e readonly para controlar encapsulamento.',
        topicos: [
          'public',
          'private',
          'protected',
          'readonly',
          'Parâmetros readonly no constructor'
        ],
        exercicio: 'Reescreva a classe Pessoa com modificadores de acesso.'
      },
      {
        dia: 3,
        titulo: 'Herança e Polimorfismo',
        teoria: 'Classes podem herdar de outras classes usando extends. Polimorfismo permite que subclasses sobrescrevam métodos.',
        topicos: [
          'extends',
          'super',
          'Override de métodos',
          'Abstract classes'
        ],
        exercicio: 'Crie uma hierarquia de classes: Animal -> Cachorro/Gato.',
        codigoInicial: `abstract class Animal {\n  // nome e método abstrato som()\n}\n\nclass Cachorro extends Animal {\n  // implemente som()\n}`,
        codigoSolucao: `abstract class Animal {\n  constructor(public nome: string) {}\n  abstract som(): string;\n}\n\nclass Cachorro extends Animal {\n  som(): string {\n    return \`\${this.nome} diz: Au au!\`;\n  }\n}\n\nclass Gato extends Animal {\n  som(): string {\n    return \`\${this.nome} diz: Miau!\`;\n  }\n}`
      },
      {
        dia: 4,
        titulo: 'Interfaces em Classes',
        teoria: 'Classes podem implementar interfaces com implements. Múltiplas interfaces podem ser implementadas.',
        topicos: [
          'implements',
          'Múltiplas interfaces',
          'Contratos em classes',
          'Duck typing com classes'
        ],
        exercicio: 'Crie interfaces Serializable e Loggable e implemente em uma classe.'
      },
      {
        dia: 5,
        titulo: 'Static e Mixins',
        teoria: 'Membros estáticos pertencem à classe e não às instâncias. Mixins permitem composição de classes.',
        topicos: [
          'Membros estáticos',
          'Static methods e properties',
          'Introdução a mixins',
          'Factory patterns'
        ],
        exercicio: 'Implemente uma classe utilitária com métodos estáticos.'
      }
    ],
    miniProjeto: {
      titulo: 'Sistema de Gestão de Funcionários',
      descricao: 'Crie um sistema de RH com classes para funcionários',
      requisitos: [
        'Classe base Funcionario',
        'Herança: Gerente, Desenvolvedor',
        'Interface Printable',
        'Métodos para calcular bônus',
        'Lista tipada de funcionários'
      ]
    }
  },
  {
    semana: 4,
    titulo: 'Generics',
    descricao: 'Domine generics para código reutilizável e type-safe',
    dias: [
      {
        dia: 1,
        titulo: 'Generics em Classes',
        teoria: 'Classes genéricas permitem criar estruturas de dados reutilizáveis com verificação de tipos em tempo de desenvolvimento.',
        topicos: [
          'Classes genéricas',
          'Restrições com constraints',
          'Default types',
          'new() constraint'
        ],
        exercicio: 'Implemente uma Stack (pilha) genérica.',
        codigoInicial: `// Implemente uma pilha (LIFO) genérica\nclass Stack<T> {\n  // push, pop, peek, isEmpty\n}`,
        codigoSolucao: `class Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n\n  peek(): T | undefined {\n    return this.items[this.items.length - 1];\n  }\n\n  isEmpty(): boolean {\n    return this.items.length === 0;\n  }\n}\n\nconst stack = new Stack<number>();\nstack.push(1);\nstack.push(2);\nconsole.log(stack.pop()); // 2`
      },
      {
        dia: 2,
        titulo: 'Generics com Múltiplos Parâmetros',
        teoria: 'Generics podem ter múltiplos parâmetros para criar estruturas mais complexas como Mapas ou Tuplas tipadas.',
        topicos: [
          'Múltiplos type parameters',
          'Generic constraints',
          ' keyof operator',
          'Mapped types'
        ],
        exercicio: 'Crie um dicionário genérico (chave-valor).'
      },
      {
        dia: 3,
        titulo: 'Utility Types',
        teoria: 'TypeScript oferece utility types prontos: Partial, Required, Pick, Omit, Record, etc.',
        topicos: [
          'Partial<T>',
          'Required<T>',
          'Pick<T, K>',
          'Omit<T, K>',
          'Record<K, V>'
        ],
        exercicio: 'Use utility types para transformar interfaces.',
        codigoInicial: `interface Usuario {\n  id: number;\n  nome: string;\n  email: string;\n  role: string;\n}\n\n// Crie: UsuarioParcial, UsuarioUpdate, UsuarioPublico`,
        codigoSolucao: `interface Usuario {\n  id: number;\n  nome: string;\n  email: string;\n  role: string;\n}\n\ntype UsuarioParcial = Partial<Usuario>;\ntype UsuarioObrigatorio = Required<Usuario>;\ntype UsuarioPublico = Omit<Usuario, "id" | "role">;\ntype CamposEdicao = Pick<Usuario, "nome" | "email">;\ntype UsuariosPorRole = Record<string, Usuario[]>;`
      },
      {
        dia: 4,
        titulo: 'Conditional Types',
        teoria: 'Conditional types permitem criar tipos que dependem de outros tipos, habilitando lógica tipográfica.',
        topicos: [
          'T extends U ? X : Y',
          'infer keyword',
          'Distributive conditional types',
          'Built-in conditional types'
        ],
        exercicio: 'Crie tipos condicionais para extrair tipos de funções.'
      },
      {
        dia: 5,
        titulo: 'Template Literal Types',
        teoria: 'Template literal types permitem criar strings literais com base em outros tipos, úteis para APIs e validação.',
        topicos: [
          'Template literals em tipos',
          'Inferência de eventos',
          'String manipulation',
          'Autocomplete em strings'
        ],
        exercicio: 'Crie um tipo para eventos de formulário.'
      }
    ],
    miniProjeto: {
      titulo: 'API Client Genérico',
      descricao: 'Crie um cliente de API com generics para diferentes endpoints',
      requisitos: [
        'Classe genérica ApiClient<T>',
        'Métodos CRUD tipados',
        'Response typing',
        'Error handling com tipos',
        'Exemplos com diferentes entidades'
      ]
    }
  },
  {
    semana: 5,
    titulo: 'Decorators e Módulos',
    descricao: 'Recursos avançados para código profissional',
    dias: [
      {
        dia: 1,
        titulo: 'Decorators: Introdução',
        teoria: 'Decorators são funções especiais que podem modificar classes, métodos e propriedades. São muito usados em frameworks como Angular.',
        topicos: [
          'O que são decorators',
          'Decorator factories',
          'Class decorators',
          'Experimental decorators'
        ],
        exercicio: 'Crie um decorator de logging para classes.',
        codigoInicial: `// Habilite experimentalDecorators no tsconfig\n// Crie um decorator que loga quando uma classe é instanciada`,
        codigoSolucao: `// tsconfig.json: "experimentalDecorators": true\n\nfunction Logger<T extends { new (...args: any[]): {} }>(constructor: T) {\n  return class extends constructor {\n    createdAt = new Date();\n    constructor(...args: any[]) {\n      super(...args);\n      console.log(\`\${constructor.name} instanciado em \${this.createdAt}\`);\n    }\n  };\n}\n\n@Logger\nclass Usuario {\n  constructor(public nome: string) {}\n}\n\nconst user = new Usuario("Ana"); // Log: "Usuario instanciado em [data]"`
      },
      {
        dia: 2,
        titulo: 'Decorators: Métodos e Properties',
        teoria: 'Decorators podem ser aplicados a métodos (method decorators) e propriedades (property decorators).',
        topicos: [
          'Method decorators',
          'Property decorators',
          'Accessor decorators',
          'Parameter decorators'
        ],
        exercicio: 'Crie um decorator @readonly para propriedades.'
      },
      {
        dia: 3,
        titulo: 'Módulos e Import/Export',
        teoria: 'TypeScript usa módulos ES6 para organizar código. Export e import permitem compartilhar tipos e valores.',
        topicos: [
          'ES Modules',
          'Export/Import',
          'Re-exporting',
          ' barrel files'
        ],
        exercicio: 'Organize o projeto em módulos.',
        codigoInicial: `// Arquivo: src/utils/math.ts\nexport function add(a: number, b: number): number {\n  return a + b;\n}\n\n// Arquivo: src/index.ts\n// Como importar a função?`,
        codigoSolucao: `// src/utils/math.ts\nexport function add(a: number, b: number): number {\n  return a + b;\n}\n\nexport const PI = 3.14159;\n\n// src/index.ts\nimport { add, PI } from './utils/math';\n\n// src/index.ts (com alias)\nimport * as math from './utils/math';\nmath.add(2, 3);`
      },
      {
        dia: 4,
        titulo: 'Namespaces',
        teoria: 'Namespaces são uma forma de organizar código globalmente (antes dos módulos ES6). Hoje são menos usados mas importante conhecer.',
        topicos: [
          'Declaration merging',
          'Namespaces vs Modules',
          'Quando usar cada um',
          'Triple-slash directives'
        ],
        exercicio: 'Converta um namespace para módulos ES6.'
      },
      {
        dia: 5,
        titulo: 'Type Definitions e d.ts',
        teoria: 'Arquivos .d.ts definem tipos para bibliotecas JavaScript. Permitem usar JS no TypeScript com tipagem completa.',
        topicos: [
          'Declaration files',
          'global vs module',
          'Ambient declarations',
          'DefinitelyTyped'
        ],
        exercicio: 'Crie declaração de tipos para uma biblioteca fictícia.'
      }
    ],
    miniProjeto: {
      titulo: 'Framework de Validação com Decorators',
      descricao: 'Crie um mini-framework de validação usando decorators',
      requisitos: [
        'Decorators: @required, @minLength, @pattern',
        'Validação automática em métodos',
        'Mensagens de erro customizadas',
        'Exemplo prático de uso',
        'Testes com diferentes cenários'
      ]
    }
  },
  {
    semana: 6,
    titulo: 'Projeto Final e Preparação para Angular',
    descricao: 'Aplique tudo aprendido em um projeto completo',
    dias: [
      {
        dia: 1,
        titulo: 'Arquitetura de Projeto',
        teoria: 'Organizar um projeto TypeScript profissional envolve estruturas de pastas, convenções e boas práticas.',
        topicos: [
          'Estrutura de pastas',
          'Barrel exports',
          'Configuração tsconfig',
          'Path aliases'
        ],
        exercicio: 'Configure um projeto com estrutura profissional.'
      },
      {
        dia: 2,
        titulo: 'Trabalhando com APIs',
        teoria: 'Consumir APIs em TypeScript requer tipagem de requests e responses. Axios e fetch podem ser fortemente tipados.',
        topicos: [
          'Typed fetch',
          'Generic API client',
          'Error handling tipado',
          'Type guards'
        ],
        exercicio: 'Implemente um cliente HTTP tipado.'
      },
      {
        dia: 3,
        titulo: 'Padrões de Projeto em TypeScript',
        teoria: 'Padrões como Factory, Singleton, Repository são essenciais para código escalável em TypeScript.',
        topicos: [
          'Factory Pattern',
          'Singleton',
          'Repository Pattern',
          'Dependency Injection'
        ],
        exercicio: 'Implemente o Repository Pattern para um CRUD.'
      },
      {
        dia: 4,
        titulo: 'Preparação: Angular e TypeScript',
        teoria: 'Angular usa TypeScript nativamente. Conhecer decorators, injeção de dependência e tipagem forte é essencial.',
        topicos: [
          'Angular CLI e TypeScript',
          'Decorators (@Component, @Injectable)',
          'Typing em templates',
          'RxJS e Generics'
        ],
        exercicio: 'Configure um mini-projeto Angular.'
      },
      {
        dia: 5,
        titulo: 'Projeto Final: Dashboard de Estudos',
        teoria: 'Vamos construir o projeto completo integrando todos os conceitos aprendidos ao longo do curso.',
        topicos: [
          'Integração de todos os conceitos',
          'Revisão geral',
          'TypeScript最佳 practices',
          'Próximos passos'
        ],
        exercicio: 'Complete o dashboard com todas as funcionalidades.'
      }
    ],
    miniProjeto: {
      titulo: 'Dashboard de Estudos TypeScript',
      descricao: 'Projeto completo integrando todos os conceitos aprendidos',
      requisitos: [
        'Sistema de progresso com persistência',
        'Interface tipada para dias e semanas',
        'Classes para gerenciamento de estado',
        'Generics para componentes reutilizáveis',
        'Decorators para logging e validação',
        'Módulos bem organizados'
      ]
    }
  }
];
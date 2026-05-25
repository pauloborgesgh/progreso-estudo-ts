import type { Semana } from '../types/study';

export const tsStudyPlan: Semana[] = [
  {
    semana: 1,
    titulo: 'Tipos Básicos e Configuração',
    descricao: 'Aprenda os tipos fundamentais do TypeScript e configure seu ambiente',
    instrucoes: 'Comece configurando seu ambiente TypeScript e explore os tipos fundamentais da linguagem. Para cada dia, leia a teoria primeiro, depois pratique com os exercícios propostos. Os tópicos do dia funcionam como um roteiro de estudos — estude cada um na ordem apresentada. Não se preocupe em decorar tudo de uma vez; o foco é entender os conceitos e aplicá-los nos códigos de exemplo. Ao final da semana, desafie-se com o mini-projeto para consolidar o aprendizado.',
    dias: [
      {
        dia: 1,
        titulo: 'Introdução ao TypeScript',
        teoria: 'TypeScript é um superset do JavaScript que adiciona tipos estáticos. Foi criado pela Microsoft em 2012 para tornar o desenvolvimento JavaScript mais robusto e escalável.',
        topicos: [
          { titulo: 'O que é TypeScript e por que usar', descricao: 'TypeScript é uma linguagem de programação criada pela Microsoft em 2012 que estende o JavaScript adicionando tipos estáticos opcionais. Ela permite detectar erros em tempo de desenvolvimento, antes mesmo de executar o código, tornando o desenvolvimento mais seguro e produtivo. Grandes empresas como Google, Airbnb e Slack utilizam TypeScript em seus projetos principais, o que demonstra sua confiabilidade e maturidade. Além disso, o TypeScript é a linguagem base do Angular e tem adoção crescente no ecossistema React e Node.js.', exemplo: 'const mensagem: string = "Olá, TypeScript!";' },
          { titulo: 'Diferença entre TS e JS', descricao: 'JavaScript é uma linguagem dinâmica onde os tipos das variáveis podem mudar livremente durante a execução, o que pode levar a erros inesperados. TypeScript adiciona uma camada de tipos que permite ao desenvolvedor especificar exatamente que tipo de dados cada variável, parâmetro ou retorno de função deve ter. Todo código TypeScript é compilado para JavaScript antes de ser executado, então o navegador ou Node.js executam JavaScript puro no final. A principal diferença prática é que TypeScript pega erros de tipo durante a digitação (no editor/compilador), enquanto JavaScript só descobriria esses erros em tempo de execução.', exemplo: 'let idade: number = 25; idade = "trinta"; // Erro de tipo' },
          { titulo: 'Instalação e configuração', descricao: 'Para começar com TypeScript, você precisa instalar o Node.js e depois usar o npm para instalar o compilador TypeScript globalmente com npm install -g typescript. O arquivo de configuração tsconfig.json controla como o compilador se comporta, definindo opções como diretório de saída, versão do ECMAScript, strict mode e muito mais. Você pode gerar um tsconfig.json automaticamente com tsc --init e depois ajustar as configurações conforme necessário. Uma configuração essencial é habilitar o strict: true para ativar todas as verificações rigorosas de tipo desde o início.', exemplo: '// npm install -g typescript && tsc --init' },
          { titulo: 'Compilação com tsc', descricao: 'O comando tsc (TypeScript Compiler) é a ferramenta que transforma código .ts em .js. Ao executar tsc sem argumentos, ele procura o arquivo tsconfig.json na raiz do projeto e compila todos os arquivos .ts de acordo com as configurações definidas. Você pode usar tsc --watch para ativar o modo observador, que recompila automaticamente sempre que um arquivo .ts é modificado. É importante entender que o TypeScript não executa código — ele apenas compila para JavaScript, e o JavaScript resultante é que será executado pelo navegador ou Node.js.', exemplo: '// tsc meuarquivo.ts && node meuarquivo.js' }
        ],
        exercicio: 'Configure um projeto TypeScript do zero, compile um arquivo .ts e execute no navegador.'
      },
      {
        dia: 2,
        titulo: 'Tipos Primitivos',
        teoria: 'TypeScript suporta os mesmos tipos primitivos do JavaScript mais anotações de tipo: string, number, boolean, null e undefined.',
        topicos: [
          { titulo: 'string, number, boolean', descricao: 'Esses são os três tipos primitivos mais usados no TypeScript, correspondendo aos mesmos tipos do JavaScript. string representa texto, number representa números (inteiros e decimais, não há distinção como em outras linguagens) e boolean representa verdadeiro/falso. A sintaxe de anotação de tipo usa dois pontos após o nome da variável: let nome: string = "João". O TypeScript também faz inferência de tipos, então se você atribuir um valor na declaração, ele deduz o tipo automaticamente.', exemplo: 'let produto: string = "Notebook"; let preco: number = 2499.90; let ativo: boolean = true;' },
          { titulo: 'null e undefined', descricao: 'Em TypeScript, null e undefined são tipos próprios que representam ausência de valor. Com o strict mode habilitado (que é recomendado), você não pode simplesmente atribuir null ou undefined a uma variável que espera um tipo específico. Para permitir esses valores, você deve usar union types: let email: string | null = null. Isso força o desenvolvedor a lidar explicitamente com casos onde um valor pode estar ausente, prevenindo erros comuns de "cannot read property of undefined".', exemplo: 'let email: string | null = null; let altura: number | undefined;' },
          { titulo: 'Annotations vs Inference', descricao: 'Type Annotations são quando você explicitamente declara o tipo de uma variável usando a sintaxe : tipo. Type Inference é quando o TypeScript deduz automaticamente o tipo baseado no valor atribuído. Por exemplo, let nome = "Maria" faz o TypeScript inferir que nome é do tipo string. A inferência funciona bem para variáveis simples, mas anotações explícitas são recomendadas para parâmetros de funções, retornos e interfaces. Uma boa prática é deixar o TypeScript inferir quando possível e usar anotações quando a inferência não for clara ou quando você quiser restringir o tipo.', exemplo: 'let cidade = "São Paulo"; // inferido como string\nlet idade: number = 25; // annotation explícita' },
          { titulo: 'Tipo any e unknown', descricao: 'O tipo any desativa completamente a verificação de tipos para uma variável, permitindo qualquer operação sem erro do compilador. Embora pareça útil, usar any elimina os benefícios do TypeScript e deve ser evitado sempre que possível. O tipo unknown é a alternativa segura — ele também aceita qualquer valor, mas você não pode realizar operações com ele sem antes fazer uma verificação de tipo (type guard). A regra geral é: use unknown quando não souber o tipo antecipadamente, e evite any completamente em código novo.', exemplo: 'let dado: unknown = "texto"; if (typeof dado === "string") { dado.toUpperCase(); }' }
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
          { titulo: 'Arrays tipados', descricao: 'Arrays em TypeScript podem ser tipados para garantir que todos os elementos sejam do mesmo tipo (ou de tipos específicos com union types). A sintaxe mais comum é number[] para um array de números, mas você também pode usar Array<number>. Se você tentar adicionar um elemento de tipo diferente, o TypeScript apontará o erro na hora. É possível criar arrays com múltiplos tipos usando union types como (string | number)[].', exemplo: 'const frutas: string[] = ["maçã", "banana", "laranja"];' },
          { titulo: 'Sintaxe Array<T> e T[]', descricao: 'As duas sintaxes para declarar arrays tipados são equivalentes, mas têm usos ligeiramente diferentes na prática. A sintaxe T[] é mais concisa e é preferida pela comunidade: let numeros: number[] = [1, 2, 3]. A sintaxe Array<T> usa a forma genérica e é útil em contextos mais complexos, como em callbacks ou quando você precisa especificar tipos mais elaborados. Em TypeScript moderno, você encontrará ambas as formas; a escolha é mais uma questão de estilo e legibilidade.', exemplo: 'const numeros: Array<number> = [1, 2, 3];' },
          { titulo: 'Tuplas (tuples)', descricao: 'Tuplas são arrays com tamanho fixo e tipos específicos para cada posição. Elas são úteis para representar dados que têm uma estrutura conhecida mas que não merecem uma interface própria. Por exemplo, let coordenada: [number, number] = [10, 20] define uma tupla com dois números. Você também pode criar tuplas com tipos diferentes, como [string, number, boolean], e ter posições opcionais. Diferente dos arrays comuns, o TypeScript verifica tanto o tipo quanto a quantidade de elementos em uma tupla.', exemplo: 'const pessoa: [string, number, boolean] = ["Maria", 30, true];' },
          { titulo: 'Operações básicas com arrays', descricao: 'TypeScript oferece tipagem completa para todos os métodos de array do JavaScript, como map, filter, reduce, forEach, push, pop, etc. Quando você usa map em um array de números, o TypeScript sabe que o callback recebe um number e o resultado é um novo array do tipo do retorno do callback. Métodos como push verificam se o tipo do elemento que você está adicionando corresponde ao tipo do array. Isso significa que você tem autocomplete e verificação de erros em todas as operações com arrays diretamente no editor.', exemplo: 'const dobrados = [1, 2, 3].map(n => n * 2); // [2, 4, 6]' }
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
          { titulo: 'Enums numéricos e string', descricao: 'Enums permitem definir um conjunto de constantes nomeadas de forma organizada e tipada. Em enums numéricos, cada membro recebe um número incremental automático começando de 0: enum Cor { Vermelho, Verde, Azul }. Você também pode definir valores específicos. Enums de string são mais previsíveis e auto-documentados: enum Status { Ativo = "ATIVO", Inativo = "INATIVO" }. A escolha entre numérico e string depende do contexto — enums string são melhores para logs e APIs, enquanto enums numéricos são mais eficientes.', exemplo: 'enum Dia { Seg = "SEGUNDA", Ter = "TERCA", Qua = "QUARTA" }' },
          { titulo: 'Type aliases', descricao: 'Type aliases permitem criar um nome para qualquer tipo, seja ele simples ou complexo. Com type você pode definir apelidos para tipos primitivos, unions, intersections e até tipos complexos. Por exemplo, type ID = string | number cria um tipo que pode ser string ou number. Type aliases são especialmente úteis para evitar repetição de tipos complexos e para dar nomes significativos a tipos que representam conceitos do domínio do seu sistema.', exemplo: 'type ID = string | number; type Status = "ativo" | "inativo";' },
          { titulo: 'Union types', descricao: 'Union types permitem que uma variável aceite mais de um tipo, usando o operador |. Por exemplo, let resultado: "sucesso" | "falha" | "pendente" cria um tipo literal union. Isso é extremamente útil para modelar estados possíveis de um valor. Você também pode usar union types com interfaces para criar discriminated unions, que são uma técnica poderosa para modelar dados que podem ter formas diferentes. O TypeScript usa type narrowing (estreitamento de tipo) para determinar qual tipo específico está sendo usado em cada contexto.', exemplo: 'let id: string | number = "abc123"; id = 456; // válido' },
          { titulo: 'Literal types', descricao: 'Literal types são tipos que representam valores exatos e não apenas categorias de valores. Por exemplo, let cor: "vermelho" | "azul" define que a variável só pode conter exatamente essas duas strings. Literal types funcionam com strings, números e booleanos. Eles são frequentemente combinados com union types para criar tipos precisos e auto-documentados. Uma aplicação comum é em parâmetros de funções onde apenas valores específicos são aceitos, como function setStatus(status: "ativo" | "inativo").', exemplo: 'function mover(direcao: "cima" | "baixo" | "esquerda" | "direita") {}' }
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
          { titulo: 'Declarando interfaces', descricao: 'Interfaces são a forma principal de definir a estrutura de objetos em TypeScript. Com interface Usuario { nome: string; email: string }, você define que qualquer objeto do tipo Usuario deve ter essas propriedades. Interfaces são abertas por padrão (você pode declará-las múltiplas vezes e elas são mescladas), diferente de types. Elas são fundamentais para garantir consistência nos dados que trafegam pela sua aplicação e servem como contratos entre diferentes partes do sistema.', exemplo: 'interface Usuario { nome: string; email: string; idade: number; }' },
          { titulo: 'Propriedades opcionais', descricao: 'Nem toda propriedade precisa ser obrigatória. Usando ? após o nome da propriedade, você a torna opcional: interface Usuario { nome: string; email?: string }. Propriedades opcionais podem ser undefined ou simplesmente não estar presentes no objeto. Isso é útil para modelar dados onde algumas informações podem não estar disponíveis. Ao acessar uma propriedade opcional, o TypeScript exige que você verifique se ela existe antes de usá-la, prevenindo erros de runtime.', exemplo: 'interface Config { tema: string; idioma?: string; }' },
          { titulo: 'Propriedades readonly', descricao: 'O modificador readonly impede que uma propriedade seja modificada após a inicialização do objeto. Por exemplo, readonly id: string cria uma propriedade que só pode ser definida na criação do objeto. Isso é útil para identificar propriedades como IDs, datas de criação e outros dados que não devem mudar. Readonly em interfaces funciona em tempo de compilação, diferente de const que é uma característica do JavaScript em tempo de execução.', exemplo: 'interface Artigo { readonly id: string; readonly criadoEm: Date; }' },
          { titulo: 'Objetos anônimos', descricao: 'Você pode definir a estrutura de um objeto diretamente no local de uso, sem criar uma interface separada, usando a sintaxe { propriedade: tipo }. Isso é chamado de tipo de objeto anônimo. Por exemplo: function processar(obj: { nome: string; idade: number }). Embora prático para usos pontuais, objetos anônimos dificultam a reutilização e a manutenção — recomenda-se criar interfaces nomeadas para estruturas que aparecem mais de uma vez no código.', exemplo: 'function exibirInfo(obj: { nome: string; idade: number }): string { return `${obj.nome} tem ${obj.idade} anos`; }' }
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
    instrucoes: 'Esta semana aprofunda o uso de interfaces e a tipagem de funções, conceitos essenciais para escrever código TypeScript profissional. Estude os exemplos com atenção e experimente modificar os parâmetros das funções para ver como o TypeScript reage. Os tópicos evoluem do básico ao avançado dentro de cada dia, então siga a ordem sugerida. Reserve um tempo extra para os exercícios de function overload e generics, pois são conceitos que geram mais dúvidas. O mini-projeto da semana vai exigir que você combine todos os conceitos em uma biblioteca utilitária.',
    dias: [
      {
        dia: 1,
        titulo: 'Interfaces com Métodos',
        teoria: 'Interfaces podem definir não apenas propriedades, mas também métodos. Isso permite criar contratos para classes e objetos.',
        topicos: [
          { titulo: 'Métodos em interfaces', descricao: 'Interfaces podem definir não apenas dados, mas também comportamentos através de métodos. A sintaxe para declarar um método em uma interface é similar a declará-lo em uma classe: interface Calculadora { somar(a: number, b: number): number }. O método pode ter parâmetros tipados e um tipo de retorno definido. Isso permite criar contratos completos que especificam tanto a estrutura quanto as operações disponíveis em um objeto.', exemplo: 'interface Calculadora { somar(a: number, b: number): number; }' },
          { titulo: 'Parâmetros e retorno tipados', descricao: 'Em TypeScript, tanto os parâmetros quanto o retorno das funções podem (e devem) ser tipados. Parâmetros sem tipo são implicitamente any, o que desativa a verificação. O tipo de retorno pode ser inferido pelo TypeScript, mas é boa prática declará-lo explicitamente em funções públicas. Parâmetros tipados previnem erros como passar argumentos na ordem errada ou com tipos incompatíveis, e o retorno tipado documenta o que a função produz.', exemplo: 'function somar(a: number, b: number): number { return a + b; }' },
          { titulo: 'this em interfaces', descricao: 'Em TypeScript, você pode tipar explicitamente o this dentro de uma interface ou função. Isso é útil em callbacks e em métodos encadeados (fluent interfaces). Por exemplo, interface Config { setNome(nome: string): this } indica que o método retorna o próprio objeto, permitindo encadeamento. Em funções callback, tipar o this previne erros de contexto de execução, algo comum em JavaScript.', exemplo: 'interface Fluent { setNome(n: string): this; ativar(): this; }' },
          { titulo: 'Callable interfaces', descricao: 'Interfaces podem descrever funções ao invés de objetos, usando a sintaxe de call signature. Por exemplo: interface Operacao { (a: number, b: number): number } define uma interface que descreve uma função que recebe dois números e retorna um número. Isso é útil para criar tipos reutilizáveis para funções callback e handlers. Callable interfaces também podem ter propriedades, combinando características de função e objeto.', exemplo: 'interface OperacaoMatematica { (a: number, b: number): number; }' }
        ],
        exercicio: 'Crie uma interface Calculadora com operações matemáticas.'
      },
      {
        dia: 2,
        titulo: 'Interfaces Avançadas',
        teoria: 'TypeScript permite estender interfaces, criar interfaces híbridas e usar intersecção de tipos.',
        topicos: [
          { titulo: 'Herança de interfaces (extends)', descricao: 'Interfaces podem herdar de outras interfaces usando extends, criando hierarquias de tipos. Por exemplo, interface UsuarioAdmin extends Usuario { nivelAcesso: string } cria uma interface que tem todas as propriedades de Usuario mais as próprias. Uma interface pode estender múltiplas interfaces ao mesmo tempo, separadas por vírgula. Isso promove reuso de tipos e modela naturalmente relações hierárquicas entre entidades.', exemplo: 'interface UsuarioBase { email: string; } interface Admin extends UsuarioBase { permissoes: string[]; }' },
          { titulo: 'Intersecção de tipos (&)', descricao: 'O operador & permite combinar múltiplos tipos em um só, criando um tipo que tem todas as propriedades dos tipos originais. Diferente de extends (que só funciona com interfaces), & funciona com qualquer tipo, incluindo type aliases e tipos primitivos. Por exemplo, type Admin = Usuario & { permissoes: string[] }. Intersecções são mais flexíveis que herança de interfaces, mas podem gerar mensagens de erro mais complexas.', exemplo: 'type ComNome = { nome: string }; type ComIdade = { idade: number }; type Pessoa = ComNome & ComIdade;' },
          { titulo: 'Interface vs Type alias', descricao: 'A principal diferença é que interfaces podem ser mescladas (declaration merging) e types não. Interfaces são mais adequadas para definir a forma de objetos e classes, enquanto types são melhores para unions, intersections e tipos complexos. Na prática, a recomendação é: use interface para objetos públicos/API e type para unions, utility types e tipos que combinam múltiplas interfaces. Ambos são intercambiáveis na maioria dos casos.', exemplo: 'interface IProduto { nome: string; } type ProdutoOuServico = IProduto | { servico: string; };' },
          { titulo: 'Duck typing', descricao: 'TypeScript usa duck typing (ou structural typing), o que significa que a compatibilidade de tipos é verificada pela estrutura, não pelo nome. Se dois objetos têm a mesma estrutura, eles são considerados do mesmo tipo, independente de seus nomes. Isso é diferente de linguagens como Java ou C#, que usam nominal typing. O duck typing torna o TypeScript mais flexível e natural para desenvolvedores JavaScript, mas requer cuidado para não aceitar tipos indesejados acidentalmente.', exemplo: 'function cumprimentar(p: { nome: string }) { return `Olá ${p.nome}`; } cumprimentar({ nome: "Ana" }); // ok' }
        ],
        exercicio: 'Crie interfaces herdadas para um sistema de personagens de jogo.'
      },
      {
        dia: 3,
        titulo: 'Funções: Parâmetros e Retorno',
        teoria: 'Funções em TypeScript podem ter tipos explícitos nos parâmetros e no retorno. Isso previne erros em tempo de desenvolvimento.',
        topicos: [
          { titulo: 'Tipagem de parâmetros', descricao: 'Cada parâmetro de função pode ter seu tipo especificado: function saudar(nome: string, idade: number). Isso garante que apenas valores do tipo correto sejam passados como argumento. O TypeScript também verifica a quantidade de parâmetros: se uma função espera 2 parâmetros, passar 1 ou 3 gera erro. Parâmetros tipados são fundamentais para documentar a interface da função e prevenir erros de uso.', exemplo: 'function multiplicar(a: number, b: number): number { return a * b; }' },
          { titulo: 'Parâmetros opcionais', descricao: 'Parâmetros opcionais são marcados com ? e podem ser omitidos na chamada da função. Eles sempre vêm depois dos parâmetros obrigatórios: function cadastrar(nome: string, email?: string). Se um parâmetro opcional não for informado, seu valor será undefined. Você pode combinar parâmetros opcionais com valores padrão para garantir que sempre haja um valor útil disponível.', exemplo: 'function cadastrar(nome: string, email?: string) { return email ?? "sem email"; }' },
          { titulo: 'Valores padrão', descricao: 'Parâmetros com valores padrão são uma alternativa aos parâmetros opcionais: function saudar(nome: string, saudacao: string = "Olá"). Diferente dos opcionais, parâmetros com valor padrão não precisam ser marcados com ? — se o argumento não for passado, o valor padrão é usado. O TypeScript infere o tipo do valor padrão, mas você também pode declarar o tipo explicitamente. Valores padrão tornam a função mais robusta e reduzem a necessidade de verificações de undefined.', exemplo: 'function saudar(nome: string, saudacao: string = "Olá") { return `${saudacao}, ${nome}!`; }' },
          { titulo: 'Tipo de retorno', descricao: 'O tipo de retorno de uma função pode ser inferido ou declarado explicitamente: function somar(a: number, b: number): number. Declarar explicitamente o retorno é uma boa prática para funções públicas, pois documenta a intenção e previne erros de implementação. Para funções que não retornam valor, use void. Funções que podem lançar erro ou retornar diferentes tipos podem usar union types no retorno.', exemplo: 'function log(mensagem: string): void { console.log(mensagem); }' }
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
          { titulo: 'Function overloads', descricao: 'Overloads permitem que uma função tenha múltiplas assinaturas de tipos diferentes. Você declara várias assinaturas (sem implementação) e depois uma implementação única que cobre todos os casos. Por exemplo, uma função que aceita string ou array e retorna o comprimento. O TypeScript usa as assinaturas para verificar as chamadas e a implementação para verificar a lógica. Overloads são úteis para APIs flexíveis que se comportam diferentemente baseado nos tipos dos argumentos.', exemplo: 'function unir(a: string): string; function unir(a: string[]): string; function unir(a: string | string[]): string { /* impl */ }' },
          { titulo: 'Parâmetros rest', descricao: 'O parâmetro rest (...args) permite que uma função aceite um número variável de argumentos, que são agrupados em um array. Em TypeScript, você deve tipar o parâmetro rest como um array: function somarAll(...numeros: number[]): number. Isso é útil para funções como Math.max() ou String.concat(). O TypeScript verifica o tipo de cada argumento individualmente e garante que todos correspondam ao tipo do array.', exemplo: 'function somarTudo(...numeros: number[]): number { return numeros.reduce((a, b) => a + b, 0); }' },
          { titulo: 'Typed callbacks', descricao: 'Callbacks em TypeScript devem ter seus tipos declarados, tanto dos parâmetros quanto do retorno. Por exemplo: function executar(callback: (nome: string) => void). Isso garante que o callback seja chamado com os argumentos corretos e que seu retorno seja usado adequadamente. Callbacks tipados são especialmente importantes em operações assíncronas e métodos de array como map, filter e forEach.', exemplo: 'function executar(callback: (nome: string) => void) { callback("João"); }' },
          { titulo: 'this em funções', descricao: 'Em TypeScript, você pode especificar o tipo esperado para this como primeiro parâmetro da função: function handleClick(this: HTMLElement, event: Event). Isso não afeta a execução (JavaScript ignora), mas permite que o TypeScript verifique se o contexto de chamada está correto. É particularmente útil em event listeners e métodos de objetos que serão usados como callbacks. Sem essa tipagem, o TypeScript não consegue verificar se this está sendo usado corretamente.', exemplo: 'function onClick(this: HTMLButtonElement, event: MouseEvent) { this.disabled = true; }' }
        ],
        exercicio: 'Implemente uma função com overloads e um callback tipado.'
      },
      {
        dia: 5,
        titulo: 'Generics em Funções',
        teoria: 'Generics permitem criar funções reutilizáveis que funcionam com múltiplos tipos mantendo a segurança de tipos.',
        topicos: [
          { titulo: 'Introdução a generics', descricao: 'Generics são como "variáveis de tipo" — eles permitem criar funções e tipos que funcionam com múltiplos tipos específicos sem perder a segurança de tipos. A sintaxe usa <T> (pode ser qualquer letra, mas T é convenção) para declarar um parâmetro de tipo. Por exemplo, function identidade<T>(arg: T): T { return arg } retorna exatamente o tipo que recebeu. Generics são a ponte entre código reutilizável e type safety.', exemplo: 'function identidade<T>(arg: T): T { return arg; }' },
          { titulo: 'Generic functions', descricao: 'Funções genéricas podem ter um ou mais parâmetros de tipo, que são usados nos parâmetros da função e/ou no retorno. O TypeScript geralmente infere o tipo genérico automaticamente baseado nos argumentos passados. Por exemplo, primeiro([1, 2, 3]) infere que T é number. Você também pode especificar o tipo explicitamente: primeiro<number>([1, 2, 3]). Funções genéricas são essenciais para criar utilitários que funcionam com qualquer tipo.', exemplo: 'function inverter<T>(arr: T[]): T[] { return arr.reverse(); }' },
          { titulo: 'Constraints (limitações)', descricao: 'Às vezes você quer restringir quais tipos podem ser usados com um generic. Constraints usam a palavra-chave extends para limitar o parâmetro de tipo: function logLength<T extends { length: number }>(arg: T): number. Isso significa que T deve ter uma propriedade length. Constraints permitem escrever código genérico que ainda pode acessar propriedades específicas dos tipos permitidos.', exemplo: 'function logLength<T extends { length: number }>(arg: T): number { return arg.length; }' },
          { titulo: 'infer keyword', descricao: 'A palavra-chave infer é usada em conditional types para extrair tipos de dentro de outros tipos. Por exemplo, type RetornoFuncao<T> = T extends (...args: any[]) => infer R ? R : never extrai o tipo de retorno de uma função. infer é um recurso avançado usado principalmente em bibliotecas e tipos utilitários. Ele permite criar tipos que "desconstroem" outros tipos para extrair informações específicas.', exemplo: 'type ElementoArray<T> = T extends (infer U)[] ? U : never;' }
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
    instrucoes: 'Esta semana introduz Programação Orientada a Objetos com TypeScript. Comece entendendo a sintaxe de classes e depois explore os modificadores de acesso e herança. É importante praticar a criação de hierarquias de classes para entender polimorfismo na prática. Preste atenção especial aos conceitos de abstract classes e interfaces em classes, pois são amplamente usados em projetos reais. O mini-projeto de gestão de funcionários ajudará a solidificar todos os conceitos de POO.',
    dias: [
      {
        dia: 1,
        titulo: 'Classes Básicas',
        teoria: 'Classes são templates para criar objetos. TypeScript adiciona tipagem forte a classes com modificadores de acesso.',
        topicos: [
          { titulo: 'Declarando classes', descricao: 'Classes em TypeScript seguem a sintaxe do ES6+ com adição de tipos. Você declara propriedades com seus tipos antes do constructor e métodos com parâmetros tipados. Por exemplo: class Pessoa { nome: string; constructor(nome: string) { this.nome = nome } }. TypeScript também oferece uma sintaxe reduzida onde você declara e inicializa propriedades diretamente no constructor usando modificadores de acesso.', exemplo: 'class Carro { modelo: string; constructor(modelo: string) { this.modelo = modelo; } }' },
          { titulo: 'Constructor', descricao: 'O constructor é um método especial chamado automaticamente ao criar uma nova instância com new. Em TypeScript, você pode usar atalhos no constructor para declarar e inicializar propriedades simultaneamente: constructor(public nome: string, public idade: number). Isso elimina a repetição de declarar a propriedade fora e atribuir dentro do constructor. O constructor também pode ter lógica de validação e inicialização.', exemplo: 'class Produto { constructor(public nome: string, public preco: number) {} }' },
          { titulo: 'Propriedades e métodos', descricao: 'Propriedades de classe podem ser tipadas e podem ter valores padrão. Métodos seguem a mesma sintaxe de funções com parâmetros e retorno tipados. Propriedades podem ser inicializadas diretamente na declaração ou no constructor. TypeScript também suporta propriedades computadas e getters/setters com tipagem adequada. Métodos podem ser públicos ou privados e podem acessar todas as propriedades da instância através do this.', exemplo: 'class Contador { private valor = 0; incrementar(): void { this.valor++; } }' },
          { titulo: 'Instanciação', descricao: 'Criar um objeto a partir de uma classe usa a palavra-chave new: const pessoa = new Pessoa("Ana", 25). O TypeScript verifica se os argumentos passados correspondem aos tipos esperados pelo constructor. Cada instância tem sua própria cópia das propriedades, mas compartilha os métodos definidos na classe. A instanciação também pode incluir lógica complexa, como chamar métodos do construtor da classe pai com super().', exemplo: 'const carro = new Carro("Fusca"); console.log(carro.modelo);' }
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
          { titulo: 'public', descricao: 'O modificador public é o padrão quando nenhum modificador é especificado. Propriedades e métodos públicos podem ser acessados de qualquer lugar: dentro da classe, de instâncias e de classes filhas. Por ser o padrão, você raramente precisa escrever public explicitamente, mas pode fazê-lo para deixar a intenção clara. Tudo que não tem modificador explícito é considerado público.', exemplo: 'class Exemplo { public nome: string; public metodo(): void {} }' },
          { titulo: 'private', descricao: 'O modificador private restringe o acesso à própria classe. Propriedades ou métodos privados não podem ser acessados de fora da classe nem por classes filhas. Em TypeScript, private é verificado em tempo de compilação, diferente do # do JavaScript que é verificado em tempo de execução. private é usado para encapsular detalhes internos de implementação que não devem ser expostos.', exemplo: 'class Conta { private saldo = 0; private calcularJuros() {} }' },
          { titulo: 'protected', descricao: 'O modificador protected é um meio termo entre public e private. Membros protected podem ser acessados pela classe que os define e por classes filhas (via herança), mas não por código externo. Isso é útil quando você quer que subclasses tenham acesso a certos membros mas continue escondendo a implementação do mundo exterior. É comum em frameworks e bibliotecas onde classes base fornecem hooks para subclasses.', exemplo: 'class Base { protected id: number; } class Filha extends Base { exibir() { console.log(this.id); } }' },
          { titulo: 'readonly', descricao: 'O modificador readonly pode ser combinado com modificadores de acesso para criar propriedades que só podem ser definidas na declaração ou no constructor. Por exemplo, public readonly id: string cria uma propriedade pública que não pode ser modificada após a criação. É ideal para identificadores, datas de criação e outras constantes por instância. Readonly em classes funciona como em interfaces — a verificação é feita em tempo de compilação.', exemplo: 'class Config { readonly versao: string = "1.0"; }' },
          { titulo: 'Parâmetros readonly no constructor', descricao: 'TypeScript permite declarar propriedades diretamente no constructor com readonly: constructor(readonly id: string). Isso cria uma propriedade pública e somente leitura em uma única linha. É uma sintaxe concisa muito usada em projetos reais para propriedades que são definidas uma vez e nunca mais alteradas. Essa técnica reduz a quantidade de código boilerplate e torna a classe mais limpa.', exemplo: 'class Usuario { constructor(readonly id: string, public nome: string) {} }' }
        ],
        exercicio: 'Reescreva a classe Pessoa com modificadores de acesso.'
      },
      {
        dia: 3,
        titulo: 'Herança e Polimorfismo',
        teoria: 'Classes podem herdar de outras classes usando extends. Polimorfismo permite que subclasses sobrescrevam métodos.',
        topicos: [
          { titulo: 'extends', descricao: 'A palavra-chave extends cria uma relação de herança entre classes, onde a classe filha herda todas as propriedades e métodos da classe pai. Por exemplo, class Cachorro extends Animal. A classe filha pode adicionar novas propriedades e métodos ou modificar o comportamento dos herdados. TypeScript suporta herança única (uma classe só pode estender uma classe), mas isso é suficiente para a maioria dos casos.', exemplo: 'class Veiculo { rodas = 4; } class Moto extends Veiculo { rodas = 2; }' },
          { titulo: 'super', descricao: 'A palavra-chave super é usada na classe filha para acessar o constructor e métodos da classe pai. No constructor da classe filha, super() deve ser chamado antes de usar this. super também permite chamar métodos da classe pai que foram sobrescritos: super.metodoOriginal(). Isso é útil quando você quer estender o comportamento de um método em vez de substituí-lo completamente.', exemplo: 'class Filha extends Base { constructor() { super(); /* obrigatório */ } }' },
          { titulo: 'Override de métodos', descricao: 'Classes filhas podem sobrescrever métodos da classe pai, redefinindo sua implementação. Para garantir que você está realmente sobrescrevendo um método (e não criando um novo por engano), use a anotação override. O TypeScript verifica que o método pai realmente existe. Métodos sobrescritos devem manter a compatibilidade de tipos — os parâmetros e retorno devem ser compatíveis com a versão original.', exemplo: 'class Base { exibir(): string { return "base"; } } class Filha extends Base { override exibir(): string { return "filha"; } }' },
          { titulo: 'Abstract classes', descricao: 'Classes abstratas (marcadas com abstract) não podem ser instanciadas diretamente — elas servem como base para outras classes. Métodos abstratos são declarados sem implementação e devem ser implementados pelas subclasses. Por exemplo: abstract class Animal { abstract som(): string }. Classes abstratas são uma forma de definir contratos com implementação parcial, diferente de interfaces que só definem contratos sem implementação.', exemplo: 'abstract class Forma { abstract area(): number; } class Quadrado extends Forma { constructor(private lado: number) { super(); } area() { return this.lado ** 2; } }' }
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
          { titulo: 'implements', descricao: 'A palavra-chave implements faz uma classe cumprir o contrato definido por uma interface. A classe deve implementar todas as propriedades e métodos da interface: class Produto implements IProduto. Isso garante que a classe tenha a estrutura esperada. Diferente de extends, uma classe pode implementar múltiplas interfaces: class Pedido implements IPedido, ILoggable.', exemplo: 'interface Saudavel { saudar(): string; } class Pessoa implements Saudavel { saudar() { return "Olá!"; } }' },
          { titulo: 'Múltiplas interfaces', descricao: 'TypeScript permite que uma classe implemente várias interfaces simultaneamente, combinando diferentes contratos em uma única implementação. Por exemplo, class Usuario implements Serializable, Loggable. Isso é poderoso porque permite composição de comportamentos. Se duas interfaces exigirem métodos ou propriedades conflitantes, o TypeScript apontará o erro em tempo de compilação.', exemplo: 'class Arquivo implements Serializable, Loggable { salvar() {} log() {} }' },
          { titulo: 'Contratos em classes', descricao: 'Interfaces em TypeScript funcionam como contratos que as classes devem cumprir. Isso permite programar para a interface, não para a implementação — um princípio fundamental de design de software. Contratos facilitam testes (mocks), troca de implementações e evolução do código. Uma boa prática é depender de interfaces nas suas funções e classes, não de implementações concretas.', exemplo: 'function processar(repositorio: IRepositorio) { repositorio.salvar({ id: 1 }); }' },
          { titulo: 'Duck typing com classes', descricao: 'O duck typing do TypeScript também se aplica a classes. Se uma classe tem a mesma estrutura de uma interface (mesmos métodos com mesmos tipos), ela satisfaz a interface mesmo sem usar implements explicitamente. Isso é útil para testes e para integrar código de terceiros. No entanto, usar implements explicitamente é recomendado por questões de documentação e clareza.', exemplo: 'interface I { x: number; } class A { x = 5; } const obj: I = new A(); // duck typing' }
        ],
        exercicio: 'Crie interfaces Serializable e Loggable e implemente em uma classe.'
      },
      {
        dia: 5,
        titulo: 'Static e Mixins',
        teoria: 'Membros estáticos pertencem à classe e não às instâncias. Mixins permitem composição de classes.',
        topicos: [
          { titulo: 'Membros estáticos', descricao: 'Membros estáticos (propriedades e métodos) pertencem à classe em si, não às instâncias. Eles são acessados diretamente pelo nome da classe: MinhaClasse.metodoEstatico() ou MinhaClasse.propriedadeEstatica. Membros estáticos são comuns para fábricas, singletons, constantes e utilitários que não dependem de estado de instância. O modificador static pode ser combinado com modificadores de acesso.', exemplo: 'class Configuracao { static readonly VERSAO = "2.0"; }' },
          { titulo: 'Static methods e properties', descricao: 'Métodos estáticos são funções utilitárias agrupadas na classe, como Date.now() ou Array.from(). Propriedades estáticas são compartilhadas entre todas as instâncias, servindo como configuração global ou contadores. Por exemplo: class Contador { static total = 0 }. Métodos estáticos não podem acessar membros de instância diretamente (pois não têm acesso ao this de instância).', exemplo: 'class Matematica { static pi(): number { return 3.14159; } } console.log(Matematica.pi());' },
          { titulo: 'Introdução a mixins', descricao: 'Mixins são uma técnica para composição de classes que permite reutilizar código entre classes não relacionadas. Em TypeScript, mixins são implementados como funções que recebem uma classe base e retornam uma nova classe estendida. Eles contornam a limitação de herança única, permitindo que uma classe "herde" comportamentos de múltiplas fontes. Mixins são comuns em bibliotecas e frameworks.', exemplo: 'function Timestamp<TBase extends new (...args: any[]) => {}>(Base: TBase) { return class extends Base { timestamp = new Date(); }; }' },
          { titulo: 'Factory patterns', descricao: 'O padrão Factory (Fábrica) usa métodos estáticos ou funções para criar objetos, encapsulando a lógica de criação. Em TypeScript, factories podem retornar tipos específicos baseados em parâmetros, usando generics para manter a segurança de tipos. O padrão é útil quando a criação de um objeto é complexa, envolve validação ou quando você quer desacoplar o código cliente da classe concreta.', exemplo: 'class Usuario { static criar(nome: string) { return new Usuario(nome); } private constructor(public nome: string) {} }' }
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
    instrucoes: 'Generics são um dos recursos mais poderosos do TypeScript, permitindo criar código reutilizável sem perder a segurança de tipos. Dedique tempo extra aos primeiros dias, pois a base de generics em funções e classes é crucial para o restante da semana. Os utility types (Partial, Pick, Omit) são extremamente úteis no dia a dia — memorize os principais. Conditional types e template literal types são tópicos avançados; estude-os com calma e revisite se necessário. O mini-projeto de API Client genérico vai mostrar o poder dos generics na prática.',
    dias: [
      {
        dia: 1,
        titulo: 'Generics em Classes',
        teoria: 'Classes genéricas permitem criar estruturas de dados reutilizáveis com verificação de tipos em tempo de desenvolvimento.',
        topicos: [
          { titulo: 'Classes genéricas', descricao: 'Classes genéricas permitem criar estruturas de dados que funcionam com qualquer tipo mantendo a segurança de tipos. Por exemplo, class Stack<T> { private items: T[] = [] } cria uma pilha que pode armazenar qualquer tipo. O tipo é definido no momento da instanciação: const stack = new Stack<number>(). Classes genéricas são a base para estruturas de dados como listas, pilhas, filas e árvores.', exemplo: 'class Caixa<T> { constructor(public conteudo: T) {} } const caixa = new Caixa<string>("livro");' },
          { titulo: 'Restrições com constraints', descricao: 'Constraints em classes genéricas limitam os tipos que podem ser usados, garantindo que operações específicas estejam disponíveis. Por exemplo, class Colecao<T extends { id: number }> garante que qualquer tipo usado tenha uma propriedade id. As constraints são definidas com extends e podem ser combinadas. Elas permitem escrever código genérico que ainda pode acessar propriedades específicas dos tipos.', exemplo: 'class Repositorio<T extends { id: number }> { private items: T[] = []; getById(id: number) { return this.items.find(i => i.id === id); } }' },
          { titulo: 'Default types', descricao: 'Parâmetros de tipo em classes genéricas podem ter valores padrão, usados quando o tipo não é especificado: class Stack<T = number>. Isso torna a classe mais conveniente de usar para o caso comum, mantendo a flexibilidade para tipos diferentes. Default types funcionam similarmente a parâmetros padrão em funções. É útil quando a maioria dos usos de uma classe genérica será com um tipo específico.', exemplo: 'class Fila<T = string> { private items: T[] = []; } const fila = new Fila(); // T é string' },
          { titulo: 'new() constraint', descricao: 'A constraint { new(...args: any[]): T } permite que uma classe genérica crie instâncias do tipo genérico. Isso é útil para factories e padrões de criação. Por exemplo: class Fabrica<T> { criar(Construtor: new () => T): T { return new Construtor() } }. Essa é uma técnica avançada usada em frameworks de injeção de dependência e ORMs.', exemplo: 'class Fabrica<T> { criar(Construtor: new () => T): T { return new Construtor(); } }' }
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
          { titulo: 'Múltiplos type parameters', descricao: 'Generics podem ter vários parâmetros de tipo, cada um representando um tipo diferente. Por exemplo, class Par<T, U> { constructor(public primeiro: T, public segundo: U) }. Isso é útil para modelos de dados que relacionam múltiplos tipos, como pares chave-valor, resultados de operações ou mapeamentos. A convenção é usar letras maiúsculas: T, U, V, ou nomes descritivos para clareza.', exemplo: 'class Par<T, U> { constructor(public chave: T, public valor: U) {} } const p = new Par("id", 1);' },
          { titulo: 'Generic constraints', descricao: 'Constraints podem ser aplicadas a cada parâmetro de tipo individualmente ou em relação uns aos outros. Por exemplo, function copiar<T extends U, U>(origem: T, destino: U) onde T deve ser subtipo de U. Constraints relacionais permitem expressar relações complexas entre tipos. Elas são usadas em APIs de bibliotecas para garantir uso correto de métodos genéricos.', exemplo: 'function atribuir<T extends U, U>(destino: U, origem: T): U { return { ...destino, ...origem }; }' },
          { titulo: 'keyof operator', descricao: 'keyof é um operador que extrai as chaves de um tipo como uma union de strings literais. Por exemplo, type ChavesUsuario = keyof Usuario retorna "nome" | "email" | "idade". Combinado com generics, keyof permite criar funções que acessam propriedades de forma tipada: function getProp<T, K extends keyof T>(obj: T, key: K): T[K]. É um dos operadores mais úteis para metaprogramação em TypeScript.', exemplo: 'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }' },
          { titulo: 'Mapped types', descricao: 'Mapped types permitem criar novos tipos transformando as propriedades de um tipo existente. Por exemplo, type Readonly<T> = { readonly [K in keyof T]: T[K] } cria uma versão readonly de qualquer tipo. Mapped types combinam keyof, in e index access types para criar transformações poderosas. Eles são a base de utility types como Partial, Required, Pick e Omit.', exemplo: 'type Opcional<T> = { [K in keyof T]?: T[K]; };' }
        ],
        exercicio: 'Crie um dicionário genérico (chave-valor).'
      },
      {
        dia: 3,
        titulo: 'Utility Types',
        teoria: 'TypeScript oferece utility types prontos: Partial, Required, Pick, Omit, Record, etc.',
        topicos: [
          { titulo: 'Partial<T>', descricao: 'Partial<T> transforma todas as propriedades de T em opcionais. É útil em funções de atualização parcial, onde você só precisa fornecer alguns campos. Por exemplo, function atualizarUsuario(id: number, dados: Partial<Usuario>). Partial é implementado como um mapped type e é um dos utility types mais usados no dia a dia. Ele permite criar APIs flexíveis para atualizações parciais.', exemplo: 'type UsuarioParcial = Partial<{ nome: string; email: string }>; // { nome?: string; email?: string }' },
          { titulo: 'Required<T>', descricao: 'Required<T> faz todas as propriedades opcionais de T se tornarem obrigatórias. É o oposto de Partial e é útil quando você quer garantir que todos os campos de uma interface opcional sejam fornecidos. Por exemplo, uma função que transforma dados parciais em completos. Required é implementado removendo o modificador ? de todas as propriedades através de mapped types.', exemplo: 'type Completo = Required<{ nome?: string; email?: string }>; // { nome: string; email: string }' },
          { titulo: 'Pick<T, K>', descricao: 'Pick<T, K> cria um novo tipo selecionando apenas as propriedades especificadas de T. K deve ser uma union de chaves que existem em T. Por exemplo, type UsuarioPublico = Pick<Usuario, "nome" | "email">. Pick é útil para criar visões reduzidas de tipos, como dados públicos de um usuário ou campos de formulário. Ele mantém os tipos originais das propriedades selecionadas.', exemplo: 'type ApenasNome = Pick<{ nome: string; idade: number }, "nome">; // { nome: string }' },
          { titulo: 'Omit<T, K>', descricao: 'Omit<T, K> é o inverso de Pick — ele cria um novo tipo com todas as propriedades de T exceto as especificadas em K. Por exemplo, type UsuarioSemSenha = Omit<Usuario, "senha">. Omit é útil para excluir propriedades sensíveis ou irrelevantes em determinados contextos. Ele é implementado como Pick<T, Exclude<keyof T, K>>.', exemplo: 'type SemSenha = Omit<{ usuario: string; senha: string }, "senha">; // { usuario: string }' },
          { titulo: 'Record<K, V>', descricao: 'Record<K, V> cria um tipo de objeto onde as chaves são do tipo K e os valores são do tipo V. Por exemplo, type NotasPorAluno = Record<string, number[]>. Record é útil para criar dicionários e mapas tipados. K geralmente é string ou number, mas também pode ser uma union de literais para chaves específicas.', exemplo: 'type Semana = Record<"seg" | "ter" | "qua", number>; // { seg: number; ter: number; qua: number }' }
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
          { titulo: 'T extends U ? X : Y', descricao: 'Conditional types usam uma sintaxe similar ao operador ternário para escolher tipos baseados em uma condição. Por exemplo, type IsString<T> = T extends string ? true : false. Isso permite criar tipos que se comportam diferentemente baseado no tipo de entrada. Conditional types são a base para muitas transformações avançadas de tipos.', exemplo: 'type IsString<T> = T extends string ? "sim" : "nao"; type Teste = IsString<number>; // "nao"' },
          { titulo: 'infer keyword', descricao: 'infer é usado dentro de conditional types para declarar uma variável de tipo que será inferida. Por exemplo, type RetornoFuncao<T> = T extends (...args: any[]) => infer R ? R : never extrai o tipo de retorno de qualquer função. infer permite "desestruturar" tipos complexos para extrair informações específicas como tipos de elementos de array, parâmetros de função ou tipos de promessas.', exemplo: 'type Retorno<T> = T extends (...args: any[]) => infer R ? R : never;' },
          { titulo: 'Distributive conditional types', descricao: 'Quando um conditional type é aplicado a um union type nu (sem ser encapsulado em um array ou tuple), ele distribui sobre cada membro do union. Por exemplo, type ToArray<T> = T extends any ? T[] : never aplicado a string | number resulta em string[] | number[]. A distribuição é automática e pode ser controlada usando colchetes ou wrappers. Esse comportamento é útil para transformar unions.', exemplo: 'type ParaArray<T> = T extends any ? T[] : never; type Result = ParaArray<string | number>; // string[] | number[]' },
          { titulo: 'Built-in conditional types', descricao: 'TypeScript inclui vários conditional types prontos como Exclude<T, U>, Extract<T, U>, NonNullable<T> e ReturnType<T>. Exclude remove tipos de um union, Extract extrai tipos comuns, NonNullable remove null/undefined e ReturnType extrai o tipo de retorno de uma função. Esses tipos são implementados internamente com conditional types e são amplamente usados em código TypeScript moderno.', exemplo: 'type SemNull = NonNullable<string | null | undefined>; // string' }
        ],
        exercicio: 'Crie tipos condicionais para extrair tipos de funções.'
      },
      {
        dia: 5,
        titulo: 'Template Literal Types',
        teoria: 'Template literal types permitem criar strings literais com base em outros tipos, úteis para APIs e validação.',
        topicos: [
          { titulo: 'Template literals em tipos', descricao: 'Template literal types usam a sintaxe de template strings (com ${}) para criar tipos de string baseados em outros tipos. Por exemplo, type Evento = on${Capitalize<string>} cria tipos como "onClick", "onSubmit". Isso permite criar tipos de string precisos que acompanham mudanças em outros tipos. É uma feature poderosa para tipagem de eventos, ações e rotas.', exemplo: 'type Botao = `btn-${"primario" | "secundario"}`; // "btn-primario" | "btn-secundario"' },
          { titulo: 'Inferência de eventos', descricao: 'Template literal types são frequentemente usados para tipar sistemas de eventos. Por exemplo, você pode criar um tipo que mapeia "click" | "submit" para "onClick" | "onSubmit" automaticamente. Isso é útil em bibliotecas de UI e frameworks. A combinação de template literals com keyof e mapped types permite criar tipos de eventos altamente precisos e auto-documentados.', exemplo: 'type EventoNome<T extends string> = `on${Capitalize<T>}`; type Click = EventoNome<"click">; // "onClick"' },
          { titulo: 'String manipulation', descricao: 'TypeScript oferece tipos utilitários para manipulação de strings em tempo de compilação: Uppercase<S>, Lowercase<S>, Capitalize<S>, Uncapitalize<S>. Esses tipos transformam string literals em suas versões maiúscula, minúscula, capitalizada ou descapitalizada. Eles são usados em conjunto com template literal types para criar convenções de nomenclatura automáticas.', exemplo: 'type Gritando = Uppercase<"ola">; // "OLA"' },
          { titulo: 'Autocomplete em strings', descricao: 'Template literal types melhoram significativamente a experiência de desenvolvimento com autocomplete preciso. Quando você define um tipo como type Rota = /api/${string}/${"usuarios" | "produtos"}, o editor sugere automaticamente as opções disponíveis. Isso reduz erros de digitação e documenta as possibilidades diretamente no tipo. É uma técnica cada vez mais usada em bibliotecas de roteamento e APIs.', exemplo: 'type Rota = `/api/${"produtos" | "usuarios"}/${string}`;' }
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
    instrucoes: 'Esta semana cobre tópicos avançados que são fundamentais para quem vai trabalhar com Angular. Decorators podem parecer complexos no início, então comece com os exemplos básicos antes de criar seus próprios decorators. A organização de módulos com import/export é essencial para projetos maiores — pratique a criação de barrel files e re-exports. Os arquivos de declaração (.d.ts) são importantes para integrar bibliotecas JavaScript existentes. O mini-projeto de framework de validação com decorators é desafiador, mas muito recompensador.',
    dias: [
      {
        dia: 1,
        titulo: 'Decorators: Introdução',
        teoria: 'Decorators são funções especiais que podem modificar classes, métodos e propriedades. São muito usados em frameworks como Angular.',
        topicos: [
          { titulo: 'O que são decorators', descricao: 'Decorators são funções especiais que permitem modificar ou estender classes, métodos, propriedades e parâmetros em TypeScript. Eles seguem o padrão de decorator do ES7 e são amplamente usados em frameworks como Angular (@Component, @Injectable) e NestJS. Decorators executam em tempo de definição da classe, não em tempo de execução. Para usar decorators, é necessário habilitar experimentalDecorators no tsconfig.json.', exemplo: '// tsconfig.json: "experimentalDecorators": true' },
          { titulo: 'Decorator factories', descricao: 'Decorator factories são funções que retornam um decorator, permitindo personalizar seu comportamento através de parâmetros. Por exemplo: function Logger(nome: string) { return function(target: any) { console.log(Classe ${nome} decorada) } }. Isso torna os decorators mais flexíveis e reutilizáveis. As factories são executadas em tempo de definição e o decorator retornado é aplicado ao elemento alvo.', exemplo: 'function Log(nome: string) { return function(target: any) { console.log(`Decorando: ${nome}`); }; }' },
          { titulo: 'Class decorators', descricao: 'Class decorators são aplicados ao constructor da classe e podem modificar ou substituir a classe. Eles recebem o constructor como argumento e devem retornar um novo constructor ou undefined. Por exemplo, um decorator que adiciona uma propriedade createdAt a toda instância. Class decorators são executados quando a classe é definida, não quando é instanciada. Eles são úteis para logging, injeção de dependência e metadados.', exemplo: 'function Selavel<T extends { new (...args: any[]): {} }>(ctor: T) { return class extends ctor { selo = new Date(); }; }' },
          { titulo: 'Experimental decorators', descricao: 'Decorators em TypeScript ainda são considerados experimentais (daí a flag experimentalDecorators). Isso significa que a implementação pode mudar no futuro. Apesar disso, eles são amplamente usados e estáveis na prática. Em TypeScript 5.0, decorators foram atualizados para seguir a proposta do TC39, que é o padrão futuro. A versão experimental atual continuará funcionando, mas a nova versão tem sintaxe ligeiramente diferente.', exemplo: '// experimentalDecorators: true — necessário para usar @Component no Angular' }
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
          { titulo: 'Method decorators', descricao: 'Method decorators são aplicados a métodos de classe. Eles recebem três argumentos: o prototype da classe, o nome do método e o PropertyDescriptor. Eles podem modificar o comportamento do método (como adicionar logging, validação ou cache). Por exemplo, um decorator @Log que imprime os parâmetros e retorno de um método. Method decorators são comuns para logging, timing e controle de acesso.', exemplo: 'function Log(target: any, key: string, desc: PropertyDescriptor) { const original = desc.value; desc.value = (...args: any[]) => { console.log(`${key} chamado`); return original(...args); }; }' },
          { titulo: 'Property decorators', descricao: 'Property decorators são aplicados a propriedades de classe. Eles recebem o prototype e o nome da propriedade, mas não o PropertyDescriptor (diferente de métodos). São usados para modificar o comportamento padrão de propriedades, como tornar uma propriedade observável ou adicionar validação. Property decorators podem ser combinados com outras técnicas para criar sistemas reativos.', exemplo: 'function Observavel(target: any, key: string) { let val = target[key]; Object.defineProperty(target, key, { get: () => val, set: (v) => { val = v; console.log(`${key} alterado para ${v}`); } }); }' },
          { titulo: 'Accessor decorators', descricao: 'Accessor decorators são aplicados a getters e setters de propriedades. Eles funcionam de forma similar aos method decorators, recebendo o PropertyDescriptor. Podem modificar como o acesso à propriedade funciona, adicionando lógica extra no get ou set. Por exemplo, um decorator @Observable que dispara eventos quando uma propriedade é alterada. São usados em frameworks de reatividade.', exemplo: 'function Congelar(target: any, key: string, desc: PropertyDescriptor) { desc.writable = false; }' },
          { titulo: 'Parameter decorators', descricao: 'Parameter decorators são aplicados a parâmetros de métodos. Eles recebem o prototype, o nome do método e o índice do parâmetro. Diferente dos outros decorators, parameter decorators não podem modificar o comportamento diretamente — eles apenas registram metadados. São usados principalmente em frameworks de injeção de dependência (como @Inject no Angular) para marcar parâmetros que devem ser injetados.', exemplo: 'function Inject(target: any, key: string, index: number) { Reflect.defineMetadata("inject", index, target, key); }' }
        ],
        exercicio: 'Crie um decorator @readonly para propriedades.'
      },
      {
        dia: 3,
        titulo: 'Módulos e Import/Export',
        teoria: 'TypeScript usa módulos ES6 para organizar código. Export e import permitem compartilhar tipos e valores.',
        topicos: [
          { titulo: 'ES Modules', descricao: 'ES Modules (ECMAScript Modules) são o sistema de módulos padrão do JavaScript moderno e do TypeScript. Cada arquivo é um módulo com seu próprio escopo, e variáveis/funções só são acessíveis a outros módulos se forem explicitamente exportadas. Módulos ajudam a organizar código, prevenir conflitos de nomes e facilitar o reuso. TypeScript usa ES Modules por padrão e compila para o formato de módulo configurado no tsconfig.json.', exemplo: '// utils.ts: export function somar(a: number, b: number): number { return a + b; }' },
          { titulo: 'Export/Import', descricao: 'A sintaxe export expõe valores de um módulo: export function somar() {}. A sintaxe import consome valores exportados: import { somar } from "./math". Você pode exportar e importar variáveis, funções, classes, types e interfaces. Named exports permitem múltiplas exportações por módulo, enquanto default exports oferecem uma exportação principal. Ambos podem coexistir no mesmo módulo.', exemplo: 'import { somar } from "./utils"; import * as Utils from "./utils";' },
          { titulo: 'Re-exporting', descricao: 'Re-exporting permite importar e imediatamente exportar valores de outro módulo: export { funcao } from "./outro-modulo". Isso é útil para barrel files (arquivos index.ts) que agrupam e re-exportam módulos relacionados, simplificando os imports para quem consome. Você pode renomear durante re-export: export { funcao as novaFuncao }. Re-exporting também suporta export * from para exportar tudo de um módulo.', exemplo: 'export { validaEmail } from "./validators"; export * from "./types";' },
          { titulo: 'Barrel files', descricao: 'Barrel files são arquivos index.ts que agrupam e re-exportam múltiplos módulos de um diretório. Por exemplo, uma pasta services pode ter um index.ts que re-exporta todos os serviços. Isso permite que consumidores importem de um ponto central: import { AuthService, UserService } from "./services". Barrel files simplificam imports e organizam a API pública de módulos.', exemplo: '// services/index.ts: export { AuthService } from "./auth"; export { UserService } from "./user";' }
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
          { titulo: 'Declaration merging', descricao: 'Declaration merging é um recurso do TypeScript onde múltiplas declarações com o mesmo nome são automaticamente combinadas. Isso funciona com interfaces, namespaces e enums. Por exemplo, você pode declarar a mesma interface em dois lugares e TypeScript as mescla em uma só. Isso é útil para estender tipos de bibliotecas de terceiros. Com namespaces, declaration merging permite adicionar membros a um namespace existente.', exemplo: 'interface Usuario { nome: string; } interface Usuario { idade: number; } // mesclado: { nome: string; idade: number }' },
          { titulo: 'Namespaces vs Modules', descricao: 'Namespaces (antes chamados de "internal modules") são uma forma antiga de organização de código do TypeScript, anterior à adoção de ES Modules. Eles criam um objeto global que contém os membros exportados. Hoje, modules (arquivos com import/export) são a forma recomendada. Namespaces ainda são úteis para agrupar código relacionado em um único arquivo e para declarações de tipos globais.', exemplo: 'namespace Validacao { export function email(valor: string) { return valor.includes("@"); } }' },
          { titulo: 'Quando usar cada um', descricao: 'Modules são a escolha padrão para organização de código em projetos TypeScript modernos. Namespaces são úteis em cenários específicos: arquivos de declaração (.d.ts) para bibliotecas globais, código legado que usa namespaces, e quando você quer agrupar tipos relacionados em um único arquivo. Em projetos novos, prefira sempre modules. Namespaces podem coexistir com modules, mas é recomendado não misturá-los.', exemplo: '// Prefira: import { algo } from "./modulo"; // Evite: namespace App { export function algo() {} }' },
          { titulo: 'Triple-slash directives', descricao: 'Triple-slash directives (/// <reference path="..." />) são comentários especiais que instruem o compilador TypeScript sobre dependências entre arquivos. Eram usadas antes de ES Modules se tornarem padrão e ainda são necessárias em alguns contextos: arquivos de declaração (.d.ts) e referências a bibliotecas globais. Em código moderno, prefira import em vez de triple-slash directives sempre que possível.', exemplo: '/// <reference path="./tipos.d.ts" /> /// <reference types="node" />' }
        ],
        exercicio: 'Converta um namespace para módulos ES6.'
      },
      {
        dia: 5,
        titulo: 'Type Definitions e d.ts',
        teoria: 'Arquivos .d.ts definem tipos para bibliotecas JavaScript. Permitem usar JS no TypeScript com tipagem completa.',
        topicos: [
          { titulo: 'Declaration files', descricao: 'Arquivos .d.ts (declaration files) contêm apenas tipos, sem implementação. Eles descrevem a forma de bibliotecas JavaScript para que o TypeScript possa entender seus tipos. TypeScript gera automaticamente .d.ts para seus próprios módulos quando a opção declaration: true está ativa. Declaration files são a ponte entre JavaScript e TypeScript.', exemplo: '// meu-modulo.d.ts: export function saudar(nome: string): string;' },
          { titulo: 'global vs module', descricao: 'Arquivos .d.ts podem declarar tipos no escopo global ou no escopo de módulo. Declarações globais (sem import/export) são visíveis em todo o projeto sem necessidade de import. Isso é comum para tipos de bibliotecas que expõem variáveis globais (como $ do jQuery). Declarações de módulo são escopadas ao módulo que as importa. O tipo de declaração depende de como a biblioteca é consumida.', exemplo: '// global.d.ts: declare var $: (sel: string) => any;' },
          { titulo: 'Ambient declarations', descricao: 'Ambient declarations (declarações de ambiente) usam declare para dizer ao TypeScript que algo existe sem fornecer implementação. Por exemplo: declare function $(selector: string): any para jQuery. Ambient declarations são colocadas em arquivos .d.ts e informam ao compilador sobre valores que existirão em tempo de execução. Elas também podem declarar módulos completos: declare module "minha-biblioteca".', exemplo: 'declare module "minha-biblioteca" { export function helper(): void; }' },
          { titulo: 'DefinitelyTyped', descricao: 'DefinitelyTyped é um repositório mantido pela comunidade que contém milhares de declaration files para bibliotecas JavaScript populares. Os pacotes são distribuídos via npm com o prefixo @types, como @types/react ou @types/lodash. Quando você instala um pacote @types, o TypeScript automaticamente encontra e usa as definições de tipo. É a forma recomendada de obter tipos para bibliotecas que não têm tipos nativos.', exemplo: '// npm install @types/react  => import React from "react"; // tipos automáticos' }
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
    instrucoes: 'Esta é a semana de consolidação de tudo que você aprendeu. Os tópicos focam em arquitetura de projetos, consumo de APIs e padrões de design — habilidades essenciais para o mercado de trabalho. Aproveite para revisar conceitos anteriores sempre que encontrar dificuldade. O último dia é dedicado à preparação para Angular, então certifique-se de entender bem decorators e injeção de dependência. O projeto final integrador é sua chance de demonstrar domínio do TypeScript — capriche!',
    dias: [
      {
        dia: 1,
        titulo: 'Arquitetura de Projeto',
        teoria: 'Organizar um projeto TypeScript profissional envolve estruturas de pastas, convenções e boas práticas.',
        topicos: [
          { titulo: 'Estrutura de pastas', descricao: 'Uma estrutura de pastas bem organizada é fundamental para a escalabilidade do projeto. Uma convenção comum é separar por funcionalidade ou por tipo (components, services, utils, types, hooks, etc.). A estrutura deve ser intuitiva para que novos desenvolvedores encontrem rapidamente o que precisam. Projetos TypeScript geralmente têm uma pasta src/ com submódulos e uma pasta dist/ para o código compilado. A consistência na nomenclatura e organização é mais importante que seguir uma convenção específica.', exemplo: '// src/components/Button.tsx | src/services/api.ts | src/types/usuario.ts' },
          { titulo: 'Barrel exports', descricao: 'Barrel exports são arquivos index.ts que centralizam exports de um módulo. Em vez de importar de vários arquivos individuais, você importa tudo de um barrel: import { ComponenteA, ComponenteB } from "./components". Isso reduz a complexidade dos imports e permite reorganizar a estrutura interna sem afetar os consumidores. Cada pasta de funcionalidade deve ter seu barrel file exportando a API pública.', exemplo: '// components/index.ts: export { Botao } from "./Botao"; export { Input } from "./Input";' },
          { titulo: 'Configuração tsconfig', descricao: 'O tsconfig.json controla quase todos os aspectos da compilação TypeScript. Opções importantes incluem strict: true (modo estrito com todas as verificações), target (versão do JavaScript de saída), module (sistema de módulos), outDir (diretório de saída) e rootDir (diretório raiz do código fonte). É importante entender cada opção para configurar o projeto corretamente. Para projetos que usam React ou frameworks, configurações adicionais como jsx: "react-jsx" são necessárias.', exemplo: '// tsconfig.json: { "compilerOptions": { "strict": true, "target": "ES2022", "outDir": "./dist" } }' },
          { titulo: 'Path aliases', descricao: 'Path aliases (definidos no tsconfig.json) permitem criar atalhos para imports, evitando caminhos relativos profundos como ../../../components/Button. Por exemplo, @/components/* mapeia para src/components/*. Isso torna os imports mais limpos e facilita a reorganização de pastas. Path aliases são configurados em paths no tsconfig.json e também podem precisar de configuração no bundler (Vite, Webpack) para funcionar corretamente.', exemplo: '// tsconfig.json: { "paths": { "@/*": ["./src/*"] } } // import Botao from "@/components/Botao"' }
        ],
        exercicio: 'Configure um projeto com estrutura profissional.'
      },
      {
        dia: 2,
        titulo: 'Trabalhando com APIs',
        teoria: 'Consumir APIs em TypeScript requer tipagem de requests e responses. Axios e fetch podem ser fortemente tipados.',
        topicos: [
          { titulo: 'Typed fetch', descricao: 'A API fetch do JavaScript pode ser totalmente tipada em TypeScript para garantir que as respostas da API sejam tratadas corretamente. Você pode criar funções que retornam tipos específicos: async function getUsuario(id: number): Promise<Usuario>. O fetch retorna Response, que você converte com .json() e depois faz type assertion ou validação. Bibliotecas como zod podem ser usadas para validar a resposta em tempo de execução.', exemplo: 'async function getUsuario(id: number): Promise<{ nome: string; email: string }> { const res = await fetch(`/api/${id}`); return res.json(); }' },
          { titulo: 'Generic API client', descricao: 'Um cliente HTTP genérico usa generics para reutilizar a mesma lógica de requisição com diferentes tipos de resposta. Por exemplo: class ApiClient<T> { async get(endpoint: string): Promise<T> }. Cada entidade do sistema (Usuarios, Produtos) cria sua própria instância do cliente com o tipo específico. Isso elimina duplicação de código e mantém a segurança de tipos em todas as chamadas de API.', exemplo: 'class ApiClient<T> { async get(url: string): Promise<T> { const res = await fetch(url); return res.json(); } }' },
          { titulo: 'Error handling tipado', descricao: 'TypeScript permite criar tipos específicos para erros de API, modelando diferentes cenários como erro de rede, erro de autenticação, erro de validação, etc. Usando discriminated unions, você pode criar um tipo Resultado<T> que é { sucesso: true; dados: T } | { sucesso: false; erro: ErroAPI }. Isso força o tratamento de todos os casos de erro em tempo de compilação.', exemplo: 'type Resultado<T> = { sucesso: true; dados: T } | { sucesso: false; erro: string };' },
          { titulo: 'Type guards', descricao: 'Type guards são funções que verificam o tipo de um valor em tempo de execução e informam ao TypeScript sobre o tipo estreitado. Por exemplo: function isUsuario(obj: any): obj is Usuario { return "nome" in obj && "email" in obj }. Type guards são essenciais ao trabalhar com dados de APIs, onde você precisa validar que a resposta tem a forma esperada. Eles combinam verificação em tempo de execução com segurança de tipos em tempo de compilação.', exemplo: 'function isString(valor: unknown): valor is string { return typeof valor === "string"; }' }
        ],
        exercicio: 'Implemente um cliente HTTP tipado.'
      },
      {
        dia: 3,
        titulo: 'Padrões de Projeto em TypeScript',
        teoria: 'Padrões como Factory, Singleton, Repository são essenciais para código escalável em TypeScript.',
        topicos: [
          { titulo: 'Factory Pattern', descricao: 'O Factory Pattern cria objetos sem expor a lógica de criação ao cliente. Em TypeScript, factories podem ser funções ou métodos estáticos que retornam objetos tipados. O padrão é útil quando a criação envolve lógica complexa, validação ou escolha entre diferentes implementações. TypeScript permite que factories retornem tipos genéricos ou união de tipos, mantendo a segurança de tipos. É amplamente usado em bibliotecas de UI e injeção de dependência.', exemplo: 'function criarUsuario(nome: string): Usuario { return { id: Date.now(), nome, criadoEm: new Date() }; }' },
          { titulo: 'Singleton', descricao: 'O Singleton garante que uma classe tenha apenas uma instância e forneça acesso global a ela. Em TypeScript, pode ser implementado com uma propriedade estática que armazena a instância única e um método estático getInstance(). O constructor deve ser privado para evitar criação direta com new. Singletons são úteis para serviços de configuração, logging e gerenciamento de estado global, mas devem ser usados com moderação.', exemplo: 'class Logger { private static instancia: Logger; private constructor() {} static getInstance() { if (!Logger.instancia) Logger.instancia = new Logger(); return Logger.instancia; } }' },
          { titulo: 'Repository Pattern', descricao: 'O Repository Pattern abstrai o acesso a dados, fornecendo uma interface limpa para operações CRUD. Em TypeScript, repositories são classes ou interfaces genéricas que definem métodos como findAll, findById, create, update, delete. A implementação concreta pode usar arrays, localStorage, IndexedDB ou APIs REST. Esse padrão facilita testes (mocks) e troca de fontes de dados sem impacto no resto do sistema.', exemplo: 'interface Repositorio<T> { findAll(): T[]; findById(id: number): T | undefined; salvar(item: T): void; }' },
          { titulo: 'Dependency Injection', descricao: 'Injeção de Dependência (DI) é um padrão onde as dependências de uma classe são fornecidas externamente em vez de criadas internamente. TypeScript facilita DI com interfaces e tipagem forte. Embora não tenha um container DI nativo (como Angular), você pode implementar DI manualmente ou usar bibliotecas como tsyringe ou inversify. DI promove baixo acoplamento, facilita testes e torna o código mais modular e flexível.', exemplo: 'class Servico { constructor(private repositorio: Repositorio<Usuario>) {} }' }
        ],
        exercicio: 'Implemente o Repository Pattern para um CRUD.'
      },
      {
        dia: 4,
        titulo: 'Preparação: Angular e TypeScript',
        teoria: 'Angular usa TypeScript nativamente. Conhecer decorators, injeção de dependência e tipagem forte é essencial.',
        topicos: [
          { titulo: 'Angular CLI e TypeScript', descricao: 'O Angular CLI (Command Line Interface) é a ferramenta oficial para criar e gerenciar projetos Angular. Ele usa TypeScript como linguagem padrão e gera automaticamente a configuração do tsconfig.json com opções otimizadas para Angular. Comandos como ng generate component, ng generate service criam arquivos .ts com a estrutura correta. O CLI também lida com compilação, servidor de desenvolvimento e build de produção.', exemplo: '// ng new meu-app --strict && ng generate component dashboard' },
          { titulo: 'Decorators (@Component, @Injectable)', descricao: 'Angular usa extensivamente decorators do TypeScript para configurar classes. @Component define metadados como seletor, template e estilos de um componente. @Injectable marca uma classe como disponível para injeção de dependência. @Input e @Output definem propriedades e eventos de componentes. Entender decorators é fundamental para trabalhar com Angular, pois eles são a principal forma de configuração do framework.', exemplo: '@Component({ selector: "app-root", template: "<h1>Olá</h1>" }) class AppComponent {}' },
          { titulo: 'Typing em templates', descricao: 'Os templates HTML do Angular podem ser tipados graças ao TypeScript. Propriedades do componente são acessíveis no template com tipagem completa, permitindo autocomplete e verificação de tipos. Diretivas estruturais como *ngFor e *ngIf funcionam com tipos inferidos. Event bindings (click) verificam os tipos dos eventos. O TypeScript também permite criar pipes e diretivas tipadas para extensões do template.', exemplo: '// <p *ngIf="usuario$ | async as usuario">{{ usuario.nome }}</p> // usuario$: Observable<Usuario>' },
          { titulo: 'RxJS e Generics', descricao: 'RxJS (Reactive Extensions for JavaScript) é uma biblioteca de programação reativa amplamente usada no Angular. Ela faz uso intenso de generics: Observable<T>, Subject<T>, BehaviorSubject<T>. Operadores como map, filter, switchMap são funções genéricas que transformam e combinam streams de dados. A combinação de RxJS com TypeScript permite criar pipelines de dados tipados e seguros, detectando erros de tipo em tempo de compilação.', exemplo: 'import { Observable, map } from "rxjs"; const numeros$ = new Observable<number>((s) => { s.next(1); });' }
        ],
        exercicio: 'Configure um mini-projeto Angular.'
      },
      {
        dia: 5,
        titulo: 'Projeto Final: Dashboard de Estudos',
        teoria: 'Vamos construir o projeto completo integrando todos os conceitos aprendidos ao longo do curso.',
        topicos: [
          { titulo: 'Integração de todos os conceitos', descricao: 'Este projeto final é o momento de aplicar tudo que você aprendeu: interfaces para modelar dados, classes para lógica de negócio, generics para componentes reutilizáveis, e decorators (se aplicável). A integração harmoniosa desses conceitos produz código limpo, seguro e de fácil manutenção. Cada conceito aprendido tem seu papel na arquitetura final do projeto.', exemplo: 'interface Item { id: number; nome: string; } class Gerenciador<T extends Item> { constructor(private items: T[] = []) {} listar(): T[] { return this.items; } }' },
          { titulo: 'Revisão geral', descricao: 'Esta é uma oportunidade de revisar os principais conceitos do curso: tipos básicos, interfaces, funções tipadas, generics, classes, módulos e decorators. Volte aos dias anteriores se sentir que precisa reforçar algum tópico específico. A revisão ativa (reescrever exemplos, modificar código) é mais eficaz que a leitura passiva.', exemplo: '// Revisão rápida: let nome: string; function somar<T>(a: T, b: T): T; interface Animal { nome: string; } class Cachorro implements Animal { nome = "Rex"; }' },
          { titulo: 'Próximos passos', descricao: 'Após concluir este curso, você está pronto para explorar Angular com TypeScript, se aprofundar em Node.js com TypeScript, ou estudar padrões avançados como Conditional Types e Template Literal Types. Considere contribuir para projetos open source em TypeScript para ganhar experiência prática. Continue praticando diariamente — a fluência em TypeScript vem com o uso consistente.', exemplo: '// Explore mais: type Conditional<T> = T extends string ? "texto" : "outro";' }
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
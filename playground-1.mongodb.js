/* ============================================================================
   PROJETO FINAL AV2 - BANCO DE DADOS NoSQL (MONGODB)
   Aluno(a): [Seu Nome Aqui] | Turma: [Sua Turma]
   Cenário Escolhido: Opção C - E-Commerce de Tecnologia e Hardware
   
   Justificativa (Por que NoSQL e não SQL?):
   Escolhi o MongoDB para essa loja de hardware porque cada tipo de peça tem
   especificações muito diferentes (um processador tem socket e núcleos, um 
   monitor tem polegadas e taxa de atualização, um mouse tem DPI). No banco 
   relacional (SQL), a gente ia ter que criar várias tabelas separadas ou deixar 
   um monte de coluna vazia (NULL). Aqui no NoSQL, graças ao esquema flexível 
   (schema-less), conseguimos guardar tudo na mesma coleção de produtos sem dor 
   de cabeça, além de facilitar o crescimento do sistema (escalabilidade horizontal) 
   em épocas de muito acesso, tipo Black Friday.
============================================================================ */

// ============================================================================
// ETAPA 1: ARQUITETURA, MODELAGEM E POVOAMENTO
// ============================================================================

// Criando e selecionando o banco de dados do projeto
use('ProjetoAV2_TechStoreDB');

// Limpando as coleções antes de rodar (caso precise testar o script várias vezes)
db.Produtos.drop();
db.Pedidos.drop();

// Inserindo 1 produto usando insertOne()
// Aqui já dá pra ver um documento incorporado (especificacoes) e um array (tags)
db.Produtos.insertOne({
  nome: "Processador Ryzen 7 5700X",
  categoria: "Hardware",
  marca: "AMD",
  preco: 1150.00,
  estoque: 15,
  ativo: true,
  especificacoes: {
    socket: "AM4",
    nucleos: 8,
    threads: 16,
    clock_base: "3.4GHz"
  },
  tags: ["processador", "amd", "gamer", "promocao"]
});

// Inserindo mais 4 produtos usando insertMany()
// Repare que o objeto 'especificacoes' muda de acordo com o produto (schema-less)
db.Produtos.insertMany([
  {
    nome: "Monitor Gamer 24 Polegadas",
    categoria: "Monitores",
    marca: "LG",
    preco: 899.90,
    estoque: 8,
    ativo: true,
    especificacoes: {
      tamanho: "24 pol",
      taxa_atualizacao: "144Hz",
      painel: "IPS"
    },
    tags: ["monitor", "144hz", "fullhd"]
  },
  {
    nome: "Mouse Sem Fio Logitech G Pro",
    categoria: "Perifericos",
    marca: "Logitech",
    preco: 650.00,
    estoque: 20,
    ativo: true,
    especificacoes: {
      dpi_maximo: 25600,
      peso: "63g",
      conexao: "Wireless"
    },
    tags: ["mouse", "sem fio", "esports"]
  },
  {
    nome: "Placa de Vídeo RTX 4060",
    categoria: "Hardware",
    marca: "NVIDIA",
    preco: 2100.00,
    estoque: 5,
    ativo: true,
    especificacoes: {
      vram: "8GB GDDR6",
      consumo: "115W",
      ray_tracing: true
    },
    tags: ["gpu", "placa de video", "rtx"]
  },
  {
    nome: "Cabo HDMI 2.0 2 Metros",
    categoria: "Acessorios",
    marca: "Generica",
    preco: 35.00,
    estoque: 50,
    ativo: false, // Produto fora de linha para testar exclusão depois
    especificacoes: {
      comprimento: "2m",
      resolucao_suportada: "4K"
    },
    tags: ["cabo", "hdmi"]
  }
]);

// Inserindo 4 pedidos na segunda coleção (totalizando 9 documentos no banco)
// Aqui usamos um array de objetos incorporados para os itens comprados
db.Pedidos.insertMany([
  {
    cliente: "Lucas Mendes",
    cidade: "São Paulo",
    status: "Concluido",
    forma_pagamento: "PIX",
    valor_total: 2049.90,
    itens: [
      { produto: "Processador Ryzen 7 5700X", qtd: 1, preco_unitario: 1150.00 },
      { produto: "Monitor Gamer 24 Polegadas", qtd: 1, preco_unitario: 899.90 }
    ]
  },
  {
    cliente: "Mariana Costa",
    cidade: "Campinas",
    status: "Concluido",
    forma_pagamento: "Cartao de Credito",
    valor_total: 2100.00,
    itens: [
      { produto: "Placa de Vídeo RTX 4060", qtd: 1, preco_unitario: 2100.00 }
    ]
  },
  {
    cliente: "Pedro Henrique",
    cidade: "São Paulo",
    status: "Concluido",
    forma_pagamento: "PIX",
    valor_total: 1300.00,
    itens: [
      { produto: "Mouse Sem Fio Logitech G Pro", qtd: 2, preco_unitario: 650.00 }
    ]
  },
  {
    cliente: "Ana Clara",
    cidade: "Hortolândia",
    status: "Cancelado",
    forma_pagamento: "Boleto",
    valor_total: 899.90,
    itens: [
      { produto: "Monitor Gamer 24 Polegadas", qtd: 1, preco_unitario: 899.90 }
    ]
  }
]);


// ============================================================================
// ETAPA 2: CONSULTAS DE LEITURA E FILTROS AVANÇADOS (FIND)
// ============================================================================

// 1. Busca com operador de comparação numérica ($gt = maior que)
// Objetivo: Listar produtos que custam mais de R$ 1000,00
db.Produtos.find({
  preco: { $gt: 1000 }
});

// 2. Busca com operador de lista ($in)
// Objetivo: Filtrar produtos que sejam apenas das categorias Hardware ou Perifericos
db.Produtos.find({
  categoria: { $in: ["Hardware", "Perifericos"] }
});

// 3. Busca com projeção (mostrando apenas nome, preco e estoque, e escondendo o _id)
db.Produtos.find(
  { ativo: true }, // filtro
  { _id: 0, nome: 1, preco: 1, estoque: 1 } // projeção
);


// ============================================================================
// ETAPA 3: MANIPULAÇÃO E MANUTENÇÃO DE DADOS (UPDATE E DELETE)
// ============================================================================

// 1. updateOne() com $set: Atualizando o preço de um único produto (baixando o valor do monitor)
db.Produtos.updateOne(
  { nome: "Monitor Gamer 24 Polegadas" },
  { $set: { preco: 849.90 } }
);

// 2. updateMany() com $set: Aplicando um status de 'frete_gratis: true' em todos os produtos de Hardware
db.Produtos.updateMany(
  { categoria: "Hardware" },
  { $set: { frete_gratis: true } }
);

// 3. updateOne() com $push: Adicionando uma nova tag no array do Mouse sem apagar as antigas
db.Produtos.updateOne(
  { nome: "Mouse Sem Fio Logitech G Pro" },
  { $push: { tags: "mais-vendido" } }
);

// 4. deleteMany() com filtro seguro: Removendo pedidos cancelados do sistema
db.Pedidos.deleteMany({
  status: "Cancelado"
});


// ============================================================================
// ETAPA 4: INTELIGÊNCIA ANALÍTICA COM AGGREGATION PIPELINE
// ============================================================================

// Pipeline 1: Relatório de vendas concluídas agrupadas por cidade
// Mostra quanto cada cidade faturou no total, ordenado do maior para o menor
db.Pedidos.aggregate([
  // Passo 1: Filtra só os pedidos que deram certo
  { 
    $match: { status: "Concluido" } 
  },
  // Passo 2: Agrupa por cidade e soma o valor_total
  { 
    $group: { 
      _id: "$cidade", 
      total_faturado: { $sum: "$valor_total" },
      qtd_pedidos: { $sum: 1 }
    } 
  },
  // Passo 3: Ordena do maior faturamento para o menor (-1)
  { 
    $sort: { total_faturado: -1 } 
  }
]);

// Pipeline 2: Relatório formatado de média de preço por categoria de produto
// Usa $project para esconder o _id e deixar os nomes bonitos para apresentar
db.Produtos.aggregate([
  // Passo 1: Pega apenas produtos ativos na loja
  { 
    $match: { ativo: true } 
  },
  // Passo 2: Agrupa por categoria e tira a média de preço ($avg)
  { 
    $group: { 
      _id: "$categoria", 
      preco_medio: { $avg: "$preco" },
      total_itens_estoque: { $sum: "$estoque" }
    } 
  },
  // Passo 3: Formata a saída escondendo o _id padrão e renomeando os campos
  { 
    $project: { 
      _id: 0,
      Categoria: "$_id",
      Media_Preco_Reais: { $round: ["$preco_medio", 2] }, // arredonda para 2 casas decimais
      Estoque_Disponivel: "$total_itens_estoque"
    } 
  }
]);
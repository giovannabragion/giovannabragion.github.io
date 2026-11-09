/*
  CONTEÚDO DE EXEMPLO
  -------------------
  Baseado no Currículo Lattes dela (versão de 21/10/2026), mas com textos
  escritos em primeira pessoa só como ponto de partida. Datas com dia e mês
  são aproximadas: o Lattes só informa o ano.

  Este arquivo é usado:
   - no MODO DEMONSTRAÇÃO (quando js/config.js está vazio);
   - para gerar supabase/exemplos.sql, que coloca estes exemplos no banco.

  As "fotos" com nome de cena (por exemplo "mar" ou "falesia") são desenhos
  provisórios. Ela troca por fotos de verdade pela área de edição.
*/

window.SITE = {
  nome: "Giovanna da Rocha Bragion",
  apelido: "Lua",
  frase: "Estudante de Oceanografia na USP e pesquisadora de iniciação científica. Investigo como os microplásticos carregam metais pelo litoral, do Paraná às Ilhas Canárias.",
  sobre: [
    "Sou estudante de graduação em Oceanografia no Instituto Oceanográfico da Universidade de São Paulo (IOUSP).",
    "Faço iniciação científica com bolsa da FAPESP no **ProxyMar**, o Laboratório de Proxies Marinhos para o Futuro do Oceano, no IOUSP. Minha pesquisa estuda os **microplásticos** e os **metais** que ficam presos na superfície deles em praias e sedimentos costeiros.",
    "Em 2026 levei essa pesquisa para a Universidad de La Laguna, em Tenerife, nas Ilhas Canárias, para comparar o litoral do Paraná com o de lá.",
    "Este espaço é o meu caderno de campo: cada experiência vira um registro, com fotos, lugares e o que aprendi.",
  ],
  formacao: [
    { titulo: "Graduação em Oceanografia (em andamento)", lugar: "Universidade de São Paulo (IOUSP)", periodo: "2024 – atual" },
    { titulo: "Intercâmbio de pesquisa", lugar: "Universidad de La Laguna, Tenerife (Espanha)", periodo: "2026" },
    { titulo: "Curso de Poluição Marinha (6 h)", lugar: "Instituto Oceanográfico da USP", periodo: "2024" },
    { titulo: "Ensino Médio", lugar: "Etec Comendador João Rays", periodo: "2021 – 2023" },
  ],
  competencias: [
    "Extração e triagem de microplásticos",
    "Estereomicroscopia",
    "Espectroscopia FTIR",
    "Digestão ácida (USEPA 3050B)",
    "ICP-OES e ICP-MS",
    "Coleta de sedimentos costeiros",
  ],
  idiomas: ["Português (nativo)", "Inglês (avançado)", "Espanhol (intermediário)"],
  contatos: {
    email: "email@exemplo.com",
    linkedin: "https://www.linkedin.com/",
    lattes: "http://lattes.cnpq.br/4550484678979000",
    instagram: "https://www.instagram.com/gi_bragion_/",
  },
  curriculo: "#", // link do PDF do currículo (ela envia pela área de edição)
  fotoPerfil: { cena: "mata", seed: 3 },
};

window.CATEGORIAS = {
  embarques:    { nome: "Embarques",    icone: "⚓" },
  intercambio:  { nome: "Intercâmbio",  icone: "✈" },
  pesquisa:     { nome: "Pesquisa",     icone: "🔬" },
  campo:        { nome: "Saídas de campo", icone: "🧭" },
  eventos:      { nome: "Eventos",      icone: "🎤" },
};

window.POSTS = [
  {
    id: "tenerife",
    titulo: "Microplásticos do outro lado do Atlântico",
    data: "2026-03-01",
    local: "Universidad de La Laguna, Tenerife, Ilhas Canárias",
    lat: 28.48, lon: -16.32,
    categoria: "intercambio",
    resumo: "Levei minha pesquisa para Tenerife e comparei os metais presos em microplásticos das praias das Canárias com os do litoral do Paraná.",
    texto: [
      "Em 2026 fui para a Universidad de La Laguna, em Tenerife, para um estudo comparativo: a mesma metodologia aplicada em sedimentos costeiros do **Paraná** e das **Ilhas Canárias**.",
      "Coletamos sedimentos superficiais, extraímos e triamos os microplásticos, e identificamos o tipo (fragmentos, fibras, pellets) e o polímero de cada um com estereomicroscopia e FTIR.",
      "Usar o mesmo método nos dois lados do Atlântico ajuda a entender o que muda de um ambiente para o outro: o formato da partícula, o tipo de plástico ou as condições da costa.",
      "*Trabalho feito com a orientação da Profa. Renata Hanae Nagai (IOUSP) e a colaboração de Javier Hernández-Borges (ULL), com bolsa da FAPESP.*",
    ],
    fotos: [
      { cena: "falesia", seed: 1, legenda: "Costa de Tenerife" },
      { cena: "costao", seed: 2, legenda: "Praia de rocha vulcânica" },
      { cena: "montanha", seed: 4, legenda: "Paisagem vulcânica" },
      { cena: "mar", seed: 5, legenda: "Atlântico" },
    ],
  },
  {
    id: "superagui",
    titulo: "Coletas na Ilha do Superagui e em Pontal do Sul",
    data: "2025-07-01",
    local: "Ilha do Superagui, Paraná",
    lat: -25.46, lon: -48.25,
    categoria: "campo",
    resumo: "As duas praias do litoral do Paraná onde coleto os sedimentos da minha iniciação científica.",
    texto: [
      "A minha pesquisa acontece em duas praias do litoral paranaense: a **Ilha do Superagui** e **Pontal do Sul**. As coletas de sedimento são sazonais, para ver se o que encontramos muda ao longo do ano.",
      "Em campo, o trabalho é recolher o sedimento da praia de forma padronizada. Depois, no laboratório, as amostras são peneiradas e triadas, e os microplásticos são separados com técnicas como o teste da agulha quente.",
    ],
    fotos: [
      { cena: "praia", seed: 13, legenda: "Faixa de areia" },
      { cena: "mata", seed: 10, legenda: "Caminho até a praia" },
      { cena: "costao", seed: 9, legenda: "Pontal do Sul" },
    ],
  },
  {
    id: "proxymar",
    titulo: "Metais presos em microplásticos: minha IC na FAPESP",
    data: "2025-03-01",
    local: "Laboratório ProxyMar, IOUSP, São Paulo",
    lat: -23.56, lon: -46.72,
    categoria: "pesquisa",
    resumo: "Como os microplásticos podem carregar metais pesados pelas praias, e como a gente mede isso no laboratório.",
    texto: [
      "Microplásticos são partículas de plástico menores que 5 mm. Na praia, eles podem funcionar como pequenos \"carregadores\" de metais pesados, que ficam presos na superfície deles.",
      "Na minha iniciação científica, com bolsa da FAPESP no **ProxyMar**, eu caracterizo a composição química dos microplásticos e meço os metais adsorvidos (Al, Cd, Cr, Cu, Fe, Mn, Sn, Ti e Zn) usando **ICP-OES** e **ICP-MS**.",
      "Os primeiros resultados já confirmaram metais presos em pellets plásticos das praias estudadas. O próximo passo é relacionar o tipo de partícula com a quantidade de metal e ver se isso muda com as estações do ano.",
    ],
    fotos: [
      { cena: "lua", seed: 7, legenda: "Noites de laboratório" },
      { cena: "mar", seed: 8, legenda: "De onde vêm as amostras" },
    ],
  },
  {
    id: "sediment-profile",
    titulo: "Fotografando o fundo do mar na costa de São Paulo",
    data: "2025-05-01",
    local: "Plataforma continental de São Paulo",
    lat: -24.05, lon: -46.3,
    categoria: "embarques",
    resumo: "Participei dos primeiros registros com Sediment Profile Imagery na costa paulista, uma câmera que fotografa o sedimento por dentro.",
    texto: [
      "A *Sediment Profile Imagery* é uma câmera que desce até o fundo, entra no sedimento e tira uma foto do perfil, como se fosse um corte lateral do fundo do mar.",
      "Participei dos primeiros registros desse método na região costeira de São Paulo. O trabalho virou um resumo apresentado no **VII Simpósio Brasileiro de Geologia e Geofísica Marinha**, em Vitória (ES).",
    ],
    diario: { navio: "Embarcação do IOUSP", coordenadas: "Costa de São Paulo", profundidade: "plataforma interna", dias: "1" },
    fotos: [
      { cena: "navio", seed: 6, legenda: "Saída para o embarque" },
      { cena: "mar", seed: 14, legenda: "Ponto de coleta" },
    ],
  },
  {
    id: "pub-antartica",
    titulo: "Primeira pesquisa: do Atlântico Sul à Antártica",
    data: "2024-09-01",
    local: "Instituto Oceanográfico da USP, São Paulo",
    lat: -23.555, lon: -46.73,
    categoria: "pesquisa",
    resumo: "Minha primeira bolsa de pesquisa, estudando microplásticos e metais em ambientes costeiros do Atlântico Sul e da Antártica.",
    texto: [
      "Entre 2024 e 2025 fiz minha primeira pesquisa, com bolsa do Programa Unificado de Bolsas da USP: \"Microplásticos e metais associados no ambiente costeiro do Atlântico Sul e Antártica\".",
      "Foi onde aprendi as técnicas que uso até hoje: extração de microplásticos, estereomicroscopia, digestão ácida e espectrometria (ICP-OES/MS).",
    ],
    fotos: [
      { cena: "por-do-sol", seed: 11, legenda: "Fim de tarde no IOUSP" },
    ],
  },
  {
    id: "siicusp",
    titulo: "Apresentando no SIICUSP e no Congresso Brasileiro de Geoquímica",
    data: "2025-10-01",
    local: "Universidade de São Paulo, São Paulo",
    lat: -23.56, lon: -46.73,
    categoria: "eventos",
    resumo: "Em 2025 apresentei meu trabalho sobre microplásticos e metais em dois eventos científicos.",
    texto: [
      "Apresentei o trabalho \"Microplásticos e metais associados em ambientes costeiros do Atlântico Sul e da Antártica\" no **Simpósio Internacional de Iniciação Científica e Tecnológica da USP (SIICUSP)** e no **Congresso Brasileiro de Geoquímica**.",
      "Também participei do Workshop sobre o talude continental da Bacia de Santos e, em 2026, do II Seminário sobre Monitoramento de Microplásticos.",
    ],
    fotos: [
      { cena: "por-do-sol", seed: 15, legenda: "Dia de apresentação" },
    ],
  },
];

// Marcos da linha do tempo que não são posts
window.MARCOS = [
  { data: "2023-12-01", titulo: "Conclusão do Ensino Médio", texto: "Etec Comendador João Rays." },
  { data: "2024-02-01", titulo: "Entrada no IOUSP", texto: "Começo da graduação em Oceanografia na USP." },
  { data: "2024-11-01", titulo: "Primeira apresentação em congresso", texto: "Microplásticos e metais associados em praias do litoral do Paraná." },
];

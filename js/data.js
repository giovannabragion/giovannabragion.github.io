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
  frase: "✏️ Aqui escreva uma frase curta de apresentação: quem você é e o que te move no oceano.",
  sobre: [
    "Sou estudante de graduação em Oceanografia no Instituto Oceanográfico da Universidade de São Paulo (IOUSP).",
    "Faço iniciação científica com bolsa da FAPESP no **ProxyMar**, o Laboratório de Proxies Marinhos para o Futuro do Oceano, no IOUSP. Minha pesquisa estuda os **microplásticos** e os **metais** que ficam presos na superfície deles em praias e sedimentos costeiros.",
    "Em 2026 levei essa pesquisa para a Universidad de La Laguna, em Tenerife, nas Ilhas Canárias, para comparar o litoral do Paraná com o de lá.",
    "*✏️ Aqui escreva um pouco sobre você, do seu jeito: por que escolheu a Oceanografia, o que mais gosta de fazer em campo, o que quer para o futuro.*",
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
  // Lugares por onde passou, sem experiência escrita (tirados dos destaques do Instagram dela).
  // O ano fica em branco para ela completar.
  lugares: [
    { nome: "Rio de Janeiro, RJ", ano: "", lat: -22.9068, lon: -43.1729 },
    { nome: "Minas Gerais", ano: "", lat: -19.9167, lon: -43.9345 },
    { nome: "Florianópolis, SC", ano: "", lat: -27.5954, lon: -48.548 },
    { nome: "Nordeste", ano: "", lat: -8.0476, lon: -34.877 },
  ],
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
      "*✏️ Aqui escreva como foi viver e pesquisar em Tenerife: a chegada, a rotina na universidade, um lugar ou uma história que marcou.*",
      "*Trabalho feito com a orientação da Profa. Renata Hanae Nagai (IOUSP) e a colaboração de Javier Hernández-Borges (ULL), com bolsa da FAPESP.*",
    ],
    fotos: [
      { cena: "falesia", seed: 1, legenda: "legenda da foto" },
      { cena: "costao", seed: 2, legenda: "legenda da foto" },
      { cena: "montanha", seed: 4, legenda: "legenda da foto" },
      { cena: "mar", seed: 5, legenda: "legenda da foto" },
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
      "No laboratório, as amostras são peneiradas e triadas, e os microplásticos são separados com técnicas como o teste da agulha quente.",
      "*✏️ Aqui escreva como é um dia de coleta: a viagem até a praia, quem foi junto, o que é mais difícil e o que é mais bonito.*",
    ],
    fotos: [
      { cena: "praia", seed: 13, legenda: "legenda da foto" },
      { cena: "mata", seed: 10, legenda: "legenda da foto" },
      { cena: "costao", seed: 9, legenda: "legenda da foto" },
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
      "Microplásticos são partículas de plástico menores que 5 mm que podem atuar como vetores de metais pesados em ecossistemas costeiros.",
      "Na minha iniciação científica, com bolsa da FAPESP no **ProxyMar**, eu caracterizo a composição química dos microplásticos e meço os metais adsorvidos (Al, Cd, Cr, Cu, Fe, Mn, Sn, Ti e Zn) usando **ICP-OES** e **ICP-MS**.",
      "Os resultados preliminares confirmaram a presença de metais adsorvidos em pellets plásticos das áreas de estudo. A próxima etapa busca relacionar os morfotipos (fragmentos, fibras, pellets) com a adsorção de metais e avaliar variações sazonais.",
      "*✏️ Aqui escreva o que você mais gosta nessa pesquisa e como é a rotina no laboratório.*",
    ],
    fotos: [
      { cena: "lua", seed: 7, legenda: "legenda da foto" },
      { cena: "mar", seed: 8, legenda: "legenda da foto" },
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
      "O trabalho com os primeiros registros desse método na região costeira de São Paulo virou um resumo no **VII Simpósio Brasileiro de Geologia e Geofísica Marinha** (Vitória, ES, 2025).",
      "*✏️ Aqui escreva como foi o embarque: o barco, a equipe, quanto tempo no mar e o que você viu nas imagens.*",
    ],
    diario: { navio: "nome do navio ou barco", coordenadas: "ex.: 24°03'S 46°18'W", profundidade: "ex.: 30 m", dias: "ex.: 2" },
    fotos: [
      { cena: "navio", seed: 6, legenda: "legenda da foto" },
      { cena: "mar", seed: 14, legenda: "legenda da foto" },
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
      "Técnicas: extração de microplásticos, estereomicroscopia, digestão ácida e espectrometria (ICP-OES/MS). Orientação da Profa. Dra. Renata Hanae Nagai.",
      "*✏️ Aqui escreva como foi começar na pesquisa: o que te surpreendeu e o que aprendeu.*",
    ],
    fotos: [
      { cena: "por-do-sol", seed: 11, legenda: "legenda da foto" },
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
      "Também participei do Workshop sobre o talude continental da Bacia de Santos (2025 e 2026) e do II Seminário sobre Monitoramento de Microplásticos (2026).",
      "*✏️ Aqui escreva como foi apresentar: o nervosismo, as perguntas que recebeu, as pessoas que conheceu.*",
    ],
    fotos: [
      { cena: "por-do-sol", seed: 15, legenda: "legenda da foto" },
    ],
  },
];

// Marcos da linha do tempo que não são posts
window.MARCOS = [
  { data: "2023-12-01", titulo: "Conclusão do Ensino Médio", texto: "Etec Comendador João Rays." },
  { data: "2024-02-01", titulo: "Entrada no IOUSP", texto: "Começo da graduação em Oceanografia na USP." },
  { data: "2024-11-01", titulo: "Primeira apresentação em congresso", texto: "Microplásticos e metais associados em praias do litoral do Paraná." },
];

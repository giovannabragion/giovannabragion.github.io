-- =====================================================================
--  CONTEÚDO DE EXEMPLO (publicado)
--  Cole tudo no Supabase em: SQL Editor > New query > Run
--  Pode rodar mais de uma vez: ele substitui os exemplos anteriores,
--  sem mexer no que ela já tiver criado.
--  Para apagar só os exemplos depois: delete from public.posts where slug like 'exemplo-%';
-- =====================================================================

insert into public.perfil (id, dados) values (1, $json${"nome":"Giovanna da Rocha Bragion","apelido":"Lua","frase":"✏️ Aqui escreva uma frase curta de apresentação: quem você é e o que te move no oceano.","sobre":["Sou estudante de graduação em Oceanografia no Instituto Oceanográfico da Universidade de São Paulo (IOUSP).","Faço iniciação científica com bolsa da FAPESP no **ProxyMar**, o Laboratório de Proxies Marinhos para o Futuro do Oceano, no IOUSP. Minha pesquisa estuda os **microplásticos** e os **metais** que ficam presos na superfície deles em praias e sedimentos costeiros.","Em 2026 levei essa pesquisa para a Universidad de La Laguna, em Tenerife, nas Ilhas Canárias, para comparar o litoral do Paraná com o de lá.","*✏️ Aqui escreva um pouco sobre você, do seu jeito: por que escolheu a Oceanografia, o que mais gosta de fazer em campo, o que quer para o futuro.*"],"formacao":[{"titulo":"Graduação em Oceanografia (em andamento)","lugar":"Universidade de São Paulo (IOUSP)","periodo":"2024 – atual"},{"titulo":"Intercâmbio de pesquisa","lugar":"Universidad de La Laguna, Tenerife (Espanha)","periodo":"2026"},{"titulo":"Curso de Poluição Marinha (6 h)","lugar":"Instituto Oceanográfico da USP","periodo":"2024"},{"titulo":"Ensino Médio","lugar":"Etec Comendador João Rays","periodo":"2021 – 2023"}],"competencias":["Extração e triagem de microplásticos","Estereomicroscopia","Espectroscopia FTIR","Digestão ácida (USEPA 3050B)","ICP-OES e ICP-MS","Coleta de sedimentos costeiros"],"idiomas":["Português (nativo)","Inglês (avançado)","Espanhol (intermediário)"],"contatos":{"email":"email@exemplo.com","linkedin":"https://www.linkedin.com/","lattes":"http://lattes.cnpq.br/4550484678979000","instagram":"https://www.instagram.com/gi_bragion_/"},"curriculo":"#","fotoPerfil":{"cena":"mata","seed":3},"marcos":[{"data":"2023-12-01","titulo":"Conclusão do Ensino Médio","texto":"Etec Comendador João Rays."},{"data":"2024-02-01","titulo":"Entrada no IOUSP","texto":"Começo da graduação em Oceanografia na USP."},{"data":"2024-11-01","titulo":"Primeira apresentação em congresso","texto":"Microplásticos e metais associados em praias do litoral do Paraná."}]}$json$::jsonb)
on conflict (id) do update set dados = excluded.dados;

delete from public.posts where slug like 'exemplo-%';

insert into public.posts (slug, titulo, data, local, lat, lon, categoria, resumo, texto, diario, fotos, publicado) values
  ('exemplo-tenerife', 'Microplásticos do outro lado do Atlântico', '2026-03-01', 'Universidad de La Laguna, Tenerife, Ilhas Canárias', 28.48, -16.32, 'intercambio', 'Levei minha pesquisa para Tenerife e comparei os metais presos em microplásticos das praias das Canárias com os do litoral do Paraná.', 'Em 2026 fui para a Universidad de La Laguna, em Tenerife, para um estudo comparativo: a mesma metodologia aplicada em sedimentos costeiros do **Paraná** e das **Ilhas Canárias**.

Coletamos sedimentos superficiais, extraímos e triamos os microplásticos, e identificamos o tipo (fragmentos, fibras, pellets) e o polímero de cada um com estereomicroscopia e FTIR.

*✏️ Aqui escreva como foi viver e pesquisar em Tenerife: a chegada, a rotina na universidade, um lugar ou uma história que marcou.*

*Trabalho feito com a orientação da Profa. Renata Hanae Nagai (IOUSP) e a colaboração de Javier Hernández-Borges (ULL), com bolsa da FAPESP.*', null, $json$[{"cena":"falesia","seed":1,"legenda":"legenda da foto"},{"cena":"costao","seed":2,"legenda":"legenda da foto"},{"cena":"montanha","seed":4,"legenda":"legenda da foto"},{"cena":"mar","seed":5,"legenda":"legenda da foto"}]$json$::jsonb, true),
  ('exemplo-superagui', 'Coletas na Ilha do Superagui e em Pontal do Sul', '2025-07-01', 'Ilha do Superagui, Paraná', -25.46, -48.25, 'campo', 'As duas praias do litoral do Paraná onde coleto os sedimentos da minha iniciação científica.', 'A minha pesquisa acontece em duas praias do litoral paranaense: a **Ilha do Superagui** e **Pontal do Sul**. As coletas de sedimento são sazonais, para ver se o que encontramos muda ao longo do ano.

No laboratório, as amostras são peneiradas e triadas, e os microplásticos são separados com técnicas como o teste da agulha quente.

*✏️ Aqui escreva como é um dia de coleta: a viagem até a praia, quem foi junto, o que é mais difícil e o que é mais bonito.*', null, $json$[{"cena":"praia","seed":13,"legenda":"legenda da foto"},{"cena":"mata","seed":10,"legenda":"legenda da foto"},{"cena":"costao","seed":9,"legenda":"legenda da foto"}]$json$::jsonb, true),
  ('exemplo-proxymar', 'Metais presos em microplásticos: minha IC na FAPESP', '2025-03-01', 'Laboratório ProxyMar, IOUSP, São Paulo', -23.56, -46.72, 'pesquisa', 'Como os microplásticos podem carregar metais pesados pelas praias, e como a gente mede isso no laboratório.', 'Microplásticos são partículas de plástico menores que 5 mm que podem atuar como vetores de metais pesados em ecossistemas costeiros.

Na minha iniciação científica, com bolsa da FAPESP no **ProxyMar**, eu caracterizo a composição química dos microplásticos e meço os metais adsorvidos (Al, Cd, Cr, Cu, Fe, Mn, Sn, Ti e Zn) usando **ICP-OES** e **ICP-MS**.

Os resultados preliminares confirmaram a presença de metais adsorvidos em pellets plásticos das áreas de estudo. A próxima etapa busca relacionar os morfotipos (fragmentos, fibras, pellets) com a adsorção de metais e avaliar variações sazonais.

*✏️ Aqui escreva o que você mais gosta nessa pesquisa e como é a rotina no laboratório.*', null, $json$[{"cena":"lua","seed":7,"legenda":"legenda da foto"},{"cena":"mar","seed":8,"legenda":"legenda da foto"}]$json$::jsonb, true),
  ('exemplo-sediment-profile', 'Fotografando o fundo do mar na costa de São Paulo', '2025-05-01', 'Plataforma continental de São Paulo', -24.05, -46.3, 'embarques', 'Participei dos primeiros registros com Sediment Profile Imagery na costa paulista, uma câmera que fotografa o sedimento por dentro.', 'A *Sediment Profile Imagery* é uma câmera que desce até o fundo, entra no sedimento e tira uma foto do perfil, como se fosse um corte lateral do fundo do mar.

O trabalho com os primeiros registros desse método na região costeira de São Paulo virou um resumo no **VII Simpósio Brasileiro de Geologia e Geofísica Marinha** (Vitória, ES, 2025).

*✏️ Aqui escreva como foi o embarque: o barco, a equipe, quanto tempo no mar e o que você viu nas imagens.*', $json${"navio":"nome do navio ou barco","coordenadas":"ex.: 24°03'S 46°18'W","profundidade":"ex.: 30 m","dias":"ex.: 2"}$json$::jsonb, $json$[{"cena":"navio","seed":6,"legenda":"legenda da foto"},{"cena":"mar","seed":14,"legenda":"legenda da foto"}]$json$::jsonb, true),
  ('exemplo-pub-antartica', 'Primeira pesquisa: do Atlântico Sul à Antártica', '2024-09-01', 'Instituto Oceanográfico da USP, São Paulo', -23.555, -46.73, 'pesquisa', 'Minha primeira bolsa de pesquisa, estudando microplásticos e metais em ambientes costeiros do Atlântico Sul e da Antártica.', 'Entre 2024 e 2025 fiz minha primeira pesquisa, com bolsa do Programa Unificado de Bolsas da USP: "Microplásticos e metais associados no ambiente costeiro do Atlântico Sul e Antártica".

Técnicas: extração de microplásticos, estereomicroscopia, digestão ácida e espectrometria (ICP-OES/MS). Orientação da Profa. Dra. Renata Hanae Nagai.

*✏️ Aqui escreva como foi começar na pesquisa: o que te surpreendeu e o que aprendeu.*', null, $json$[{"cena":"por-do-sol","seed":11,"legenda":"legenda da foto"}]$json$::jsonb, true),
  ('exemplo-siicusp', 'Apresentando no SIICUSP e no Congresso Brasileiro de Geoquímica', '2025-10-01', 'Universidade de São Paulo, São Paulo', -23.56, -46.73, 'eventos', 'Em 2025 apresentei meu trabalho sobre microplásticos e metais em dois eventos científicos.', 'Apresentei o trabalho "Microplásticos e metais associados em ambientes costeiros do Atlântico Sul e da Antártica" no **Simpósio Internacional de Iniciação Científica e Tecnológica da USP (SIICUSP)** e no **Congresso Brasileiro de Geoquímica**.

Também participei do Workshop sobre o talude continental da Bacia de Santos (2025 e 2026) e do II Seminário sobre Monitoramento de Microplásticos (2026).

*✏️ Aqui escreva como foi apresentar: o nervosismo, as perguntas que recebeu, as pessoas que conheceu.*', null, $json$[{"cena":"por-do-sol","seed":15,"legenda":"legenda da foto"}]$json$::jsonb, true);

-- Conferência: deve mostrar 6 experiências de exemplo.
select titulo, categoria, data from public.posts where slug like 'exemplo-%' order by data desc;

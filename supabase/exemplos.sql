-- =====================================================================
--  CONTEÚDO DE EXEMPLO (publicado)
--  Cole tudo no Supabase em: SQL Editor > New query > Run
--  Pode rodar mais de uma vez: ele substitui os exemplos anteriores,
--  sem mexer no que ela já tiver criado.
--  Para apagar só os exemplos depois: delete from public.posts where slug like 'exemplo-%';
-- =====================================================================

insert into public.perfil (id, dados) values (1, $json${"nome":"Giovanna da Rocha Bragion","apelido":"Lua","frase":"Oceanógrafa pela USP. Entre embarques, costões e ilhas vulcânicas, eu conto aqui o que o mar me ensinou.","sobre":["Sou oceanógrafa formada pelo Instituto Oceanográfico da Universidade de São Paulo (IOUSP). Gosto de estar em campo: no convés de um navio, num costão rochoso na maré baixa ou numa trilha que termina no mar.","Fiz intercâmbio nas Ilhas Canárias, onde estudei a costa vulcânica do Atlântico, e participei de embarques científicos pela universidade.","Este espaço é o meu caderno de campo: cada experiência vira um registro, com fotos, lugares e o que aprendi."],"formacao":[{"titulo":"Bacharelado em Oceanografia","lugar":"Universidade de São Paulo (IOUSP)","periodo":"2019 – 2024"},{"titulo":"Intercâmbio acadêmico","lugar":"Tenerife, Ilhas Canárias (Espanha)","periodo":"2023"}],"competencias":["Coleta e triagem de plâncton","CTD e perfis oceanográficos","Análise de dados em Python e R","Mergulho livre","Divulgação científica","Fotografia de campo"],"idiomas":["Português (nativo)","Espanhol (fluente)","Inglês (avançado)"],"contatos":{"email":"email@exemplo.com","linkedin":"https://www.linkedin.com/","lattes":"https://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K1533633U6","instagram":"https://www.instagram.com/gi_bragion_/"},"curriculo":"#","fotoPerfil":{"cena":"mata","seed":3},"marcos":[{"data":"2019-03-01","titulo":"Entrada no IOUSP","texto":"Começo do bacharelado em Oceanografia."},{"data":"2024-12-15","titulo":"Formatura","texto":"Oceanógrafa pela Universidade de São Paulo."}]}$json$::jsonb)
on conflict (id) do update set dados = excluded.dados;

delete from public.posts where slug like 'exemplo-%';

insert into public.posts (slug, titulo, data, local, lat, lon, categoria, resumo, texto, diario, fotos, publicado) values
  ('exemplo-tenerife', 'Seis meses entre vulcões e o Atlântico', '2023-08-20', 'Tenerife, Ilhas Canárias', 28.29, -16.63, 'intercambio', 'O intercâmbio que mudou a forma como eu olho para uma costa: pedra preta, água muito azul e uma biodiversidade que eu não esperava.', 'Cheguei em Tenerife sem saber direito o que esperar. A primeira coisa que me impressionou foi a cor da água: um azul tão profundo que parece tinta, porque o fundo cai muito rápido perto da costa.

Durante o semestre, acompanhei aulas de ecologia costeira e saídas para os costões de Los Gigantes, onde as falésias chegam a centenas de metros de altura.

Aprendi a identificar espécies que nunca tinha visto no Brasil e a reparar em como a rocha vulcânica muda a vida das poças de maré.', null, $json$[{"cena":"falesia","seed":1,"legenda":"Los Gigantes"},{"cena":"costao","seed":2,"legenda":"Poças de maré"},{"cena":"montanha","seed":4,"legenda":"Paisagem vulcânica"},{"cena":"mar","seed":5,"legenda":"Atlântico"}]$json$::jsonb, true),
  ('exemplo-alpha-crucis', 'Dez dias a bordo do Alpha Crucis', '2022-11-05', 'Plataforma continental de São Paulo', -24.6, -45.4, 'embarques', 'Meu primeiro embarque longo: turnos de madrugada, perfis de CTD e muito plâncton para triar.', 'O navio sai de Santos e, em poucas horas, a costa some. A rotina a bordo é marcada pelas estações de coleta, que acontecem a qualquer hora do dia ou da noite.

Fiquei no turno da madrugada, lançando o CTD e preparando as redes de plâncton. Ver o céu sem nenhuma luz da cidade foi um presente à parte.', $json${"navio":"N/Oc. Alpha Crucis","coordenadas":"24°36'S 45°24'W","profundidade":"até 1.200 m","dias":10}$json$::jsonb, $json$[{"cena":"navio","seed":6,"legenda":"Saindo de Santos"},{"cena":"lua","seed":7,"legenda":"Turno da madrugada"},{"cena":"mar","seed":8,"legenda":"Estação 14"}]$json$::jsonb, true),
  ('exemplo-ubatuba', 'Costões rochosos em Ubatuba', '2022-03-14', 'Base Clarimundo de Jesus, Ubatuba', -23.5, -45.12, 'campo', 'Uma semana na base do IOUSP estudando a zonação dos costões na maré baixa.', 'A base de Ubatuba fica de frente para o mar, e o dia começa conferindo a tábua de marés. Quando a maré baixa, todo mundo corre para o costão.

Medimos a distribuição de cracas, mexilhões e algas em faixas, do ponto mais alto ao mais baixo da rocha.', null, $json$[{"cena":"costao","seed":9,"legenda":"Maré baixa"},{"cena":"mata","seed":10,"legenda":"Trilha até a praia"}]$json$::jsonb, true),
  ('exemplo-cananeia', 'Manguezais de Cananéia', '2021-09-02', 'Base Dr. João de Paiva Carvalho, Cananéia', -25.02, -47.93, 'pesquisa', 'Coletas no estuário e a primeira vez que eu entendi, na prática, por que o mangue é um berçário.', 'O estuário de Cananéia é um dos mais preservados do Brasil. Saímos de barco pelos canais para coletar água e sedimento.

Entre uma coleta e outra, guarás, botos e muito barro. Volto sempre com vontade de ficar mais.', null, $json$[{"cena":"por-do-sol","seed":11,"legenda":"Fim de tarde no canal"},{"cena":"praia","seed":12,"legenda":"Ilha do Cardoso"}]$json$::jsonb, true),
  ('exemplo-floripa', 'Trilha e dunas em Florianópolis', '2023-01-18', 'Florianópolis, SC', -27.6, -48.45, 'campo', 'Uma saída com a turma para observar a dinâmica das dunas e das praias expostas.', 'Fomos a pé pelas dunas até uma praia de mar aberto. O vento muda a paisagem de um dia para o outro.', null, $json$[{"cena":"praia","seed":13,"legenda":"Dunas"},{"cena":"mar","seed":14,"legenda":"Mar aberto"}]$json$::jsonb, true),
  ('exemplo-congresso', 'Meu primeiro pôster num congresso', '2024-06-10', 'Rio de Janeiro, RJ', -22.91, -43.17, 'eventos', 'Apresentei os resultados do meu TCC sobre plâncton da plataforma de São Paulo.', 'Nervosismo, café e muitas perguntas boas. Apresentar o trabalho para pessoas de outras universidades me fez enxergar a pesquisa de outro jeito.', null, $json$[{"cena":"por-do-sol","seed":15,"legenda":"Baía de Guanabara"}]$json$::jsonb, true);

-- Conferência: deve mostrar 6 experiências de exemplo.
select titulo, categoria, data from public.posts where slug like 'exemplo-%' order by data desc;

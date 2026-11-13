/*
  Lógica do site: cada "página" é uma função que devolve HTML.
  O endereço depois do # decide qual página aparece (ex.: #/mapa).
  Os dados vêm de window.Dados (Supabase ou modo demonstração).
*/
(function () {
  const CAT = window.CATEGORIAS;
  let S = {};       // perfil (nome, sobre, contatos…)
  let POSTS = [];   // experiências publicadas
  const app = document.getElementById("app");
  const GLIFOS = "⋆.˚𓇼 ⋆.˚ 𓆉 𓆝 𓆡⋆.˚ 𓇼⋆.˚";

  // Evita que texto digitado vire código na página
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // **negrito** e *itálico*
  const formatar = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  const paragrafos = (t) => String(t || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  const linkSeguro = (u) => (/^(https?:|mailto:|data:|blob:|#)/i.test(u || "") ? u : "#");

  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const dataCurta = (d) => { const [a, m] = String(d).split("-"); return m ? `${MESES[+m - 1]} ${a}` : a; };
  const ano = (d) => String(d).slice(0, 4);
  const giro = (i) => [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7][i % 6];
  const capaDe = (p) => p.fotos[0] || { cena: "mar", seed: (p.titulo || "").length };
  const lugarCurto = (p) => (p.local || "").split(",")[0];
  const comMapa = () => POSTS.filter((p) => p.lat != null && p.lon != null);
  const lugaresExtras = () => (S.lugares || []).filter((l) => l.lat != null && l.lon != null);
  const temMapa = () => comMapa().length + lugaresExtras().length > 0;

  function polaroid(foto, legenda, canto, extra = "") {
    return `<figure class="polaroid" ${extra}>
      <img src="${esc(fotoSrc(foto))}" alt="${esc(legenda || "")}" loading="lazy">
      <figcaption><span>${esc(legenda || "")}</span>${canto ? `<small>${esc(canto)}</small>` : ""}</figcaption>
    </figure>`;
  }

  function cartaoPost(p, i) {
    const c = CAT[p.categoria] || { nome: p.categoria, icone: "" };
    return `<a class="cartao-post" href="#/post/${encodeURIComponent(p.slug)}" style="--giro:${giro(i)}deg; --fita:${FITAS[i % FITAS.length]}">
      ${polaroid(capaDe(p), lugarCurto(p), ano(p.data))}
      <div class="info">
        <span class="anotacao">${esc(c.nome.toLowerCase())}</span>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.resumo)}</p>
      </div>
    </a>`;
  }

  const vazio = `<p class="vazio">Em breve, os primeiros registros. 🌊</p>`;
  const FITAS = ["var(--fita-1)", "var(--fita-2)", "var(--fita-3)"];

  // Entrada de caderno: data na margem, texto, foto colada com fita
  function entrada(p, i) {
    const c = CAT[p.categoria] || { nome: p.categoria };
    return `<li><a class="entrada" href="#/post/${encodeURIComponent(p.slug)}">
      <span class="margem">${dataCurta(p.data)}</span>
      <span class="entrada-texto">
        <span class="anotacao">${esc(c.nome.toLowerCase())}</span>
        <strong>${esc(p.titulo)}</strong>
        <span class="lugar">${esc(p.local)}</span>
        <span class="resumo">${esc(p.resumo)}</span>
      </span>
      <span class="mini" style="--fita:${FITAS[i % FITAS.length]}; --giro:${giro(i + 1)}deg"><img src="${esc(fotoSrc(capaDe(p)))}" alt="" loading="lazy"></span>
    </a></li>`;
  }

  // ---------- Páginas ----------
  const paginas = {
    inicio() {
      const capa = POSTS.slice(0, 3);
      return `<div class="container">
        <section class="capa">
          <div>
            <h1>${esc(S.nome)}</h1>
            <p class="frase">${esc(S.frase)}</p>
            <div class="acoes">
              <a class="botao cheio" href="#/experiencias">Ver experiências</a>
              <a class="botao" href="#/sobre">Sobre mim</a>
            </div>
          </div>
          <div class="pilha-area">
            <div class="pilha">${(capa.length ? capa : [{ fotos: [{ cena: "mar", seed: 2 }], local: "", data: "" }])
              .map((p, i) => polaroid(capaDe(p), lugarCurto(p), ano(p.data), `style="--fita:${FITAS[i % FITAS.length]}"`)).join("")}</div>
            ${capa[0] ? `<p class="nota-mao" aria-hidden="true">
              <svg viewBox="0 0 90 60" class="seta"><path d="M6 8 C 30 4, 62 14, 78 46 M78 46 l-12 -4 M78 46 l2 -12"/></svg>
              ${esc(lugarCurto(capa[0]))}, ${ano(capa[0].data)}</p>` : ""}
          </div>
        </section>
        <div class="titulo-secao"><h2>Registros recentes</h2>${POSTS.length ? `<a href="#/experiencias">Ver todas as experiências</a>` : ""}</div>
        ${POSTS.length ? `<ol class="entradas">${POSTS.slice(0, 4).map(entrada).join("")}</ol>` : vazio}
        ${temMapa() ? `<div class="titulo-secao"><h2>Por onde passei</h2><a href="#/mapa">Abrir o mapa</a></div>
        <div id="mapa-mini"></div>` : ""}
      </div>`;
    },

    experiencias(params) {
      const filtro = params[0] || "";
      const lista = filtro ? POSTS.filter((p) => p.categoria === filtro) : POSTS;
      const chips = [`<a class="filtro ${filtro ? "" : "ativo"}" href="#/experiencias">Todas</a>`]
        .concat(Object.entries(CAT).map(([k, c]) =>
          `<a class="filtro ${filtro === k ? "ativo" : ""}" href="#/experiencias/${k}">${c.icone} ${esc(c.nome)}</a>`));
      return `<div class="container">
        <div class="post-cab"><h1>Experiências</h1><p class="meta">cada saída, cada embarque, cada lugar</p></div>
        <div class="filtros">${chips.join("")}</div>
        ${lista.length ? `<div class="grade">${lista.map(cartaoPost).join("")}</div>` : `<p class="vazio">Nada por aqui ainda.</p>`}
      </div>`;
    },

    post(params) {
      const p = POSTS.find((x) => x.slug === params[0]);
      if (!p) return paginas.naoEncontrada();
      const c = CAT[p.categoria] || { nome: p.categoria, icone: "" };
      const d = p.diario;
      return `<article class="container estreito">
        <header class="post-cab">
          <a class="anotacao" href="#/experiencias/${esc(p.categoria)}">${esc(c.nome.toLowerCase())}</a>
          <h1>${esc(p.titulo)}</h1>
          <div class="meta"><span>${esc(p.local)}</span><span>${dataCurta(p.data)}</span></div>
        </header>
      </article>
      ${p.fotos.length ? `<div class="container">
        <div class="post-capa" data-foto="0">${polaroid(p.fotos[0], p.fotos[0].legenda, ano(p.data))}</div>
      </div>` : ""}
      <article class="container estreito">
        ${d ? `<aside class="diario"><h3>diário de bordo</h3><dl>
          ${d.navio ? `<div><dt>Navio</dt><dd>${esc(d.navio)}</dd></div>` : ""}
          ${d.coordenadas ? `<div><dt>Coordenadas</dt><dd>${esc(d.coordenadas)}</dd></div>` : ""}
          ${d.profundidade ? `<div><dt>Profundidade</dt><dd>${esc(d.profundidade)}</dd></div>` : ""}
          ${d.dias ? `<div><dt>Dias no mar</dt><dd>${esc(d.dias)}</dd></div>` : ""}
        </dl></aside>` : ""}
        <div class="post-texto">${paragrafos(p.texto).map((t) => `<p>${formatar(t)}</p>`).join("")}</div>
      </article>
      <div class="container">
        ${p.fotos.length > 1 ? `<div class="galeria-post">${p.fotos.slice(1).map((f, i) =>
          polaroid(f, f.legenda, "", `data-foto="${i + 1}"`)).join("")}</div>` : ""}
        <div class="estreito" style="margin:0 auto"><a class="voltar" href="#/experiencias">Voltar para as experiências</a></div>
      </div>`;
    },

    mapa() {
      const lugares = comMapa(), extras = lugaresExtras();
      const itens = lugares.map((p) => `<li><a href="#/post/${encodeURIComponent(p.slug)}"><strong>${esc(p.local || p.titulo)}</strong></a><br><small>${esc(p.titulo)}, ${ano(p.data)}</small></li>`);
      const itensExtras = extras.map((l) => `<li><strong>${esc(l.nome)}</strong>${l.ano ? `<br><small>${esc(l.ano)}</small>` : ""}</li>`);
      return `<div class="container">
        <div class="post-cab"><h1>Por onde passei</h1><p class="meta">uma carta náutica das minhas experiências</p></div>
        ${temMapa() ? `<div id="mapa-grande"></div><ul class="lista-lugares">
          ${itens.length && itensExtras.length ? `<li class="titulo-lista">Experiências</li>` : ""}${itens.join("")}
          ${itensExtras.length ? `<li class="titulo-lista">Outros lugares por onde passei</li>${itensExtras.join("")}` : ""}
        </ul>` : vazio}
      </div>`;
    },

    trajetoria() {
      const itens = [
        ...POSTS.map((p) => ({ data: p.data, titulo: p.titulo, texto: p.local, link: `#/post/${encodeURIComponent(p.slug)}`, icone: (CAT[p.categoria] || {}).icone })),
        ...(S.marcos || []).map((m) => ({ ...m, marco: true })),
      ].sort((a, b) => String(b.data).localeCompare(String(a.data)));
      return `<div class="container estreito">
        <div class="post-cab"><h1>Trajetória</h1><p class="meta">os caminhos até aqui</p></div>
        ${itens.length ? `<div class="tempo">${itens.map((it, i) => `<div class="tempo-item ${it.marco ? "marco" : ""}">
          <div class="ano">${dataCurta(it.data)}</div>
          ${it.link ? `<a href="${it.link}"><h3>${it.icone || ""} ${esc(it.titulo)}</h3></a>` : `<h3>${esc(it.titulo)}</h3>`}
          <p>${esc(it.texto)}</p>
        </div>`).join("")}</div>` : vazio}
      </div>`;
    },

    galeria() {
      const fotos = todasFotos();
      return `<div class="container">
        <div class="post-cab"><h1>Galeria</h1><p class="meta">o mar pelos meus olhos</p></div>
        ${fotos.length ? `<div class="mural">${fotos.map((f, i) => polaroid(f, f.legenda || f.local, f.ano, `data-foto="${i}"`)).join("")}</div>` : vazio}
      </div>`;
    },

    sobre() {
      const ct = S.contatos || {};
      const lista = (titulo, itens, fn) => itens && itens.length
        ? `<div class="bloco"><h3>${titulo}</h3><ul>${itens.map(fn).join("")}</ul></div>` : "";
      const botao = (url, texto) => url && url !== "#" ? `<a class="botao" href="${esc(linkSeguro(url))}" target="_blank" rel="noopener">${texto}</a>` : "";
      return `<div class="container">
        <section class="sobre">
          ${polaroid(S.fotoPerfil || { cena: "mata", seed: 3 }, (S.apelido || S.nome || "") + " 🌙", "")}
          <div>
            <h1>${esc(S.nome)}</h1>
            ${(S.sobre || []).map((t) => `<p>${formatar(t)}</p>`).join("")}
            <div class="contatos">
              ${S.curriculo && S.curriculo !== "#" ? `<a class="botao cheio" href="${esc(linkSeguro(S.curriculo))}" target="_blank" rel="noopener">⤓ Baixar currículo (PDF)</a>` : ""}
              ${ct.email ? `<a class="botao" href="mailto:${esc(ct.email)}">E-mail</a>` : ""}
              ${botao(ct.linkedin, "LinkedIn")}${botao(ct.lattes, "Lattes")}${botao(ct.instagram, "Instagram")}
            </div>
          </div>
        </section>
        <div class="blocos">
          ${lista("formação", S.formacao, (f) => `<li>${esc(f.titulo)}<small>${esc([f.lugar, f.periodo].filter(Boolean).join(", "))}</small></li>`)}
          ${lista("o que eu sei fazer", S.competencias, (c) => `<li>${esc(c)}</li>`)}
          ${lista("idiomas", S.idiomas, (c) => `<li>${esc(c)}</li>`)}
        </div>
      </div>`;
    },

    naoEncontrada() {
      return `<div class="container estreito"><div class="post-cab"><h1>Perdido no mar 🌊</h1>
        <p>Essa página não existe. <a href="#/">Voltar ao início</a></p></div></div>`;
    },
  };

  function todasFotos() {
    return POSTS.flatMap((p) => p.fotos.map((f) => ({ ...f, local: lugarCurto(p), ano: ano(p.data) })));
  }

  // ---------- Lightbox (ver foto grande) ----------
  const lb = document.getElementById("lightbox");
  let lbFotos = [], lbI = 0;
  function mostrarFoto() {
    const f = lbFotos[lbI];
    lb.querySelector("img").src = fotoSrc(f);
    lb.querySelector("figcaption").textContent = f.legenda || f.local || "";
    lb.querySelector(".ant").style.display = lb.querySelector(".prox").style.display = lbFotos.length > 1 ? "" : "none";
  }
  function abrirLightbox(fotos, i) { lbFotos = fotos; lbI = i; mostrarFoto(); lb.classList.add("aberto"); }
  const fecharLightbox = () => lb.classList.remove("aberto");
  const passo = (n) => { lbI = (lbI + n + lbFotos.length) % lbFotos.length; mostrarFoto(); };
  lb.querySelector(".fechar").onclick = fecharLightbox;
  lb.querySelector(".ant").onclick = () => passo(-1);
  lb.querySelector(".prox").onclick = () => passo(1);
  lb.addEventListener("click", (e) => { if (e.target === lb) fecharLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("aberto")) return;
    if (e.key === "Escape") fecharLightbox();
    if (e.key === "ArrowLeft") passo(-1);
    if (e.key === "ArrowRight") passo(1);
  });

  // ---------- Aviso rápido (toast) ----------
  window.avisar = (texto) => {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = texto;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("sair"), 2600);
    setTimeout(() => t.remove(), 3200);
  };

  // ---------- Navegação ----------
  let hashAnterior = location.hash;
  function rotear() {
    // Protege um texto não salvo na área de edição
    if (window.Admin?.temMudancas() && location.hash !== hashAnterior) {
      if (!confirm("Sair sem salvar? As mudanças serão perdidas.")) {
        history.replaceState(null, "", hashAnterior);
        return;
      }
      window.Admin.descartar();
    }
    hashAnterior = location.hash;

    // Easter egg: o desenho de uma tatuagem dela no fundo de cada página
    // arquivo em img/tatuagens/ (o caminho é lido a partir da pasta css/), proporção (largura / altura) e altura na tela
    const TATUAGENS = {
      inicio: { arquivo: "peixes-voadores", proporcao: 640 / 1059, altura: "86vh" },
      sobre: { arquivo: "selo-melancia", proporcao: 520 / 655, altura: "62vh" },
      // experiencias, mapa, trajetoria, galeria: esperando as próximas tatuagens
    };
    const nomePagina = (location.hash.replace(/^#\/?/, "").split("/")[0]) || "inicio";
    const tatu = document.getElementById("tatuagem");
    const qual = TATUAGENS[nomePagina];
    tatu.style.display = qual ? "" : "none";
    if (qual) {
      tatu.style.setProperty("--desenho", `url("../img/tatuagens/${qual.arquivo}.png")`);
      tatu.style.setProperty("--proporcao", qual.proporcao);
      tatu.style.setProperty("--altura", qual.altura);
    }
    tatu.dataset.pagina = nomePagina;

    const partes = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    const nome = partes[0] || "inicio";
    window.scrollTo(0, 0);
    document.querySelectorAll("#menu a").forEach((a) =>
      a.classList.toggle("ativo", a.dataset.rota === (partes[0] || "")));
    document.getElementById("menu").classList.remove("aberto");
    fecharLightbox();

    if (nome === "admin") {
      document.title = "Área de edição · " + (S.nome || "");
      window.Admin.abrir(app, partes.slice(1));
      return;
    }

    const pagina = paginas[nome] || paginas.naoEncontrada;
    app.innerHTML = pagina(partes.slice(1));
    const h1 = document.querySelector("#app h1")?.textContent.trim();
    document.title = (nome === "inicio" || !h1 || h1 === S.nome ? "" : h1 + " · ") + (S.nome || "");

    // Fotos clicáveis
    if (nome === "post") {
      const p = POSTS.find((x) => x.slug === partes[1]);
      if (p) app.querySelectorAll("[data-foto]").forEach((el) =>
        el.addEventListener("click", () => abrirLightbox(p.fotos, +el.dataset.foto)));
    }
    if (nome === "galeria") {
      const fotos = todasFotos();
      app.querySelectorAll("[data-foto]").forEach((el) =>
        el.addEventListener("click", () => abrirLightbox(fotos, +el.dataset.foto)));
    }
    if (nome === "mapa") window.desenharMapa?.(document.getElementById("mapa-grande"), comMapa(), true, lugaresExtras());
    if (nome === "inicio") window.desenharMapa?.(document.getElementById("mapa-mini"), comMapa(), false, lugaresExtras());
  }

  // ---------- Carregar os dados ----------
  function aplicarPerfil() {
    document.getElementById("marca-nome").textContent = S.nome || "";
    document.getElementById("rodape-nome").textContent = `© ${new Date().getFullYear()} ${S.nome || ""}`;
  }
  window.siteAtual = () => ({ perfil: S, posts: POSTS });
  window.recarregarSite = async () => {
    const r = await window.Dados.carregarSite();
    S = r.perfil || {};
    POSTS = [...r.posts].sort((a, b) => String(b.data).localeCompare(String(a.data)));
    aplicarPerfil();
  };

  // ---------- Tema dia/noite e menu do celular ----------
  const botaoTema = document.getElementById("botao-tema");
  const icone = () => (botaoTema.textContent = document.documentElement.dataset.tema === "noite" ? "☀" : "🌙");
  botaoTema.onclick = () => {
    const t = document.documentElement.dataset.tema === "noite" ? "dia" : "noite";
    document.documentElement.dataset.tema = t;
    try { localStorage.setItem("tema", t); } catch (e) {}
    icone();
  };
  document.getElementById("botao-menu").onclick = () => document.getElementById("menu").classList.toggle("aberto");
  icone();

  (async () => {
    app.innerHTML = `<div class="container"><p class="vazio" style="padding:64px 0;text-align:center">abrindo o caderno… 🌙</p></div>`;
    // Chegou pelo link de "esqueci minha senha" do e-mail? Leva direto para criar a senha nova.
    const recuperacao = /type=recovery/.test(location.hash);
    try {
      await window.Dados.sessao();
      if (recuperacao) history.replaceState(null, "", "#/admin/senha");
      await window.recarregarSite();
    } catch (err) {
      app.innerHTML = `<div class="container estreito"><div class="post-cab"><h1>Maré baixa 🌊</h1>
        <p>Não foi possível carregar o conteúdo agora. Tente de novo em alguns instantes.</p>
        <p class="vazio">${esc(err.message)}</p></div></div>`;
      return;
    }
    window.addEventListener("hashchange", rotear);
    rotear();
  })();
})();

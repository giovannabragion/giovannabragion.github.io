/*
  Lógica do site: cada "página" é uma função que devolve HTML.
  O endereço depois do # decide qual página aparece (ex.: #/mapa).
*/
(function () {
  const S = window.SITE, CAT = window.CATEGORIAS;
  const POSTS = [...window.POSTS].sort((a, b) => b.data.localeCompare(a.data));
  const app = document.getElementById("app");
  const GLIFOS = "⋆.˚𓇼 ⋆.˚ 𓆉 𓆝 𓆡⋆.˚ 𓇼⋆.˚";

  // Evita que texto digitado vire código na página
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const dataCurta = (d) => { const [a, m] = d.split("-"); return `${MESES[+m - 1]} ${a}`; };
  const ano = (d) => d.slice(0, 4);
  const giro = (i) => [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7][i % 6];

  function polaroid(foto, legenda, canto, extra = "") {
    return `<figure class="polaroid" ${extra}>
      <img src="${fotoSrc(foto)}" alt="${esc(legenda || "")}" loading="lazy">
      <figcaption><span>${esc(legenda || "")}</span>${canto ? `<small>${esc(canto)}</small>` : ""}</figcaption>
    </figure>`;
  }

  function cartaoPost(p, i) {
    const c = CAT[p.categoria] || { nome: p.categoria, icone: "" };
    return `<a class="cartao-post entrar" href="#/post/${esc(p.id)}" style="--giro:${giro(i)}deg; animation-delay:${i * 60}ms">
      ${polaroid(p.fotos[0], p.local.split(",")[0], ano(p.data))}
      <div class="info">
        <span class="etiqueta">${c.icone} ${esc(c.nome)}</span>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.resumo)}</p>
      </div>
    </a>`;
  }

  // ---------- Páginas ----------
  const paginas = {
    inicio() {
      const capa = POSTS.slice(0, 3);
      return `<div class="container">
        <section class="capa entrar">
          <div>
            <p class="ola">olá, eu sou a</p>
            <h1>${esc(S.nome)} <span class="lua-nome">🌙</span></h1>
            <p class="frase">${esc(S.frase)}</p>
            <div class="acoes">
              <a class="botao cheio" href="#/experiencias">Ver experiências</a>
              <a class="botao" href="#/sobre">Sobre mim</a>
            </div>
          </div>
          <div class="pilha">${capa.map((p) => polaroid(p.fotos[0], p.local.split(",")[0], ano(p.data))).join("")}</div>
        </section>
        <div class="divisor">${GLIFOS}</div>
        <div class="titulo-secao"><h2>Registros recentes</h2><a href="#/experiencias">ver todos →</a></div>
        <div class="grade">${POSTS.slice(0, 3).map(cartaoPost).join("")}</div>
        <div class="divisor">${GLIFOS}</div>
        <div class="titulo-secao"><h2>Por onde passei</h2><a href="#/mapa">abrir o mapa →</a></div>
        <div id="mapa-mini"></div>
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
      const p = POSTS.find((x) => x.id === params[0]);
      if (!p) return paginas.naoEncontrada();
      const c = CAT[p.categoria] || { nome: p.categoria, icone: "" };
      const d = p.diario;
      return `<article class="container estreito">
        <header class="post-cab entrar">
          <a class="etiqueta" href="#/experiencias/${esc(p.categoria)}" style="text-decoration:none">${c.icone} ${esc(c.nome)}</a>
          <h1>${esc(p.titulo)}</h1>
          <div class="meta">${esc(p.local)} · ${dataCurta(p.data)}</div>
        </header>
      </article>
      <div class="container">
        <div class="post-capa" data-foto="0">${polaroid(p.fotos[0], p.fotos[0].legenda, ano(p.data))}</div>
      </div>
      <article class="container estreito">
        ${d ? `<aside class="diario"><h3>diário de bordo</h3><dl>
          ${d.navio ? `<div><dt>Navio</dt><dd>${esc(d.navio)}</dd></div>` : ""}
          ${d.coordenadas ? `<div><dt>Coordenadas</dt><dd>${esc(d.coordenadas)}</dd></div>` : ""}
          ${d.profundidade ? `<div><dt>Profundidade</dt><dd>${esc(d.profundidade)}</dd></div>` : ""}
          ${d.dias ? `<div><dt>Dias no mar</dt><dd>${esc(d.dias)}</dd></div>` : ""}
        </dl></aside>` : ""}
        <div class="post-texto">${p.texto.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
      </article>
      <div class="container">
        ${p.fotos.length > 1 ? `<div class="galeria-post">${p.fotos.slice(1).map((f, i) =>
          polaroid(f, f.legenda, "", `data-foto="${i + 1}"`)).join("")}</div>` : ""}
        <div class="estreito" style="margin:0 auto"><a class="voltar" href="#/experiencias">← todas as experiências</a></div>
      </div>`;
    },

    mapa() {
      const itens = POSTS.map((p) => `<li><a href="#/post/${esc(p.id)}"><strong>${esc(p.local)}</strong></a><br><small>${esc(p.titulo)} · ${ano(p.data)}</small></li>`);
      return `<div class="container">
        <div class="post-cab"><h1>Por onde passei</h1><p class="meta">uma carta náutica das minhas experiências</p></div>
        <div id="mapa-grande"></div>
        <ul class="lista-lugares">${itens.join("")}</ul>
      </div>`;
    },

    trajetoria() {
      const itens = [
        ...POSTS.map((p) => ({ data: p.data, titulo: p.titulo, texto: p.local, link: `#/post/${p.id}`, icone: (CAT[p.categoria] || {}).icone })),
        ...window.MARCOS.map((m) => ({ ...m, marco: true })),
      ].sort((a, b) => b.data.localeCompare(a.data));
      return `<div class="container estreito">
        <div class="post-cab"><h1>Trajetória</h1><p class="meta">do primeiro dia no IOUSP até agora</p></div>
        <div class="tempo">${itens.map((it, i) => `<div class="tempo-item entrar ${it.marco ? "marco" : ""}" style="animation-delay:${i * 50}ms">
          <div class="ano">${dataCurta(it.data)}</div>
          ${it.link ? `<a href="${it.link}"><h3>${it.icone || ""} ${esc(it.titulo)}</h3></a>` : `<h3>${esc(it.titulo)}</h3>`}
          <p>${esc(it.texto)}</p>
        </div>`).join("")}</div>
      </div>`;
    },

    galeria() {
      const fotos = POSTS.flatMap((p) => p.fotos.map((f) => ({ ...f, local: p.local.split(",")[0], ano: ano(p.data) })));
      return `<div class="container">
        <div class="post-cab"><h1>Galeria</h1><p class="meta">o mar pelos meus olhos</p></div>
        <div class="mural">${fotos.map((f, i) => polaroid(f, f.legenda || f.local, f.ano, `data-foto="${i}"`)).join("")}</div>
      </div>`;
    },

    sobre() {
      const ct = S.contatos;
      return `<div class="container">
        <section class="sobre entrar">
          ${polaroid(S.fotoPerfil, S.apelido + " 🌙", "")}
          <div>
            <p class="ola mao" style="font-size:1.5rem;color:var(--terracota);margin:0">sobre mim</p>
            <h1>${esc(S.nome)}</h1>
            ${S.sobre.map((t) => `<p>${esc(t)}</p>`).join("")}
            <div class="contatos">
              <a class="botao cheio" href="${esc(S.curriculo)}">⤓ Baixar currículo (PDF)</a>
              <a class="botao" href="mailto:${esc(ct.email)}">E-mail</a>
              <a class="botao" href="${esc(ct.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
              <a class="botao" href="${esc(ct.lattes)}" target="_blank" rel="noopener">Lattes</a>
              <a class="botao" href="${esc(ct.instagram)}" target="_blank" rel="noopener">Instagram</a>
            </div>
          </div>
        </section>
        <div class="blocos">
          <div class="bloco"><h3>formação</h3><ul>${S.formacao.map((f) => `<li>${esc(f.titulo)}<small>${esc(f.lugar)} · ${esc(f.periodo)}</small></li>`).join("")}</ul></div>
          <div class="bloco"><h3>o que eu sei fazer</h3><ul>${S.competencias.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>
          <div class="bloco"><h3>idiomas</h3><ul>${S.idiomas.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>
        </div>
      </div>`;
    },

    admin() {
      return `<div class="container">
        <form class="login" onsubmit="return false">
          <h2>Área da ${esc(S.nome.split(" ")[0])} 🌙</h2>
          <p style="color:var(--tinta-suave);margin:0">Entre para escrever e editar as experiências.</p>
          <label for="em">E-mail</label><input id="em" type="email" disabled>
          <label for="se">Senha</label><input id="se" type="password" disabled>
          <button class="botao cheio" style="margin-top:20px;width:100%;justify-content:center" disabled>Entrar</button>
          <p class="aviso">Em construção: o login e o editor entram na próxima etapa, junto com o Supabase.</p>
        </form>
      </div>`;
    },

    naoEncontrada() {
      return `<div class="container estreito"><div class="post-cab"><h1>Perdido no mar 🌊</h1>
        <p>Essa página não existe. <a href="#/">Voltar ao início</a></p></div></div>`;
    },
  };

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

  // ---------- Navegação ----------
  function rotear() {
    const partes = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    const nome = partes[0] || "inicio";
    const pagina = paginas[nome] || paginas.naoEncontrada;
    app.innerHTML = pagina(partes.slice(1));
    window.scrollTo(0, 0);

    document.querySelectorAll("#menu a").forEach((a) =>
      a.classList.toggle("ativo", a.dataset.rota === (partes[0] || "")));
    document.getElementById("menu").classList.remove("aberto");
    const h1 = document.querySelector("#app h1")?.textContent.trim();
    document.title = (nome === "inicio" || !h1 || h1 === S.nome ? "" : h1 + " · ") + S.nome;

    // Fotos clicáveis
    if (nome === "post") {
      const p = POSTS.find((x) => x.id === partes[1]);
      if (p) app.querySelectorAll("[data-foto]").forEach((el) =>
        el.addEventListener("click", () => abrirLightbox(p.fotos, +el.dataset.foto)));
    }
    if (nome === "galeria") {
      const fotos = POSTS.flatMap((p) => p.fotos.map((f) => ({ ...f, local: p.local.split(",")[0] })));
      app.querySelectorAll("[data-foto]").forEach((el) =>
        el.addEventListener("click", () => abrirLightbox(fotos, +el.dataset.foto)));
    }
    if (nome === "mapa") window.desenharMapa?.(document.getElementById("mapa-grande"), POSTS, true);
    if (nome === "inicio") window.desenharMapa?.(document.getElementById("mapa-mini"), POSTS, false);
  }

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

  document.getElementById("marca-nome").textContent = S.nome;
  document.getElementById("rodape-nome").textContent = `© ${new Date().getFullYear()} ${S.nome}`;
  icone();
  window.addEventListener("hashchange", rotear);
  rotear();
})();

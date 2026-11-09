/*
  ÁREA DE EDIÇÃO (#/admin)
  Login, lista de experiências, editor de experiência, editor da página "Sobre" e troca de senha.
*/
(function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const D = () => window.Dados;
  let sujo = false; // há mudanças não salvas?

  window.addEventListener("beforeunload", (e) => { if (sujo) { e.preventDefault(); e.returnValue = ""; } });

  function avisoDemo() {
    return D().modo === "demo"
      ? `<p class="aviso demo">🧪 <strong>Modo demonstração.</strong> O Supabase ainda não foi ligado, então dá para testar tudo, mas nada fica salvo: ao recarregar a página, volta ao conteúdo de exemplo.</p>`
      : "";
  }

  function mensagem(el, texto, tipo = "erro") {
    el.innerHTML = texto ? `<p class="msg ${tipo}">${esc(texto)}</p>` : "";
  }

  async function ocupado(botao, fn) {
    const original = botao.innerHTML;
    botao.disabled = true;
    botao.innerHTML = "Aguarde…";
    try { return await fn(); } finally { botao.disabled = false; botao.innerHTML = original; }
  }

  // ======================================================================
  //  LOGIN
  // ======================================================================
  function telaLogin(app) {
    const nome = (window.siteAtual?.()?.perfil?.nome || "").split(" ")[0];
    app.innerHTML = `<div class="container">
      <form class="login" id="form-login">
        <h2>Área ${nome ? "da " + esc(nome) : "de edição"} 🌙</h2>
        <p style="color:var(--tinta-suave);margin:0">Entre para escrever e editar as experiências.</p>
        <label for="em">E-mail</label><input id="em" type="email" autocomplete="username" required>
        <label for="se">Senha</label><input id="se" type="password" autocomplete="current-password" required>
        <button class="botao cheio largo" type="submit">Entrar</button>
        <p style="text-align:center;margin:12px 0 0"><button type="button" class="link" id="esqueci">Esqueci minha senha</button></p>
        <div id="msg"></div>
        ${avisoDemo()}
      </form>
    </div>`;
    const f = app.querySelector("#form-login");
    f.querySelector("#esqueci").onclick = async () => {
      const m = f.querySelector("#msg");
      if (!f.em.value.trim()) { mensagem(m, "Escreva seu e-mail no campo acima e clique de novo."); f.em.focus(); return; }
      try {
        await D().esqueciSenha(f.em.value.trim());
        mensagem(m, "Pronto! Se esse e-mail tiver conta, chega um link para criar uma senha nova.", "ok");
      } catch (err) { mensagem(m, err.message); }
    };
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      mensagem(f.querySelector("#msg"), "");
      try {
        await ocupado(f.querySelector("button"), () => D().entrar(f.em.value.trim(), f.se.value));
        window.Admin.abrir(app, []);
      } catch (err) { mensagem(f.querySelector("#msg"), err.message); }
    });
  }

  // ======================================================================
  //  PAINEL (lista de experiências)
  // ======================================================================
  async function painel(app) {
    const s = await D().sessao();
    app.innerHTML = `<div class="container admin">
      <div class="admin-topo">
        <div><p class="mao" style="font-size:1.4rem;color:var(--terracota);margin:0">olá 🌙</p><h1>Seu caderno de campo</h1></div>
        <div class="admin-acoes">
          <a class="botao cheio" href="#/admin/novo">＋ Nova experiência</a>
          <a class="botao" href="#/admin/perfil">Editar “Sobre”</a>
        </div>
      </div>
      ${avisoDemo()}
      <div id="lista"><p class="vazio">Carregando…</p></div>
      <div class="admin-rodape">
        <span>Conectada como <strong>${esc(s?.email)}</strong></span>
        <a href="#/admin/senha">Trocar senha</a>
        <a href="#/">Ver o site</a>
        <button class="link" id="sair">Sair</button>
      </div>
    </div>`;
    app.querySelector("#sair").onclick = async () => { await D().sair(); location.hash = "#/"; };

    const lista = app.querySelector("#lista");
    try {
      const posts = await D().listarTodos();
      if (!posts.length) {
        lista.innerHTML = `<p class="vazio">Nenhuma experiência ainda. Que tal escrever a primeira?</p>`;
        return;
      }
      const CAT = window.CATEGORIAS;
      lista.innerHTML = `<ul class="lista-admin">${posts.map((p) => `<li>
        <img src="${p.fotos[0] ? fotoSrc(p.fotos[0]) : cenaSVG("mar", 1)}" alt="">
        <div class="lista-info">
          <strong>${esc(p.titulo || "(sem título)")}</strong>
          <small>${(CAT[p.categoria] || {}).icone || ""} ${esc((CAT[p.categoria] || {}).nome || p.categoria)} · ${esc(p.data)} · ${esc(p.local)}</small>
        </div>
        <span class="selo ${p.publicado ? "pub" : "rasc"}">${p.publicado ? "Publicado" : "Rascunho"}</span>
        <div class="lista-botoes">
          <a class="botao pequeno" href="#/admin/editar/${encodeURIComponent(p.id)}">Editar</a>
          ${p.publicado ? `<a class="botao pequeno" href="#/post/${encodeURIComponent(p.slug)}">Ver</a>` : ""}
        </div>
      </li>`).join("")}</ul>`;
    } catch (err) { mensagem(lista, err.message); }
  }

  // ======================================================================
  //  EDITOR DE EXPERIÊNCIA
  // ======================================================================
  async function editor(app, id) {
    let post;
    if (id) {
      const todos = await D().listarTodos();
      post = todos.find((p) => String(p.id) === id);
      if (!post) { app.innerHTML = `<div class="container"><p class="vazio">Experiência não encontrada. <a href="#/admin">Voltar</a></p></div>`; return; }
    } else {
      post = { titulo: "", data: new Date().toISOString().slice(0, 10), local: "", lat: null, lon: null,
        categoria: "campo", resumo: "", texto: "", diario: null, fotos: [], publicado: false };
    }
    const novosCaminhos = [];   // fotos enviadas nesta edição (apagar se ela cancelar)
    const removidos = [];       // fotos tiradas do post (apagar depois de salvar)
    const d = post.diario || {};
    const CAT = window.CATEGORIAS;
    sujo = false;

    app.innerHTML = `<div class="container admin estreito-admin">
      <a href="#/admin" class="voltar-admin" id="cancelar">← voltar</a>
      <h1>${id ? "Editar experiência" : "Nova experiência"}</h1>
      ${avisoDemo()}
      <form id="form-post" class="form-admin" novalidate>
        <label>Título <input name="titulo" required maxlength="140" value="${esc(post.titulo)}" placeholder="Ex.: Dez dias a bordo do Alpha Crucis"></label>
        <div class="duas">
          <label>Data <input name="data" type="date" required value="${esc(post.data)}"></label>
          <label>Categoria
            <select name="categoria">${Object.entries(CAT).map(([k, c]) =>
              `<option value="${k}" ${post.categoria === k ? "selected" : ""}>${c.icone} ${esc(c.nome)}</option>`).join("")}</select>
          </label>
        </div>
        <label>Local <input name="local" maxlength="120" value="${esc(post.local)}" placeholder="Ex.: Tenerife, Ilhas Canárias"></label>
        <div class="local-mapa">
          <button type="button" class="botao pequeno" id="buscar-local">📍 Achar no mapa</button>
          <span id="coord">${post.lat != null ? `no mapa em ${(+post.lat).toFixed(3)}, ${(+post.lon).toFixed(3)} · <button type="button" class="link" id="tirar-mapa">tirar do mapa</button>` : "ainda não aparece no mapa"}</span>
          <div id="resultados"></div>
        </div>

        <label>Resumo <small>(aparece nos cartões, uma ou duas frases)</small>
          <textarea name="resumo" rows="2" maxlength="300">${esc(post.resumo)}</textarea></label>

        <label for="texto">Texto</label>
        <div class="barra-texto">
          <button type="button" data-marca="**" title="Negrito"><strong>N</strong></button>
          <button type="button" data-marca="*" title="Itálico"><em>I</em></button>
          <small>Deixe uma linha em branco para começar outro parágrafo.</small>
        </div>
        <textarea id="texto" name="texto" rows="12">${esc(post.texto)}</textarea>

        <details class="diario-form" ${post.diario ? "open" : ""}>
          <summary>Diário de bordo <small>(opcional, bom para embarques)</small></summary>
          <div class="duas">
            <label>Navio <input name="navio" value="${esc(d.navio)}" placeholder="N/Oc. Alpha Crucis"></label>
            <label>Coordenadas <input name="coordenadas" value="${esc(d.coordenadas)}" placeholder="24°36'S 45°24'W"></label>
            <label>Profundidade <input name="profundidade" value="${esc(d.profundidade)}" placeholder="até 1.200 m"></label>
            <label>Dias no mar <input name="dias" value="${esc(d.dias)}" placeholder="10"></label>
          </div>
        </details>

        <h3>Fotos</h3>
        <p class="dica">A primeira foto é a capa. As fotos são diminuídas automaticamente antes de enviar.</p>
        <div id="fotos" class="fotos-admin"></div>
        <label class="botao enviar-foto">＋ Adicionar fotos
          <input type="file" id="arquivo" accept="image/*" multiple hidden></label>
        <div id="progresso"></div>

        <div id="msg"></div>
        <div class="salvar">
          ${post.publicado
            ? `<button type="button" class="botao cheio" data-publicar="1">Salvar</button>
               <button type="button" class="botao" data-publicar="0">Voltar para rascunho</button>`
            : `<button type="button" class="botao cheio" data-publicar="1">Publicar</button>
               <button type="button" class="botao" data-publicar="0">Salvar rascunho</button>`}
          ${id ? `<button type="button" class="link perigo" id="apagar">Apagar experiência</button>` : ""}
        </div>
      </form>
    </div>`;

    const f = app.querySelector("#form-post");
    const msg = f.querySelector("#msg");
    f.addEventListener("input", () => (sujo = true));

    // ----- negrito / itálico -----
    const ta = f.querySelector("#texto");
    f.querySelectorAll("[data-marca]").forEach((b) => b.addEventListener("click", () => {
      const m = b.dataset.marca, i = ta.selectionStart, j = ta.selectionEnd;
      const sel = ta.value.slice(i, j) || "texto";
      ta.setRangeText(m + sel + m, i, j, "select");
      ta.focus(); sujo = true;
    }));

    // ----- localização no mapa -----
    function mostrarCoord() {
      f.querySelector("#coord").innerHTML = post.lat != null
        ? `no mapa em ${(+post.lat).toFixed(3)}, ${(+post.lon).toFixed(3)} · <button type="button" class="link" id="tirar-mapa">tirar do mapa</button>`
        : "ainda não aparece no mapa";
      const t = f.querySelector("#tirar-mapa");
      if (t) t.onclick = () => { post.lat = post.lon = null; sujo = true; mostrarCoord(); };
    }
    mostrarCoord();
    f.querySelector("#buscar-local").onclick = async () => {
      const q = f.local.value.trim(), res = f.querySelector("#resultados");
      if (!q) { res.innerHTML = `<p class="msg erro">Escreva o local primeiro.</p>`; return; }
      res.innerHTML = `<p class="dica">Procurando…</p>`;
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=pt-BR&q=${encodeURIComponent(q)}`);
        const vistos = new Set();
        const lista = (await r.json()).filter((l) => !vistos.has(l.display_name) && vistos.add(l.display_name));
        if (!lista.length) { res.innerHTML = `<p class="msg erro">Não achei. Tente escrever de outro jeito (ex.: só a cidade).</p>`; return; }
        res.innerHTML = `<p class="dica">Qual destes?</p>` + lista.map((l, i) =>
          `<button type="button" class="opcao-local" data-i="${i}">${esc(l.display_name)}</button>`).join("");
        res.querySelectorAll(".opcao-local").forEach((b) => (b.onclick = () => {
          const l = lista[+b.dataset.i];
          post.lat = +(+l.lat).toFixed(4); post.lon = +(+l.lon).toFixed(4); sujo = true;
          res.innerHTML = ""; mostrarCoord();
        }));
      } catch (e) { res.innerHTML = `<p class="msg erro">Não consegui buscar agora. Tente de novo em instantes.</p>`; }
    };

    // ----- fotos -----
    const caixaFotos = f.querySelector("#fotos");
    function desenharFotos() {
      if (!post.fotos.length) { caixaFotos.innerHTML = `<p class="vazio">Nenhuma foto ainda.</p>`; return; }
      caixaFotos.innerHTML = post.fotos.map((foto, i) => `<div class="foto-admin">
        <div class="foto-img"><img src="${fotoSrc(foto)}" alt="">${i === 0 ? `<span class="capa-selo">capa</span>` : ""}</div>
        <input data-legenda="${i}" value="${esc(foto.legenda)}" placeholder="Legenda" maxlength="80">
        <div class="foto-botoes">
          <button type="button" data-mover="${i}" data-dir="-1" ${i === 0 ? "disabled" : ""} title="Mover para a esquerda">←</button>
          ${i ? `<button type="button" data-capa="${i}" title="Usar como capa">★ capa</button>` : ""}
          <button type="button" data-mover="${i}" data-dir="1" ${i === post.fotos.length - 1 ? "disabled" : ""} title="Mover para a direita">→</button>
          <button type="button" data-tirar="${i}" title="Tirar foto" class="perigo">✕</button>
        </div>
      </div>`).join("");
      caixaFotos.querySelectorAll("[data-legenda]").forEach((inp) =>
        inp.addEventListener("input", () => (post.fotos[+inp.dataset.legenda].legenda = inp.value)));
      caixaFotos.querySelectorAll("[data-mover]").forEach((b) => (b.onclick = () => {
        const i = +b.dataset.mover, j = i + +b.dataset.dir;
        [post.fotos[i], post.fotos[j]] = [post.fotos[j], post.fotos[i]]; sujo = true; desenharFotos();
      }));
      caixaFotos.querySelectorAll("[data-capa]").forEach((b) => (b.onclick = () => {
        const [x] = post.fotos.splice(+b.dataset.capa, 1); post.fotos.unshift(x); sujo = true; desenharFotos();
      }));
      caixaFotos.querySelectorAll("[data-tirar]").forEach((b) => (b.onclick = () => {
        const [x] = post.fotos.splice(+b.dataset.tirar, 1);
        if (x.caminho) removidos.push(x.caminho);
        sujo = true; desenharFotos();
      }));
    }
    desenharFotos();

    f.querySelector("#arquivo").addEventListener("change", async (e) => {
      const arquivos = [...e.target.files];
      e.target.value = "";
      const prog = f.querySelector("#progresso");
      for (let k = 0; k < arquivos.length; k++) {
        prog.innerHTML = `<p class="dica">Enviando foto ${k + 1} de ${arquivos.length}…</p>`;
        try {
          const r = await D().enviarFoto(arquivos[k]);
          if (r.caminho) novosCaminhos.push(r.caminho);
          post.fotos.push({ url: r.url, caminho: r.caminho, legenda: "" });
          sujo = true; desenharFotos();
        } catch (err) { prog.innerHTML = `<p class="msg erro">${esc(arquivos[k].name)}: ${esc(err.message)}</p>`; return; }
      }
      prog.innerHTML = "";
    });

    // ----- cancelar -----
    f.closest(".admin").querySelector("#cancelar").addEventListener("click", async (e) => {
      if (sujo && !confirm("Sair sem salvar? As mudanças serão perdidas.")) { e.preventDefault(); return; }
      sujo = false;
      D().apagarArquivos(novosCaminhos);
    });

    // ----- salvar -----
    function lerFormulario(publicar) {
      const diario = { navio: f.navio.value.trim(), coordenadas: f.coordenadas.value.trim(),
        profundidade: f.profundidade.value.trim(), dias: f.dias.value.trim() };
      return { ...post, titulo: f.titulo.value.trim(), data: f.data.value, categoria: f.categoria.value,
        local: f.local.value.trim(), resumo: f.resumo.value.trim(), texto: f.texto.value.trim(),
        diario: Object.values(diario).some(Boolean) ? diario : null, publicado: publicar };
    }
    f.querySelectorAll("[data-publicar]").forEach((b) => b.addEventListener("click", async () => {
      const publicar = b.dataset.publicar === "1";
      const dados = lerFormulario(publicar);
      if (!dados.titulo) { mensagem(msg, "Coloque um título."); f.titulo.focus(); return; }
      if (!dados.data) { mensagem(msg, "Coloque a data."); f.data.focus(); return; }
      if (publicar && !dados.fotos.length && !confirm("Publicar sem nenhuma foto?")) return;
      mensagem(msg, "");
      try {
        const salvo = await ocupado(b, () => D().salvarPost(dados));
        await D().apagarArquivos(removidos);
        sujo = false;
        await window.recarregarSite?.();
        location.hash = "#/admin";
        setTimeout(() => window.avisar?.(publicar ? "Experiência publicada! 🌊" : "Rascunho salvo."), 50);
        return salvo;
      } catch (err) { mensagem(msg, err.message); }
    }));

    // ----- apagar -----
    const apagar = f.querySelector("#apagar");
    if (apagar) apagar.onclick = async () => {
      if (!confirm(`Apagar "${post.titulo}" e as fotos dela? Isso não pode ser desfeito.`)) return;
      try {
        await ocupado(apagar, () => D().apagarPost(post));
        await D().apagarArquivos(novosCaminhos);
        sujo = false;
        await window.recarregarSite?.();
        location.hash = "#/admin";
        setTimeout(() => window.avisar?.("Experiência apagada."), 50);
      } catch (err) { mensagem(msg, err.message); }
    };
  }

  // ======================================================================
  //  EDITOR DA PÁGINA "SOBRE"
  // ======================================================================
  function linhasEditaveis(caixa, itens, campos, rotuloNovo) {
    function desenhar() {
      caixa.innerHTML = itens.map((it, i) => `<div class="linha-edit">
        ${campos.map((c) => `<input data-i="${i}" data-c="${c.nome}" type="${c.tipo || "text"}" placeholder="${esc(c.rotulo)}" value="${esc(it[c.nome])}" aria-label="${esc(c.rotulo)}">`).join("")}
        <button type="button" class="perigo" data-del="${i}" title="Remover">✕</button>
      </div>`).join("") + `<button type="button" class="botao pequeno" data-add>＋ ${esc(rotuloNovo)}</button>`;
      caixa.querySelectorAll("input").forEach((inp) =>
        inp.addEventListener("input", () => (itens[+inp.dataset.i][inp.dataset.c] = inp.value)));
      caixa.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { itens.splice(+b.dataset.del, 1); sujo = true; desenhar(); }));
      caixa.querySelector("[data-add]").onclick = () => { itens.push({}); sujo = true; desenhar(); };
    }
    desenhar();
    return () => itens.filter((it) => campos.some((c) => (it[c.nome] || "").trim()));
  }

  async function editorPerfil(app) {
    const p = await D().lerPerfil();
    const ct = p.contatos || {};
    const novos = [], removidos = [];
    let foto = p.fotoPerfil || null, curriculo = p.curriculo || "", curriculoCaminho = p.curriculoCaminho || null;
    sujo = false;

    app.innerHTML = `<div class="container admin estreito-admin">
      <a href="#/admin" class="voltar-admin" id="cancelar">← voltar</a>
      <h1>Página “Sobre”</h1>
      ${avisoDemo()}
      <form id="form-perfil" class="form-admin" novalidate>
        <div class="perfil-foto">
          <img id="foto-perfil" src="${foto ? fotoSrc(foto) : cenaSVG("mata", 3)}" alt="">
          <label class="botao pequeno">Trocar foto<input type="file" id="arq-foto" accept="image/*" hidden></label>
        </div>
        <div class="duas">
          <label>Nome <input name="nome" value="${esc(p.nome)}" required></label>
          <label>Apelido <input name="apelido" value="${esc(p.apelido)}"></label>
        </div>
        <label>Frase de apresentação <small>(aparece no início)</small>
          <textarea name="frase" rows="2" maxlength="240">${esc(p.frase)}</textarea></label>
        <label>Sobre mim <small>(linha em branco = novo parágrafo)</small>
          <textarea name="sobre" rows="8">${esc((p.sobre || []).join("\n\n"))}</textarea></label>

        <h3>Formação</h3><div id="formacao"></div>
        <div class="duas">
          <label>Competências <small>(uma por linha)</small>
            <textarea name="competencias" rows="6">${esc((p.competencias || []).join("\n"))}</textarea></label>
          <label>Idiomas <small>(um por linha)</small>
            <textarea name="idiomas" rows="6">${esc((p.idiomas || []).join("\n"))}</textarea></label>
        </div>

        <h3>Contatos</h3>
        <div class="duas">
          <label>E-mail <input name="email" type="email" value="${esc(ct.email)}"></label>
          <label>Instagram <input name="instagram" value="${esc(ct.instagram)}" placeholder="https://instagram.com/..."></label>
          <label>LinkedIn <input name="linkedin" value="${esc(ct.linkedin)}" placeholder="https://linkedin.com/in/..."></label>
          <label>Lattes <input name="lattes" value="${esc(ct.lattes)}" placeholder="http://lattes.cnpq.br/..."></label>
        </div>

        <h3>Currículo (PDF)</h3>
        <div class="local-mapa">
          <label class="botao pequeno">Enviar PDF<input type="file" id="arq-pdf" accept="application/pdf" hidden></label>
          <span id="cv">${curriculo && curriculo !== "#" ? `<a href="${esc(curriculo)}" target="_blank" rel="noopener">ver o atual</a>` : "nenhum enviado"}</span>
        </div>

        <h3>Marcos da trajetória</h3>
        <p class="dica">Momentos que não são experiências, como entrada na faculdade ou formatura. As experiências já entram na linha do tempo sozinhas.</p>
        <div id="marcos"></div>

        <div id="msg"></div>
        <div class="salvar"><button type="button" class="botao cheio" id="salvar">Salvar</button></div>
      </form>
    </div>`;

    const f = app.querySelector("#form-perfil");
    const msg = f.querySelector("#msg");
    f.addEventListener("input", () => (sujo = true));

    const lerFormacao = linhasEditaveis(f.querySelector("#formacao"), (p.formacao || []).map((x) => ({ ...x })),
      [{ nome: "titulo", rotulo: "Curso" }, { nome: "lugar", rotulo: "Instituição / lugar" }, { nome: "periodo", rotulo: "Período" }], "Adicionar formação");
    const lerMarcos = linhasEditaveis(f.querySelector("#marcos"), (p.marcos || []).map((x) => ({ ...x })),
      [{ nome: "data", rotulo: "Data", tipo: "date" }, { nome: "titulo", rotulo: "Título" }, { nome: "texto", rotulo: "Descrição curta" }], "Adicionar marco");

    f.querySelector("#arq-foto").addEventListener("change", async (e) => {
      const arq = e.target.files[0]; e.target.value = "";
      if (!arq) return;
      try {
        mensagem(msg, "Enviando foto…", "info");
        const r = await D().enviarFotoPerfil(arq);
        if (r.caminho) novos.push(r.caminho);
        if (foto?.caminho) removidos.push(foto.caminho);
        foto = { url: r.url, caminho: r.caminho };
        f.querySelector("#foto-perfil").src = r.url;
        sujo = true; mensagem(msg, "");
      } catch (err) { mensagem(msg, err.message); }
    });
    f.querySelector("#arq-pdf").addEventListener("change", async (e) => {
      const arq = e.target.files[0]; e.target.value = "";
      if (!arq) return;
      try {
        mensagem(msg, "Enviando PDF…", "info");
        const r = await D().enviarPDF(arq);
        if (r.caminho) novos.push(r.caminho);
        if (curriculoCaminho) removidos.push(curriculoCaminho);
        curriculo = r.url; curriculoCaminho = r.caminho;
        f.querySelector("#cv").innerHTML = `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(arq.name)}</a>`;
        sujo = true; mensagem(msg, "");
      } catch (err) { mensagem(msg, err.message); }
    });

    app.querySelector("#cancelar").addEventListener("click", (e) => {
      if (sujo && !confirm("Sair sem salvar? As mudanças serão perdidas.")) { e.preventDefault(); return; }
      sujo = false;
      D().apagarArquivos(novos);
    });

    const linhas = (t) => t.split("\n").map((x) => x.trim()).filter(Boolean);
    f.querySelector("#salvar").onclick = async (ev) => {
      if (!f.nome.value.trim()) { mensagem(msg, "Coloque o nome."); return; }
      const dados = {
        ...p,
        nome: f.nome.value.trim(), apelido: f.apelido.value.trim(), frase: f.frase.value.trim(),
        sobre: f.sobre.value.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean),
        formacao: lerFormacao(), competencias: linhas(f.competencias.value), idiomas: linhas(f.idiomas.value),
        contatos: { email: f.email.value.trim(), instagram: f.instagram.value.trim(), linkedin: f.linkedin.value.trim(), lattes: f.lattes.value.trim() },
        fotoPerfil: foto, curriculo, curriculoCaminho,
        marcos: lerMarcos().filter((m) => m.data && m.titulo),
      };
      try {
        await ocupado(ev.currentTarget, () => D().salvarPerfil(dados));
        await D().apagarArquivos(removidos);
        sujo = false;
        await window.recarregarSite?.();
        location.hash = "#/admin";
        setTimeout(() => window.avisar?.("Página “Sobre” salva."), 50);
      } catch (err) { mensagem(msg, err.message); }
    };
  }

  // ======================================================================
  //  TROCAR SENHA
  // ======================================================================
  function telaSenha(app) {
    app.innerHTML = `<div class="container">
      <form class="login" id="form-senha">
        <a href="#/admin" class="voltar-admin">← voltar</a>
        <h2>Trocar senha</h2>
        <label for="s1">Nova senha</label><input id="s1" type="password" autocomplete="new-password" minlength="6" required>
        <label for="s2">Repita a nova senha</label><input id="s2" type="password" autocomplete="new-password" minlength="6" required>
        <button class="botao cheio largo" type="submit">Salvar nova senha</button>
        <div id="msg"></div>
        ${avisoDemo()}
      </form>
    </div>`;
    const f = app.querySelector("#form-senha");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const m = f.querySelector("#msg");
      if (f.s1.value !== f.s2.value) { mensagem(m, "As duas senhas estão diferentes."); return; }
      try {
        await ocupado(f.querySelector("button"), () => D().trocarSenha(f.s1.value));
        f.reset(); mensagem(m, "Senha trocada!", "ok");
      } catch (err) { mensagem(m, err.message); }
    });
  }

  // ======================================================================
  window.Admin = {
    async abrir(app, params) {
      app.innerHTML = `<div class="container"><p class="vazio" style="padding:48px 0">Carregando…</p></div>`;
      try {
        if (!(await D().sessao())) return telaLogin(app);
        const [acao, id] = params;
        if (acao === "novo") return await editor(app, null);
        if (acao === "editar") return await editor(app, id);
        if (acao === "perfil") return await editorPerfil(app);
        if (acao === "senha") return telaSenha(app);
        return await painel(app);
      } catch (err) {
        app.innerHTML = `<div class="container"><p class="msg erro" style="margin-top:48px">${esc(err.message)}</p></div>`;
      }
    },
    temMudancas: () => sujo,
    descartar: () => { sujo = false; },
  };
})();

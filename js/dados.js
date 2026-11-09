/*
  CAMADA DE DADOS
  ---------------
  O resto do site só conversa com "window.Dados". Por baixo, ele usa:
   - o Supabase, se js/config.js estiver preenchido; ou
   - o MODO DEMONSTRAÇÃO, com o conteúdo de exemplo de js/data.js (nada é salvo).
*/
(function () {
  const C = window.CONFIG || {};
  const usarSupabase = !!(C.SUPABASE_URL && C.SUPABASE_CHAVE_PUBLICA && window.supabase);
  const BALDE = "fotos"; // nome do "bucket" de arquivos no Supabase

  // ---------- utilidades ----------
  const copia = (x) => JSON.parse(JSON.stringify(x));

  function criarSlug(titulo) {
    const base = String(titulo || "post").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "post";
    return `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  // Deixa qualquer post no mesmo formato
  function normalizarPost(p) {
    return {
      id: p.id,
      slug: p.slug || p.id,
      titulo: p.titulo || "",
      data: (p.data || "").slice(0, 10),
      local: p.local || "",
      lat: p.lat ?? null,
      lon: p.lon ?? null,
      categoria: p.categoria || "campo",
      resumo: p.resumo || "",
      texto: Array.isArray(p.texto) ? p.texto.join("\n\n") : (p.texto || ""),
      diario: p.diario && Object.values(p.diario).some((v) => v !== "" && v != null) ? p.diario : null,
      fotos: Array.isArray(p.fotos) ? p.fotos : [],
      publicado: p.publicado !== false,
    };
  }

  function perfilPadrao() {
    const S = copia(window.SITE || {});
    S.marcos = copia(window.MARCOS || []);
    return S;
  }

  // Diminui a foto no próprio navegador antes de enviar (economiza espaço e deixa o site rápido)
  function reduzirImagem(arquivo, maior = 1800, qualidade = 0.82) {
    return new Promise((ok, erro) => {
      const img = new Image();
      const url = URL.createObjectURL(arquivo);
      img.onload = () => {
        const escala = Math.min(1, maior / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * escala);
        c.height = Math.round(img.height * escala);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((b) => (b ? ok(b) : erro(new Error("Não consegui converter a foto."))), "image/jpeg", qualidade);
      };
      img.onerror = () => { URL.revokeObjectURL(url); erro(new Error("Esse arquivo não parece ser uma imagem.")); };
      img.src = url;
    });
  }

  const nomeArquivo = (pasta, ext) =>
    `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // ======================================================================
  //  SUPABASE
  // ======================================================================
  function backendSupabase() {
    const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_CHAVE_PUBLICA);

    const falhou = (error) => { if (error) throw new Error(traduzirErro(error.message)); };

    async function enviar(caminho, blob, tipo) {
      const { error } = await sb.storage.from(BALDE).upload(caminho, blob, { contentType: tipo, upsert: false });
      falhou(error);
      return { url: sb.storage.from(BALDE).getPublicUrl(caminho).data.publicUrl, caminho };
    }

    return {
      modo: "supabase",

      async carregarSite() {
        const [rp, rf] = await Promise.all([
          sb.from("posts").select("*").eq("publicado", true).order("data", { ascending: false }),
          sb.from("perfil").select("dados").eq("id", 1).maybeSingle(),
        ]);
        falhou(rp.error); falhou(rf.error);
        return { posts: rp.data.map(normalizarPost), perfil: rf.data?.dados || perfilPadrao() };
      },

      async sessao() {
        const { data } = await sb.auth.getSession();
        return data.session ? { email: data.session.user.email } : null;
      },
      async entrar(email, senha) {
        const { error } = await sb.auth.signInWithPassword({ email, password: senha });
        falhou(error);
      },
      async sair() { await sb.auth.signOut(); },
      async esqueciSenha(email) {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        falhou(error);
      },
      async trocarSenha(nova) {
        const { error } = await sb.auth.updateUser({ password: nova });
        falhou(error);
      },

      async listarTodos() {
        const { data, error } = await sb.from("posts").select("*").order("data", { ascending: false });
        falhou(error);
        return data.map(normalizarPost);
      },
      async salvarPost(post) {
        const linha = { ...normalizarPost(post) };
        delete linha.id;
        if (!linha.slug) linha.slug = criarSlug(linha.titulo);
        const q = post.id
          ? sb.from("posts").update(linha).eq("id", post.id).select().single()
          : sb.from("posts").insert(linha).select().single();
        const { data, error } = await q;
        falhou(error);
        return normalizarPost(data);
      },
      async apagarPost(post) {
        const { error } = await sb.from("posts").delete().eq("id", post.id);
        falhou(error);
        await this.apagarArquivos(post.fotos.map((f) => f.caminho));
      },

      async enviarFoto(arquivo) {
        const blob = await reduzirImagem(arquivo);
        return enviar(nomeArquivo("posts", "jpg"), blob, "image/jpeg");
      },
      async enviarFotoPerfil(arquivo) {
        const blob = await reduzirImagem(arquivo, 1200);
        return enviar(nomeArquivo("perfil", "jpg"), blob, "image/jpeg");
      },
      async enviarPDF(arquivo) {
        if (arquivo.type !== "application/pdf") throw new Error("O currículo precisa ser um arquivo PDF.");
        return enviar(nomeArquivo("perfil", "pdf"), arquivo, "application/pdf");
      },
      async apagarArquivos(caminhos) {
        const lista = (caminhos || []).filter(Boolean);
        if (lista.length) await sb.storage.from(BALDE).remove(lista);
      },

      async lerPerfil() {
        const { data, error } = await sb.from("perfil").select("dados").eq("id", 1).maybeSingle();
        falhou(error);
        return data?.dados || perfilPadrao();
      },
      async salvarPerfil(dados) {
        const { error } = await sb.from("perfil").upsert({ id: 1, dados });
        falhou(error);
      },
    };
  }

  function traduzirErro(msg = "") {
    if (/Invalid login credentials/i.test(msg)) return "E-mail ou senha incorretos.";
    if (/row-level security|permission denied|Unauthorized/i.test(msg)) return "Sem permissão. Confira se você entrou com a conta certa.";
    if (/Failed to fetch|NetworkError/i.test(msg)) return "Sem conexão com o servidor. Confira a internet (ou se o projeto do Supabase está pausado).";
    if (/Password should be/i.test(msg)) return "A senha precisa ter pelo menos 6 caracteres.";
    if (/Payload too large|exceeded the maximum/i.test(msg)) return "Arquivo grande demais.";
    return msg;
  }

  // ======================================================================
  //  MODO DEMONSTRAÇÃO (tudo fica só na memória da página)
  // ======================================================================
  function backendDemo() {
    let posts = (window.POSTS || []).map((p) => normalizarPost({ ...copia(p), slug: p.id }));
    let perfil = perfilPadrao();
    let logado = null;
    const espera = (ms = 250) => new Promise((r) => setTimeout(r, ms));
    const arquivoParaURL = (blob) => new Promise((ok) => {
      const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob);
    });

    return {
      modo: "demo",
      async carregarSite() {
        return { posts: copia(posts.filter((p) => p.publicado)), perfil: copia(perfil) };
      },
      async sessao() { return logado; },
      async entrar(email, senha) {
        await espera();
        if (!email || !senha) throw new Error("Preencha e-mail e senha.");
        logado = { email };
      },
      async sair() { logado = null; },
      async esqueciSenha(email) {
        await espera();
        if (!email) throw new Error("Escreva seu e-mail no campo acima.");
      },
      async trocarSenha(nova) {
        await espera();
        if (!nova || nova.length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
      },
      async listarTodos() { return copia(posts).sort((a, b) => b.data.localeCompare(a.data)); },
      async salvarPost(post) {
        await espera();
        const p = normalizarPost(copia(post));
        if (!p.id) { p.id = crypto.randomUUID?.() || String(Date.now()); p.slug = criarSlug(p.titulo); posts.push(p); }
        else posts = posts.map((x) => (x.id === p.id ? p : x));
        return copia(p);
      },
      async apagarPost(post) { await espera(); posts = posts.filter((x) => x.id !== post.id); },
      async enviarFoto(arquivo) { return { url: await arquivoParaURL(await reduzirImagem(arquivo)), caminho: null }; },
      async enviarFotoPerfil(arquivo) { return { url: await arquivoParaURL(await reduzirImagem(arquivo, 1200)), caminho: null }; },
      async enviarPDF(arquivo) {
        if (arquivo.type !== "application/pdf") throw new Error("O currículo precisa ser um arquivo PDF.");
        return { url: URL.createObjectURL(arquivo), caminho: null };
      },
      async apagarArquivos() {},
      async lerPerfil() { return copia(perfil); },
      async salvarPerfil(dados) { await espera(); perfil = copia(dados); },
    };
  }

  window.Dados = usarSupabase ? backendSupabase() : backendDemo();
})();

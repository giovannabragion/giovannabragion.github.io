/*
  Mapa no estilo carta náutica antiga, desenhado com a biblioteca d3.
  Os contornos dos continentes vêm do pacote "world-atlas".
*/
(function () {
  const URL_TERRA = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json";
  let terraCache = null;

  function carregarTerra() {
    if (!terraCache) {
      terraCache = fetch(URL_TERRA)
        .then((r) => r.json())
        .then((topo) => topojson.feature(topo, topo.objects.land))
        .catch((e) => { terraCache = null; throw e; });
    }
    return terraCache;
  }

  function rosaDosVentos(g, x, y, r) {
    const rosa = g.append("g").attr("transform", `translate(${x} ${y})`).attr("opacity", 0.75);
    rosa.append("circle").attr("r", r).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 0.8);
    rosa.append("circle").attr("r", r * 0.8).attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 0.4);
    for (let i = 0; i < 8; i++) {
      const longa = i % 2 === 0, comp = longa ? r * 1.15 : r * 0.7, larg = longa ? r * 0.16 : r * 0.1;
      rosa.append("path")
        .attr("d", `M0 ${-comp} L${larg} 0 L0 ${larg * 0.6} L${-larg} 0Z`)
        .attr("transform", `rotate(${i * 45})`)
        .attr("fill", i === 0 ? "var(--terracota)" : "currentColor")
        .attr("fill-opacity", longa ? 0.8 : 0.5);
    }
    rosa.append("text").attr("y", -r * 1.3).attr("text-anchor", "middle")
      .attr("class", "rotulo").style("font-size", `${Math.max(12, r * 0.45)}px`).text("N");
  }

  window.desenharMapa = function (alvo, posts, grande, lugares = []) {
    if (!alvo) return;
    lugares = (lugares || []).filter((l) => l.lat != null && l.lon != null);
    alvo.innerHTML = `<div class="carta"><div class="carta-status">desenhando a carta…</div></div>`;
    const caixa = alvo.querySelector(".carta");

    carregarTerra().then((terra) => {
      if (!document.body.contains(caixa)) return; // a pessoa já mudou de página
      const L = 900, A = grande ? 640 : 420;
      const proj = d3.geoMercator().fitExtent([[24, 24], [L - 24, A - 24]],
        { type: "MultiPoint", coordinates: [[-60, -36], [-10, 33]] });
      const caminho = d3.geoPath(proj);

      caixa.innerHTML = "";
      const svg = d3.select(caixa).append("svg").attr("viewBox", `0 0 ${L} ${A}`).attr("role", "img")
        .attr("aria-label", "Mapa com os lugares das experiências");
      const g = svg.append("g");

      g.append("path").datum(d3.geoGraticule().step([10, 10])()).attr("class", "grade-geo").attr("d", caminho);
      g.append("path").datum(terra).attr("class", "terra").attr("d", caminho);

      // Rota pontilhada em ordem cronológica, como uma viagem
      const emOrdem = [...posts].sort((a, b) => a.data.localeCompare(b.data));
      g.append("path")
        .datum({ type: "LineString", coordinates: emOrdem.map((p) => [p.lon, p.lat]) })
        .attr("d", caminho).attr("fill", "none").attr("stroke", "var(--terracota)")
        .attr("stroke-width", 1.2).attr("stroke-dasharray", "4 5").attr("opacity", 0.7);

      const dica = document.createElement("div");
      dica.className = "dica-mapa";
      caixa.appendChild(dica);

      function mostrarDica(e, titulo, texto) {
        const r = caixa.getBoundingClientRect(), pr = e.currentTarget.getBoundingClientRect();
        const cx = pr.left + pr.width / 2 - r.left, cy = pr.top + pr.height / 2 - r.top;
        dica.replaceChildren();
        const forte = document.createElement("strong");
        forte.textContent = titulo;
        dica.append(forte);
        if (texto) dica.append(document.createElement("br"), texto);
        dica.style.display = "block";
        dica.style.left = `${Math.max(4, Math.min(cx + 10, r.width - Math.min(230, r.width - 8)))}px`;
        dica.style.top = `${cy + 12}px`;
      }
      const esconderDica = () => (dica.style.display = "none");

      // Tamanho dos pontos pensado em pixels de tela: em celular o mapa encolhe,
      // então os pontos crescem no desenho para continuarem visíveis e fáceis de tocar.
      const escala = Math.max(0.2, caixa.clientWidth / L);           // px de tela por unidade do desenho
      const raioPonto = Math.max(grande ? 6 : 5, 5.5 / escala);       // ~11 px de diâmetro no mínimo
      const raioExtra = Math.max(grande ? 5 : 4, 4.5 / escala);
      const raioToque = 15 / escala;                                  // área de toque de ~30 px
      let zoomK = 1;

      const bordaPonto = Math.max(1.5, 1.5 / escala), bordaExtra = Math.max(2, 2 / escala);
      function desenharPonto(sel, classe, raio) {
        sel.append("circle").attr("class", classe).attr("r", raio).attr("pointer-events", "none")
          .style("stroke-width", classe === "ponto" ? bordaPonto : bordaExtra);
        return sel.append("circle").attr("class", "toque").attr("r", raioToque);
      }

      // Lugares por onde ela passou (sem experiência escrita): círculos vazados
      const extras = g.selectAll("g.extra").data(lugares).join("g").attr("class", "extra")
        .attr("transform", (l) => `translate(${proj([l.lon, l.lat])})`);
      const dicaExtra = (e, l) => mostrarDica(e, l.nome, l.ano ? `passei por aqui em ${l.ano}` : "passei por aqui");
      desenharPonto(extras, "ponto-extra", raioExtra)
        .on("mouseenter", dicaExtra).on("click", dicaExtra).on("mouseleave", esconderDica)
        .append("title").text((l) => l.nome + (l.ano ? ` (${l.ano})` : ""));

      // Experiências: pontos cheios, clicáveis
      const pontos = g.selectAll("g.lugar").data(posts).join("g").attr("class", "lugar")
        .attr("transform", (p) => `translate(${proj([p.lon, p.lat])})`);
      desenharPonto(pontos, "ponto", raioPonto)
        .on("click", (e, p) => { location.hash = `#/post/${encodeURIComponent(p.slug || p.id)}`; })
        .on("mouseenter", (e, p) => {
          mostrarDica(e, p.local || p.titulo, p.titulo);
          d3.select(e.currentTarget.parentNode).select(".ponto").attr("r", (raioPonto * 1.35) / Math.sqrt(zoomK));
        })
        .on("mouseleave", (e) => {
          esconderDica();
          d3.select(e.currentTarget.parentNode).select(".ponto").attr("r", raioPonto / Math.sqrt(zoomK));
        })
        .append("title").text((p) => `${p.local} — ${p.titulo}`);

      if (lugares.length && posts.length) {
        const legenda = document.createElement("div");
        legenda.className = "legenda-mapa";
        legenda.innerHTML = `<span><i class="cheio"></i>experiências</span><span><i class="vazado"></i>lugares por onde passei</span>`;
        caixa.appendChild(legenda);
      }

      rosaDosVentos(svg, L - 90, A - 100, grande ? 46 : 34);
      svg.append("text").attr("x", L * 0.62).attr("y", A * 0.42).attr("class", "rotulo")
        .attr("text-anchor", "middle").style("font-size", "26px").style("opacity", 0.55)
        .text("Oceano Atlântico");

      const titulo = document.createElement("div");
      titulo.className = "titulo-carta";
      titulo.textContent = grande ? "use dois dedos ou a roda do mouse para aproximar" : "Carta das experiências";
      caixa.appendChild(titulo);

      if (grande) {
        svg.call(d3.zoom().scaleExtent([1, 12]).translateExtent([[0, 0], [L, A]])
          .on("zoom", (e) => {
            g.attr("transform", e.transform);
            zoomK = e.transform.k;
            const s = Math.sqrt(zoomK);
            pontos.select(".ponto").attr("r", raioPonto / s).style("stroke-width", bordaPonto / s);
            extras.select(".ponto-extra").attr("r", raioExtra / s).style("stroke-width", bordaExtra / s);
            g.selectAll(".toque").attr("r", raioToque / zoomK);
            g.selectAll(".terra").attr("stroke-width", 0.6 / e.transform.k);
            dica.style.display = "none";
          }));
      }
    }).catch(() => {
      caixa.innerHTML = `<div class="carta-status">Não foi possível carregar o mapa agora (sem internet?).</div>`;
    });
  };
})();

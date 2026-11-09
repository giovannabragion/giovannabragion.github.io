/*
  "Fotos" provisórias desenhadas em SVG, nas cores do site.
  Servem só até as fotos de verdade entrarem.
*/
(function () {
  function rng(seed) {
    let s = (seed * 9301 + 49297) % 233280 || 1;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  const P = {
    ceu: ["#cfe0e8", "#9fc3d6"], ceuQuente: ["#f3d9b1", "#e6a77a"], noite: ["#0f2236", "#1d3a57"],
    mar: "#24506e", marFundo: "#173a55", espuma: "#f4efe4",
    terra: "#8a5a3c", terraEscura: "#5b3a28", rocha: "#3a332e", verde: "#3f5d3a", verdeClaro: "#6b8a4e", areia: "#e3cfa6",
  };

  function grad(id, a, b) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  }

  function serra(r, base, alt, cor, pontos = 7) {
    let d = `M0 ${base}`;
    for (let i = 0; i <= pontos; i++) {
      const x = (600 / pontos) * i;
      d += ` L${x.toFixed(0)} ${(base - alt * (0.4 + r() * 0.6)).toFixed(0)}`;
    }
    return `<path d="${d} L600 450 L0 450Z" fill="${cor}"/>`;
  }

  function ondas(r, y0, n = 6) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const y = y0 + 15 + i * 28 + r() * 10, x = r() * 500;
      s += `<path d="M${x} ${y} q 15 -5 30 0 t 30 0" stroke="${P.espuma}" stroke-opacity=".35" fill="none" stroke-width="2"/>`;
    }
    return s;
  }

  const CENAS = {
    mar(r) {
      return grad("c", ...P.ceu) + `<rect width="600" height="450" fill="url(#c)"/>` +
        `<rect y="230" width="600" height="220" fill="${P.mar}"/>` + ondas(r, 240, 7);
    },
    falesia(r) {
      return grad("c", ...P.ceu) + `<rect width="600" height="450" fill="url(#c)"/>` +
        `<path d="M600 90 L520 80 L470 110 L420 100 L380 150 L350 260 L600 260Z" fill="${P.terra}" opacity=".85"/>` +
        `<path d="M600 140 L540 130 L500 170 L470 260 L600 260Z" fill="${P.terraEscura}" opacity=".6"/>` +
        `<rect y="255" width="600" height="195" fill="${P.mar}"/>` + ondas(r, 260);
    },
    costao(r) {
      let pedras = "";
      for (let i = 0; i < 6; i++) {
        const x = r() * 600, w = 80 + r() * 160, y = 260 + r() * 140;
        pedras += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${25 + r() * 25}" fill="${P.rocha}"/>`;
      }
      return grad("c", ...P.ceu) + `<rect width="600" height="450" fill="url(#c)"/>` +
        `<rect y="200" width="600" height="250" fill="${P.marFundo}"/>` + ondas(r, 205, 5) + pedras;
    },
    montanha(r) {
      return grad("c", "#dfe7e6", "#b9cfd6") + `<rect width="600" height="450" fill="url(#c)"/>` +
        serra(r, 300, 170, P.terra, 5) + serra(r, 360, 90, P.terraEscura, 8) +
        `<rect y="390" width="600" height="60" fill="#7a6a45"/>`;
    },
    mata(r) {
      let folhas = "";
      for (let i = 0; i < 26; i++) {
        const x = r() * 600, y = r() * 450, a = r() * 360, s = 0.6 + r() * 1.2;
        const c = r() > 0.5 ? P.verde : P.verdeClaro;
        folhas += `<path transform="translate(${x} ${y}) rotate(${a}) scale(${s})" d="M0 0 C 40 -30 110 -20 140 0 C 110 20 40 30 0 0Z" fill="${c}" opacity=".9"/>`;
      }
      return `<rect width="600" height="450" fill="#22351f"/>` + folhas;
    },
    navio(r) {
      return grad("c", ...P.ceu) + `<rect width="600" height="450" fill="url(#c)"/>` +
        `<rect y="250" width="600" height="200" fill="${P.mar}"/>` + ondas(r, 255) +
        `<g transform="translate(${170 + r() * 80} 0)">` +
        `<path d="M0 230 L220 230 L200 262 L18 262Z" fill="#f4efe4"/>` +
        `<rect x="40" y="200" width="90" height="30" fill="#f4efe4"/><rect x="60" y="182" width="50" height="18" fill="#c9553a"/>` +
        `<rect x="150" y="170" width="4" height="60" fill="#3a332e"/></g>`;
    },
    lua(r) {
      let est = "";
      for (let i = 0; i < 40; i++) est += `<circle cx="${r() * 600}" cy="${r() * 220}" r="${r() * 1.6}" fill="#fff" opacity="${0.4 + r() * 0.6}"/>`;
      return grad("c", ...P.noite) + `<rect width="600" height="450" fill="url(#c)"/>` + est +
        `<circle cx="${380 + r() * 120}" cy="110" r="38" fill="#f4ecd8"/>` +
        `<rect y="250" width="600" height="200" fill="#0b1a29"/>` +
        `<rect x="${400 + r() * 60}" y="255" width="40" height="190" fill="#f4ecd8" opacity=".12"/>`;
    },
    "por-do-sol"(r) {
      return grad("c", ...P.ceuQuente) + `<rect width="600" height="450" fill="url(#c)"/>` +
        `<circle cx="${200 + r() * 200}" cy="250" r="55" fill="#f7e3b5"/>` +
        serra(r, 260, 70, "#6d4a3a", 6) +
        `<rect y="260" width="600" height="190" fill="#7b5a55"/>` + ondas(r, 265, 6);
    },
    praia(r) {
      return grad("c", ...P.ceu) + `<rect width="600" height="450" fill="url(#c)"/>` +
        `<rect y="190" width="600" height="120" fill="${P.mar}"/>` + ondas(r, 190, 3) +
        `<path d="M0 290 Q 150 260 300 285 T 600 280 L600 450 L0 450Z" fill="${P.areia}"/>` +
        `<path d="M0 340 Q 200 310 380 345 T 600 335 L600 450 L0 450Z" fill="#d6bd8f"/>`;
    },
  };

  window.cenaSVG = function (nome, seed = 1) {
    const r = rng(seed);
    const corpo = (CENAS[nome] || CENAS.mar)(r);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice"><defs></defs>${corpo}</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  // Devolve o endereço da imagem, seja foto de verdade (url) ou desenho provisório (cena)
  window.fotoSrc = function (foto) {
    return foto.url || window.cenaSVG(foto.cena, foto.seed);
  };
})();

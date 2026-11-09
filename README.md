# Caderno de campo da Giovanna 🌙

Site pessoal (blog + portfólio) de uma oceanógrafa, no estilo "caderno de campo de viagem":
fundo cor de papel, fotos em moldura de polaroid, mapa em estilo carta náutica e modo noturno "mar à noite".

## Situação atual: versão 2 (visual + área de edição)

- **Área de edição** (`#/admin`, link no rodapé): login, criar, editar, apagar e
  publicar experiências (ou guardar como rascunho), enviar fotos, editar a página "Sobre",
  enviar o currículo em PDF e trocar a senha.
- Enquanto `js/config.js` estiver vazio, o site roda em **modo demonstração**: mostra o
  conteúdo de exemplo de `js/data.js`, e a área de edição aceita qualquer e-mail e senha, mas nada fica salvo.
- Para ligar de verdade, siga o **[passo a passo do Supabase](SUPABASE.md)**.

## Páginas

| Endereço | O que mostra |
|---|---|
| `#/` | Início: apresentação, registros recentes e mapa |
| `#/experiencias` | Todas as experiências, com filtro por categoria |
| `#/post/<id>` | Uma experiência: texto, diário de bordo e fotos |
| `#/mapa` | Carta náutica com os lugares (dá para aproximar) |
| `#/trajetoria` | Linha do tempo |
| `#/galeria` | Todas as fotos (clique para ampliar) |
| `#/sobre` | Sobre, formação, competências, idiomas e contatos |

## Como ver no computador

Abra um terminal nesta pasta e rode:

```
python -m http.server 8090
```

Depois abra http://localhost:8090 no navegador.

## Próximas etapas

1. **Supabase**: seguir o [SUPABASE.md](SUPABASE.md) e colar a URL e a chave pública em `js/config.js`.
2. **Publicar** no GitHub Pages (conta dela ou sua) e, se quiserem, um domínio próprio.

## Arquivos

- `index.html`: estrutura da página
- `css/style.css`: cores, fontes e visual
- `js/config.js`: ligação com o Supabase (URL e chave pública)
- `js/dados.js`: lê e grava os dados (Supabase ou modo demonstração)
- `js/admin.js`: área de edição (login, editor, página "Sobre", senha)
- `js/app.js`: páginas do site, navegação e foto ampliada
- `js/mapa.js`: mapa estilo carta náutica (d3 + world-atlas)
- `js/data.js`: conteúdo de exemplo (modo demonstração)
- `js/placeholder.js`: desenhos provisórios no lugar das fotos
- `supabase/setup.sql`: tabelas, armazenamento de fotos e regras de segurança

# Caderno de campo da Giovanna 🌙

Site pessoal (blog + portfólio) de uma oceanógrafa, no estilo "caderno de campo de viagem":
fundo cor de papel, fotos em moldura de polaroid, mapa em estilo carta náutica e modo noturno "mar à noite".

## Situação atual: versão 1 (só o visual)

- Todo o conteúdo é **de exemplo** e fica em `js/data.js`.
- As "fotos" são desenhos provisórios. Para usar uma foto de verdade, troque
  `{ cena: "mar", seed: 5, legenda: "..." }` por `{ url: "fotos/minha-foto.jpg", legenda: "..." }`.
- A página **Área de edição** (`#/admin`) ainda é só a aparência; o login de verdade vem na etapa 2.

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

1. **Supabase**: criar o projeto, as tabelas e as regras de segurança (só a conta dela pode escrever).
2. **Login e editor**: escrever, editar e apagar experiências e subir fotos pelo navegador.
3. **Publicar** no GitHub Pages (conta dela ou sua) e, se quiserem, um domínio próprio.

## Arquivos

- `index.html`: estrutura da página
- `css/style.css`: cores, fontes e visual
- `js/data.js`: conteúdo de exemplo
- `js/placeholder.js`: desenhos provisórios no lugar das fotos
- `js/mapa.js`: mapa estilo carta náutica (d3 + world-atlas)
- `js/app.js`: navegação entre páginas e foto ampliada

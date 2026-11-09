# Passo a passo: ligar o site ao Supabase

O Supabase guarda as experiências, as fotos e a conta da sua amiga. É grátis e leva uns 15 minutos.
Os nomes dos botões podem mudar um pouco, porque o Supabase atualiza o painel de vez em quando.

---

## 1. Criar a conta e o projeto

1. Entre em **https://supabase.com** e clique em **Start your project**.
2. Entre com a sua conta do **GitHub**, que é o mais fácil.
3. Clique em **New project** e preencha:
   - **Name:** `caderno-de-campo`
   - **Database Password:** clique em *Generate a password* e **guarde essa senha** num lugar seguro. O site não usa essa senha, mas ela pode ser útil um dia.
   - **Region:** *South America (São Paulo)*
4. Clique em **Create new project** e espere uns 2 minutos até ele ficar pronto.

## 2. Fechar o cadastro (só ela pode ter conta)

1. No menu da esquerda, abra **Authentication**, depois **Sign In / Providers** (em versões antigas, *Providers* ou *Settings*).
2. **Desligue** a opção **Allow new users to sign up**.
3. Confira se o **Email** está ligado e clique em **Save**.

> Assim ninguém consegue criar conta pelo site. A única conta vai ser a que você criar no passo 3.

## 3. Criar a conta dela

1. Ainda em **Authentication**, abra **Users**.
2. Clique em **Add user** e depois em **Create new user**.
3. Coloque o **e-mail dela** e uma **senha provisória**.
4. Marque **Auto Confirm User** e clique em **Create user**.

> Depois você passa essa senha provisória para ela, e ela troca pelo próprio site, em *Área de edição > Trocar senha*.

## 4. Criar as tabelas e as regras de segurança

1. No menu da esquerda, abra **SQL Editor** e clique em **New query**.
2. Abra o arquivo [`supabase/setup.sql`](supabase/setup.sql) desta pasta e copie **tudo**.
3. Cole no editor do Supabase.
4. **Importante:** perto do final, troque `EMAIL-DELA@exemplo.com` pelo **e-mail que você usou no passo 3**.
5. Clique em **Run**.
6. No resultado lá embaixo deve aparecer **uma linha com o e-mail dela**. Se aparecer vazio, o e-mail não bateu: corrija e rode de novo, sem problema.

## 5. Ligar o site ao projeto

1. Clique no botão **Connect**, no topo do painel, ou abra **Project Settings > API**.
2. Copie dois valores:
   - **Project URL**, algo como `https://abcdefgh.supabase.co`
   - **anon public key** (ou *publishable key*), um texto longo
3. Me mande esses dois valores aqui no chat. Eu coloco no arquivo `js/config.js`.
   Se preferir, você mesmo cola entre as aspas desse arquivo.

> ✅ Essas duas informações podem ficar no site, porque são públicas por natureza.
> ❌ **Nunca** use nem mande a chave **service_role** ou **secret**: ela dá acesso total ao banco.

## 6. Testar

1. Abra o site e clique em **Área de edição**, no rodapé.
2. Entre com o e-mail e a senha provisória dela.
3. Primeiro edite a página **“Sobre”** com os dados reais e salve.
4. Depois crie uma **experiência** de teste com uma foto e publique.
5. Abra o site numa janela anônima. A experiência deve aparecer, e os rascunhos não.

> Com o Supabase ligado, o conteúdo de exemplo some do site. Ele só aparece no modo demonstração.

---

## Bom saber

- **Pausa por inatividade:** no plano grátis, o Supabase pode **pausar** o projeto depois de cerca de uma semana sem uso. O site fica sem conteúdo até alguém reativar: é só entrar no painel e clicar em **Restore project**. Visitas e edições frequentes evitam a pausa.
- **Espaço:** o plano grátis tem 1 GB para arquivos. Como as fotos são diminuídas antes de enviar (cerca de 300 a 500 KB cada), cabem umas 2 mil fotos.
- **Esqueci a senha:** na tela de login há o botão *Esqueci minha senha*, que manda um link por e-mail. Para o link funcionar depois que o site estiver publicado, vá em **Authentication > URL Configuration** e coloque o endereço do site em **Site URL**.

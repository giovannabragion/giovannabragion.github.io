/*
  LIGAÇÃO COM O SUPABASE
  ----------------------
  Cole aqui os dois valores do seu projeto no Supabase
  (painel do Supabase > Project Settings > API, ou o botão "Connect").

  Enquanto estiverem vazios, o site funciona em MODO DEMONSTRAÇÃO:
  mostra o conteúdo de exemplo e a área de edição deixa testar tudo,
  mas nada fica salvo.

  A "chave pública" (anon / publishable) pode ficar no site sem problema:
  quem protege os dados são as regras de segurança do banco (arquivo supabase/setup.sql).
  NUNCA coloque aqui a chave "service_role" ou "secret".
*/
window.CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_CHAVE_PUBLICA: "",
};

# Yummy — Controle de Refeições para Obras

Projeto scaffold em Next.js + Supabase para gerenciar presença diária, café da manhã e almoço em obras.

## O que está incluso
- Next.js 14 (pages router) + TailwindCSS
- Login com Google via Supabase Auth
- Proteção de rotas (middleware)
- Persistência 100% no Supabase (employees, projects, attendance)
- Import / Export Excel (.xlsx) para employees/projects/attendance
- Script SQL `utils/schema.sql`

## Instalação rápida
1. Copie para sua máquina e entre na pasta:
```bash
# se baixou o zip
unzip Yummy.zip -d Yummy
cd Yummy
```

2. Instale dependências:
```bash
npm install
```

3. Crie `.env.local` com as variáveis do Supabase (veja `.env.local.example`).

4. Crie as tabelas no Supabase:
- Abra o painel SQL do Supabase e rode o conteúdo de `utils/schema.sql`.

5. Configure Google OAuth no Supabase (Auth > Providers) e adicione redirect URL `http://localhost:3000`.

6. Rode em desenvolvimento:
```bash
npm run dev
```

## Observações
- O frontend usa a `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave pública) para autenticação do usuário.
- As rotas server-side usam `SUPABASE_SERVICE_ROLE_KEY` (não compartilhe esta chave).
- Todos os usuários autenticados veem os mesmos dados (compartilhado).

Se quiser, eu posso também ajudar a implantar no Vercel e configurar variáveis de ambiente.


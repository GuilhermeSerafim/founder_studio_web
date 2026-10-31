# Founder Studio — protótipo de editor visual

Frontend de um editor de conteúdo para posts, com formatos, prévia e painel de edição. Usa React 18, TypeScript, Vite, Tailwind CSS e shadcn/ui, a partir de uma base Lovable.

## Funcionalidades e limites

- `src/components/studio/StudioDashboard.tsx` organiza editor e prévia e mantém estado com reducer.
- A importação de Instagram/Twitter é simulada: o código reconhece trechos da URL e carrega constantes locais após um temporizador. Não consulta essas redes nem importa o conteúdo real do link.
- `src/pages/Login.tsx` navega para a tela inicial após uma espera, sem validar credenciais em backend. Essa tela é parte do protótipo, sem autenticação real nesse fluxo.

## Desenvolvimento local

Com Node.js e npm instalados:

```sh
git clone https://github.com/GuilhermeSerafim/founder_studio_web.git
cd founder_studio_web
npm install
npm run dev
```

O manifesto também define `npm run build`, `npm run lint`, `npm test`, `npm run test:watch` e `npm run preview`. Os testes usam Vitest. O protótipo não deve ser tratado como produto completo com integração social e autenticação; exportação e persistência também requerem validação funcional própria.

## Base Lovable e opções de edição

O projeto usa a base [Lovable](https://lovable.dev/). É possível trabalhar localmente em uma IDE, editar arquivos no GitHub pelo botão de edição ou abrir um ambiente em Code → Codespaces → New codespace.

Para editar pelo Lovable, acesse o projeto correspondente na sua conta. A sincronização entre alterações no Lovable e commits no GitHub depende de uma integração configurada para este repositório. Um push local só será refletido na plataforma quando essa integração estiver ativa.

O guia original de ambiente também indica a [instalação de Node.js com nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

## Publicação e domínio

Em um projeto associado e configurado no Lovable, a opção Share → Publish permite preparar a publicação pela plataforma. A disponibilidade desse fluxo depende da conta e da integração do projeto.

Para conectar um domínio ao projeto Lovable, consulte a documentação de [domínio personalizado](https://docs.lovable.dev/features/custom-domain#custom-domain), que descreve Project → Settings → Domains → Connect Domain.

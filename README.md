# Biblioteca Digital - Leonardo Rejani

PWA (Progressive Web App) para gerenciamento de acervo pessoal de livros. Organize, cataloge e acompanhe suas leituras diretamente do navegador ou como app instalado no celular — funciona 100% offline.

## Funcionalidades

- **Cadastro completo de livros** com título, autor, editora, ano, ISBN, categoria, prateleira, páginas, idioma e capa (URL)
- **3 modos de visualização**: Lista, Grid (capas) e Prateleira (retângulos)
- **Organização por prateleiras e categorias** com índice alfabético lateral
- **Controle de empréstimos** com histórico completo
- **Sistema de avaliação** por estrelas e favoritos
- **Anotações pessoais** por livro
- **Importação/Exportação CSV** para backup e migração
- **Busca rápida** por título, autor ou editora
- **Filtros combinados** por prateleira, categoria, status, autor e favoritos
- **Modo escuro** com alternância automática
- **Configurações personalizáveis**: densidade de layout, tamanho de fonte, ordenação padrão
- **Funciona 100% offline** — dados salvos no LocalStorage do dispositivo

## Como iniciar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173/acervo_digital_pessoal/`.

## Como configurar

Acesse o menu (canto superior direito) e abra **Configurações** para ajustar:

- **Modo escuro**: alterna entre tema claro e escuro
- **Densidade do layout**: compacto, normal ou espaçoso
- **Tamanho da fonte**: pequeno, médio ou grande
- **Ordenação padrão**: título, autor, ano ou avaliação

## Build e Deploy

```bash
# Build para produção
npm run build

# Preview local do build
npm run preview
```

O deploy é feito automaticamente via **GitHub Actions** a cada push na branch `main`. O app é publicado em GitHub Pages.

### Instalando no celular

1. Acesse a URL do GitHub Pages no navegador
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**
3. O app aparecerá como um app nativo na tela inicial

## Tecnologias

- **React 18** — Interface de usuário
- **Vite 5** — Build tool e dev server
- **Tailwind CSS 3** — Estilização utilitária
- **Lucide React** — Ícones
- **vite-plugin-pwa** — Service worker e manifesto PWA

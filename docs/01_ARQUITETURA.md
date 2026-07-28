# MajFifty Robot — Arquitetura

**Última atualização:** sessão de desenvolvimento com Claude, 28/07/2026
**Status:** boot funcional (loader → componentes → CSS → Blockly injetado e operante)

---

## 1. Como rodar o projeto

```bash
npm install
npm start
```

Abre em `http://localhost:8000`. Detalhes da decisão de arquitetura (por que Express e não Electron) na seção 4.

## 2. Estrutura de pastas

```
majfifty-ui/
├── index.html
├── server.js                    (ponto de entrada oficial — ver seção 4)
├── package.json
├── node_modules/
├── docs/
│   └── ARQUITETURA.md          (este arquivo)
│
└── assets/
    ├── css/
    │   ├── reset.css           (normalização base)
    │   ├── variables.css       (design system: cores, dimensões, custom properties)
    │   ├── typography.css      (fontes, tamanhos, cor de texto/fundo do body)
    │   ├── layout.css          (CSS Grid do #app, grid-template-areas)
    │   ├── toolbar.css
    │   ├── sidebar.css
    │   ├── workspace.css
    │   ├── dashboard.css
    │   ├── terminal.css
    │   └── components.css      (arquivo de agregação — status a confirmar)
    │
    ├── components/
    │   ├── toolbar/
    │   │   ├── toolbar.html
    │   │   └── toolbar.js      (stub, reservado)
    │   ├── sidebar/
    │   │   ├── sidebar.html
    │   │   └── sidebar.js      (stub, reservado)
    │   ├── workspace/
    │   │   ├── workspace.html  (contém #blocklyDiv)
    │   │   └── workspace.js    (stub, reservado)
    │   ├── dashboard/
    │   │   ├── dashboard.html
    │   │   └── dashboard.js    (stub, reservado)
    │   ├── terminal/
    │   │   ├── terminal.html
    │   │   └── terminal.js     (stub, reservado)
    │   └── common/             (vazio — reservado pra elementos compartilhados)
    │
    ├── js/
    │   └── core/
    │       ├── component-loader.js
    │       ├── app.js
    │       ├── state.js        (status a confirmar — ver seção 8)
    │       ├── events.js       (status a confirmar — ver seção 8)
    │       └── ui.js           (status a confirmar — ver seção 8)
    │
    ├── blockly/
    │   ├── toolbox.js          (config de categorias/blocos da toolbox)
    │   ├── blockly.js          (initializeBlockly())
    │   ├── blocks.js           (blocos customizados — ainda stub, MFR-013/014 dependem disso)
    │   └── generator.js        (geradores de código dos blocos customizados — idem)
    │
    └── vendor/
        ├── blockly.min.js      (instalado via npm, copiado de node_modules/blockly/)
        └── media/              (assets internos do Blockly: ícones, cursor de lixeira, etc.)
```

---

## 3. Responsabilidade de cada diretório

| Diretório | Responsabilidade |
|---|---|
| `assets/css/` | Estilo visual. Um arquivo por componente + 4 arquivos de base (reset, variables, typography, layout). |
| `assets/components/` | Fragmentos HTML de cada região do layout, um por pasta. Cada pasta pode ter um `.js` próprio (hoje stub). |
| `assets/js/core/` | Lógica de aplicação: boot (`app.js`), carregamento de componentes (`component-loader.js`), e potencialmente estado/eventos/UI centralizados. |
| `assets/blockly/` | Tudo relacionado à configuração e extensão do Blockly: toolbox, inicialização, blocos customizados, geradores de código. |
| `assets/vendor/` | Bibliotecas de terceiros instaladas localmente (offline-first, sem depender de CDN). |
| `docs/` | Documentação do projeto. |

---

## 4. Servidor e ponto de entrada (`server.js`)

### Decisão: Node + navegador, sem Electron

Avaliado e descartado deliberadamente. Justificativa:

- **Objetivo do projeto**: MJ50 é pensado como contribuição aberta pro mundo tech (diferente do ZoyBlocks, que é Electron e privado). Um projeto aberto se beneficia de ser fácil de clonar/rodar/auditar/contribuir — Electron adiciona uma casca de Chromium empacotado, processo de build por SO, e uma barreira extra pra quem quiser mandar PR.
- **Acesso a hardware não depende de Electron**: as dependências `serialport` + `johnny-five` já dão acesso real à porta serial rodando no lado Node do `server.js`. `socket.io` faz a ponte entre esse backend e o navegador. Isso resolve o mesmo problema que o Electron resolveria, mas de forma multiplataforma nativa (qualquer SO com Node instalado) e sem empacotamento.
- Electron faria sentido para um produto fechado, com marca, distribuído como instalável — não é o caso aqui.

### `server.js`

Servidor Express mínimo, serve os arquivos estáticos da raiz do projeto (`index.html`, `assets/`):

```javascript
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`MajFifty Robot rodando em http://localhost:${PORT}`);
});
```

É o **ponto de entrada oficial e definitivo** do projeto — substitui o antigo `python3 -m http.server` manual, que não fazia parte do repo e não era descobrível por quem clonasse o projeto (identificado como problema ao rodar avaliação via Codex).

### Como rodar o projeto

```bash
npm install
npm start
```

Abre em `http://localhost:8000`.

### Caminho de evolução (MFR-017 — Node/Socket.IO)

Quando a comunicação serial em tempo real entrar, o `server.js` ganha uma camada por cima, sem reescrita:

```javascript
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

// eventos socket.io + serialport/johnny-five aqui

server.listen(PORT, ...);
```

---

## 5. Responsabilidade de cada arquivo (core)

### `index.html`
Define a casca da página: 5 containers vazios (`#toolbar-container`, `#sidebar-container`, `#workspace-container`, `#dashboard-container`, `#terminal-container`) dentro de `#app`, e a ordem de carregamento de scripts. **A ordem das tags `<script>` importa** — são scripts clássicos, sem `defer`/`type="module"`, carregados e executados sequencialmente.

Ordem atual:
```html
<script src="assets/vendor/blockly.min.js"></script>
<script src="assets/blockly/toolbox.js"></script>
<script src="assets/blockly/blockly.js"></script>
<script src="assets/js/core/component-loader.js"></script>
<script src="assets/js/core/app.js"></script>
```

### `assets/js/core/component-loader.js`
Expõe duas funções globais:
- `loadComponent(containerId, file)` — faz `fetch` de um fragmento HTML e injeta via `innerHTML` no container indicado. Lança erro se a resposta não for `ok`.
- `loadAllComponents()` — chama `loadComponent` pra cada um dos 5 componentes, sequencialmente (não paralelo).

### `assets/js/core/app.js`
Ponto de entrada. No evento `DOMContentLoaded`:
1. `await loadAllComponents()` — monta o DOM dos 5 componentes
2. `initializeBlockly()` — injeta o workspace do Blockly (só funciona depois do passo 1, porque `#blocklyDiv` só existe após o `workspace.html` ser carregado)
3. Log de confirmação

Erros de qualquer etapa são capturados em `try/catch` e logados no console — não travam a página silenciosamente, mas uma falha aborta os passos seguintes (cascata).

### `assets/blockly/blockly.js`
Declara `let workspace` no escopo global e a função `initializeBlockly()`, que chama `Blockly.inject("blocklyDiv", {...})` usando a config de `Toolbox` (vinda de `toolbox.js`) e grava o resultado em `workspace`.

### `assets/blockly/toolbox.js`
Declara `const Toolbox`, um objeto `categoryToolbox` com 5 categorias de blocos padrão do Blockly (Lógica, Repetição, Matemática, Texto, Variáveis). Reservado espaço pra categoria "Robô" com blocos customizados (MFR-013).

---

## 6. Convenções de nomenclatura

- **Pastas de componente**: nome no singular, minúsculo, em português quando aplicável ao domínio, inglês quando técnico (`toolbar`, `sidebar`, `workspace`, `dashboard`, `terminal`).
- **Arquivo HTML de componente**: mesmo nome da pasta (`toolbar/toolbar.html`).
- **IDs de container no `index.html`**: `{nome}-container` (ex: `toolbar-container`).
- **ID interno do fragmento**: `{nome}` sem sufixo (ex: `id="toolbar"` dentro de `toolbar.html`) — é esse id que o `layout.css` usa via `grid-area`.
- **CSS**: um arquivo por componente, mesmo nome (`toolbar.css` para `#toolbar`).
- **Variáveis CSS**: prefixo por categoria (`--bg-*`, `--text-*`, `--radius-*`, `--shadow-*`).
- **Tickets/roadmap**: prefixo `MFR-XXX` (MajFifty Robot), numeração sequencial.

---

## 7. Fluxo de inicialização

```
1. Navegador parseia index.html
2. Scripts carregam em ordem: Blockly (vendor) → toolbox.js → blockly.js → component-loader.js → app.js
   (nenhum executa lógica de boot ainda nessa fase — só declaram funções/objetos globais)
3. Evento DOMContentLoaded dispara
4. app.js executa:
   a. loadAllComponents()
      → fetch sequencial de cada fragmento HTML
      → innerHTML injetado no container correspondente
      → (se qualquer fetch falhar, lança erro e aborta os componentes restantes)
   b. initializeBlockly()
      → Blockly.inject("blocklyDiv", { toolbox: Toolbox, ... })
      → requer que workspace.html já tenha sido injetado no passo anterior
   c. console.log de confirmação
5. Erros de qualquer ponto acima são capturados e logados, não quebram a página silenciosamente
```

---

## 8. Pontos em aberto / a confirmar

- **`state.js`, `events.js`, `ui.js`** existiam numa versão anterior do projeto (gerenciavam `State.board.name/port/connected`, atualizavam DOM via `UI.updateBoard()`/`updateStatus()`, e `Events.init()` como stub). Não aparecem referenciados no `app.js` atual. Precisa decidir: foram descontinuados, absorvidos por outra lógica, ou esquecidos na reorganização?
- **`components.css`** — papel real ainda não confirmado; pode ser resquício de uma abordagem por `@import` que foi substituída pelos links diretos no `<head>`.
- **`assets/components/*/*.js`** (um por componente) — todos em stub (0 bytes). Decidir se a lógica de cada componente vai morar ali (descentralizado) ou continuar centralizada em `assets/js/core/`.

**Resolvido nesta sessão:** falta de ponto de entrada oficial (identificado via avaliação do Codex) — solucionado com `server.js` + `npm start`. Ver seção 4.

---

## 9. Roadmap referenciado (tickets abertos)

- **MFR-012** — Integrar o Blockly ao `workspace.html` ✅ (concluído nesta sessão)
- **MFR-013** — Toolbox dinâmica
- **MFR-014** — Gerador Arduino
- **MFR-015** — Dashboard vivo (porta, placa, memória, conexão)
- **MFR-016** — Terminal integrado
- **MFR-017** — Comunicação com Node/Socket.IO 🔸 (base lançada: `server.js` Express criado; `socket.io`, `serialport`, `johnny-five` já constam em `dependencies` no `package.json`, aguardando implementação da ponte real)
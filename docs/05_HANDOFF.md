# Relatório de avaliação — 28/07/2026

## Destinatários

GPT e Claude, sob gestão do responsável pelo projeto.

## Diagnóstico executivo

O projeto tem uma base visual modular coerente e um servidor local funcional.
`npm start` inicia o Express em `http://localhost:8000`, os componentes são
carregados antes de `initializeBlockly()` e o Blockly local está presente em
`assets/vendor/`. A etapa MFR-012 está, portanto, parcialmente comprovada por
inspeção estática e pelo boot do servidor.

Ainda não é seguro iniciar funcionalidades de hardware, geração Arduino ou
interações de interface sem antes consolidar os contratos abaixo. A maior
necessidade atual é alinhar documentação, boot e estado da aplicação.

## Achados prioritários

### P0 — corrigir antes de ampliar funcionalidades

1. **Documentação inconsistente.** `README.Md` manda ler `08_AI_MEMORY.md`,
   mas o arquivo existente é `AI_MEMORY.Md`; ele também cita a faixa
   `00_PROJECT_IDENTITY.md` a `08_AI_MEMORY.md`, que não existe. Em
   `01_ARQUITETURA.md`, a árvore aponta para `docs/ARQUITETURA.md`, embora o
   arquivo real seja `docs/01_ARQUITETURA.md`.
2. **Ordem de scripts divergente.** A arquitetura documenta Blockly vendor →
   toolbox → inicialização, enquanto `index.html` contém toolbox →
   inicialização → Blockly vendor. O boot atual pode funcionar porque a
   referência a `Blockly` ocorre dentro da função, mas essa ordem é frágil e
   impede registrar blocos customizados que dependam da biblioteca no
   carregamento. Documentação e código precisam adotar uma única ordem.
3. **Sem verificação automatizada.** `npm test` é apenas o placeholder padrão
   que falha. Não há lint, teste de carregamento dos componentes nem teste de
   geração Blockly. Não declarar MFR-012 como concluída de forma definitiva
   até existir ao menos uma verificação reproduzível no navegador.

### P1 — contratos a definir

1. `State`, `UI` e `Events` existem, mas não são carregados nem inicializados
   por `index.html`/`app.js`. Além disso, o dashboard não expõe os seletores
   usados por `UI` e hoje não recebe atualizações. MFR-015 depende de decidir
   esse contrato: **ação → State → UI (toolbar e dashboard)**.
2. Os arquivos JavaScript dos componentes estão vazios e não são carregados.
   Definir se continuam como extensões por componente ou se serão removidos em
   uma decisão explícita; não implementar comportamento em ambos os lugares.
3. `blocks.js` e `generator.js` ainda são esqueletos. A documentação cita um
   gerador JavaScript "da unpkg", o que conflita com a regra de não usar CDN e
   não atende MFR-014 (geração Arduino). Definir a biblioteca/estratégia local
   de geração antes de criar blocos Robô.

### P2 — próximos incrementos, após P0/P1

- MFR-013: toolbox dinâmica e categoria Robô.
- MFR-014: gerador Arduino local, com testes de saída.
- MFR-015: dashboard reativo a `State`.
- MFR-016: terminal com um canal de log centralizado.
- MFR-017: Socket.IO e serial somente no backend; `server.js` ainda é Express
  estático e `socket.io`, `serialport` e `johnny-five` não são usados.

## Divisão recomendada de trabalho

| Agente | Escopo fechado | Entrega e critério de aceite |
|---|---|---|
| GPT | P0 de governança: reconciliar nomes, índice, árvore e ordem canônica de carregamento na documentação; propor teste mínimo de boot. | Não deixa referência a arquivo inexistente; o documento de arquitetura reproduz exatamente a ordem de `index.html`; plano de teste executável documentado. |
| Claude | P1 de aplicação: propor e, após aprovação, implementar o contrato State/UI/Events para toolbar e dashboard. | Estado é a única origem de verdade; dashboard não acessa Blockly; alteração de placa/porta/conexão atualiza as duas regiões. |
| Gestão | Aprovar o contrato de estado e a estratégia local do gerador Arduino antes dos tickets MFR-013/014; decidir o destino dos JS vazios por componente. | Uma decisão registrada em `04_DECISOES.md` para cada escolha arquitetural. |

## Limites de integração

- Não mover arquivos, não introduzir Electron ou CDN, nem acessar serial pelo
  navegador.
- Evitar que GPT e Claude editem simultaneamente `index.html`, `app.js`,
  `01_ARQUITETURA.md` ou os documentos de decisão. Trabalhar em commits
  pequenos, com um responsável por arquivo a cada etapa.
- Antes de integrar MFR-017, definir eventos Socket.IO, formato de mensagens,
  erros e comportamento sem dispositivo conectado.

## Evidências verificadas nesta avaliação

- `package.json` possui `start: node server.js` e dependências locais,
  incluindo Blockly.
- `server.js` inicia com sucesso na porta 8000.
- `app.js` aguarda `loadAllComponents()` e só então chama
  `initializeBlockly()`.
- Não foram alterados arquivos de implementação nesta avaliação.

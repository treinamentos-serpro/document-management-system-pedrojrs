## Plan: Especificação do DMS

Criar exclusivamente `docs/specs/dms-spec.md`, preenchendo as oito seções de `spec-template.md`. A spec definirá o fluxo de upload, listagem e download com armazenamento local, e será a única alteração de produto: nenhum arquivo de backend ou frontend será criado, executado ou modificado.

**Steps**
1. Criar `docs/specs/dms-spec.md` a partir da estrutura de `docs/specs/spec-template.md`, preservando as seções: Objetivo, Escopo, Requisitos Funcionais, Requisitos Não Funcionais, Modelo de Dados, Contratos de API, Decisões Arquiteturais e Plano de Execução.
2. Documentar o objetivo de permitir gestão simples de documentos por usuário, incluindo upload, listagem e download; excluir armazenamento externo/nuvem e versionamento.
3. Especificar os requisitos funcionais com identificadores `RF-XX`: envio de arquivo e campo `owner`, geração e retorno dos metadados, listagem dos metadados e download por `id`, incluindo a resposta de documento inexistente.
4. Especificar os requisitos não funcionais com identificadores `RNF-XX`: Node/Express, JavaScript, configuração por ambiente, persistência local em `backend/storage`, `multer` com `diskStorage`, metadados em memória e separação `routes -> controllers -> services -> repositories`.
5. Registrar o modelo de metadados com `id`, `originalName`, `size`, `uploadedAt` e `owner`. Acrescentar `storedName` somente como detalhe interno de persistência, se necessário para relacionar o metadata ao arquivo salvo, sem expô-lo como contrato público.
6. Detalhar os contratos das três APIs: `POST /upload` aceita `multipart/form-data` com `file` e `owner`; `GET /documents` devolve metadados; `GET /documents/:id/download` devolve conteúdo binário preservando o nome original. Documentar respostas de sucesso e erros HTTP mínimos para entrada ausente/inválida e recurso inexistente.
7. Explicar as responsabilidades de cada camada e o fluxo de dependência, sem prescrever arquivos de implementação, classes ou lógica executável.
8. Preencher o plano de execução como sequência futura de implementação e testes, sem realizar nem descrever a execução de comandos ou alterações nos arquivos de backend e frontend.
9. Revisar a nova spec contra o template e as instruções do repositório, validando se o único arquivo novo previsto é `docs/specs/dms-spec.md`.

**Relevant files**
- /workspaces/document-management-system-pedrojrs/docs/specs/dms-spec.md — novo e único artefato a criar com a especificação completa.
- /workspaces/document-management-system-pedrojrs/docs/specs/spec-template.md — estrutura e conteúdo-base obrigatório.
- /workspaces/document-management-system-pedrojrs/.github/copilot-instructions.md — limites arquiteturais, armazenamento e convenções que a spec deve refletir.

**Verification**
1. Comparar os títulos de `dms-spec.md` com o template para confirmar as oito seções na mesma ordem.
2. Verificar que todos os endpoints previstos têm entrada, saída e erros essenciais documentados.
3. Verificar que a spec contém somente armazenamento local com `multer`/`diskStorage`, metadados em memória e a cadeia arquitetural exigida.
4. Conferir o diff para garantir que somente `docs/specs/dms-spec.md` seja criado ou alterado.

**Decisions**
- `owner` será um campo textual obrigatório submetido no mesmo `multipart/form-data` de `POST /upload`; não haverá autenticação, sessão ou autorização nesta etapa.
- A listagem não será filtrada por dono, pois tal filtro não foi definido no escopo atual; o campo será retornado nos metadados para suporte à gestão simples futura.
- Armazenamento em nuvem, versionamento, persistência de metadados em banco/arquivo, limites de tamanho/tipo e controles avançados de acesso permanecem fora do escopo.
- A alteração solicitada limita-se à documentação; backend e frontend não serão implementados, modificados nem executados.

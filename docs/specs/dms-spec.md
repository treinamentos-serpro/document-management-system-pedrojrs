# Especificação - Document Management System

## 1. Objetivo

Permitir que usuários enviem, consultem e baixem documentos, com armazenamento local dos arquivos e gestão simples dos respectivos metadados.

## 2. Escopo

### Dentro do escopo

- Upload de documentos por usuário.
- Registro e manutenção em memória dos metadados dos documentos enviados.
- Listagem dos documentos cadastrados.
- Download de um documento pelo seu identificador.
- Armazenamento físico dos arquivos no filesystem local da aplicação.

### Fora do escopo

- Armazenamento externo ou em nuvem.
- Versionamento de documentos.
- Autenticação, sessão e autorização avançada de usuários.
- Filtro da listagem por usuário.
- Persistência dos metadados em banco de dados ou arquivo.
- Limites de tamanho, tipos permitidos e antivírus de arquivos.

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o envio de um arquivo por meio de `multipart/form-data`. |
| RF-02 | O envio deve receber o arquivo no campo `file` e o identificador textual do dono no campo `owner`. |
| RF-03 | O sistema deve rejeitar uma solicitação de upload sem arquivo ou sem o campo `owner`. |
| RF-04 | Ao concluir o upload, o sistema deve gerar um identificador único e registrar os metadados do documento. |
| RF-05 | O sistema deve retornar os metadados do documento criado após um upload bem-sucedido. |
| RF-06 | O sistema deve listar todos os metadados de documentos disponíveis na memória. |
| RF-07 | O sistema deve permitir o download de um documento a partir do seu `id`. |
| RF-08 | O download deve preservar o nome original do arquivo para o cliente. |
| RF-09 | O sistema deve retornar uma resposta de recurso não encontrado ao solicitar o download de um `id` inexistente. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | O backend deve ser desenvolvido em Node.js com Express e JavaScript CommonJS. |
| RNF-02 | Os arquivos devem ser gravados exclusivamente no filesystem local, na pasta `backend/storage`. |
| RNF-03 | O upload deve usar `multer` configurado com `diskStorage`. |
| RNF-04 | Os metadados devem ser mantidos somente em memória nesta fase do sistema. |
| RNF-05 | A configuração da aplicação deve usar variáveis de ambiente, conforme os princípios de 12-Factor App. |
| RNF-06 | O backend deve respeitar o fluxo de dependências `routes -> controllers -> services -> repositories`. |
| RNF-07 | O frontend deve usar React com componentes funcionais e comunicar-se com o backend usando `fetch` pelo prefixo `/api`. |
| RNF-08 | Erros de entrada HTTP e de leitura ou escrita no filesystem devem ser tratados nos limites da aplicação. |
| RNF-09 | Os testes do backend devem usar o runner nativo `node:test`. |

## 5. Modelo de dados (metadados do documento)

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | Identificador único do documento. |
| originalName | string | Nome original do arquivo recebido no upload. |
| size | number | Tamanho do arquivo em bytes. |
| uploadedAt | string | Data e hora do upload no formato ISO 8601. |
| owner | string | Identificador textual do usuário dono do documento, enviado pelo cliente. |

Os metadados acima compõem o contrato público. A referência ao arquivo gravado no disco pode ser mantida internamente pelo repositório, sem ser exposta nas respostas da API.

## 6. Contratos de API

As rotas do backend são apresentadas sem o prefixo do proxy do frontend. Quando consumidas pela aplicação React, devem ser acessadas pelo prefixo `/api`.

### POST /upload

**Entrada**

- Tipo de conteúdo: `multipart/form-data`.
- Campo `file`: arquivo obrigatório.
- Campo `owner`: texto obrigatório que identifica o dono do documento.

**Saída de sucesso**

- Status: `201 Created`.
- Corpo: metadados do documento criado.

```json
{
  "id": "document-id",
  "originalName": "relatorio.pdf",
  "size": 2048,
  "uploadedAt": "2026-09-01T12:00:00.000Z",
  "owner": "user-id"
}
```

**Erros**

- `400 Bad Request`: arquivo ausente, campo `owner` ausente ou requisição multipart inválida.
- `500 Internal Server Error`: falha ao gravar o arquivo ou registrar os metadados.

### GET /documents

**Entrada**

- Não possui corpo nem parâmetros obrigatórios.

**Saída de sucesso**

- Status: `200 OK`.
- Corpo: lista de metadados dos documentos disponíveis; uma lista vazia é uma resposta válida.

```json
[
  {
    "id": "document-id",
    "originalName": "relatorio.pdf",
    "size": 2048,
    "uploadedAt": "2026-09-01T12:00:00.000Z",
    "owner": "user-id"
  }
]
```

**Erros**

- `500 Internal Server Error`: falha inesperada ao consultar os metadados.

### GET /documents/:id/download

**Entrada**

- Parâmetro de rota `id`: identificador obrigatório do documento.

**Saída de sucesso**

- Status: `200 OK`.
- Corpo: conteúdo binário do arquivo.
- Cabeçalho: `Content-Disposition` configurado para download usando o valor de `originalName`.

**Erros**

- `404 Not Found`: documento não cadastrado para o `id` informado ou arquivo não localizado no armazenamento local.
- `500 Internal Server Error`: falha inesperada durante a leitura do arquivo.

## 7. Decisões arquiteturais

- O backend adota uma Clean Architecture simples com dependências unidirecionais: `routes -> controllers -> services -> repositories`.
- As `routes` definem endpoints e middleware de upload e delegam as solicitações aos controllers.
- Os `controllers` validam a entrada HTTP, convertem resultados da aplicação em respostas HTTP e tratam erros de borda.
- Os `services` concentram as regras de negócio de criação, listagem e recuperação de documentos, sem depender de Express ou de detalhes de transporte.
- Os `repositories` mantêm os metadados em memória e encapsulam o acesso à referência local do arquivo armazenado.
- O `multer` com `diskStorage` é responsável pela gravação física dos arquivos em `backend/storage`; nenhum provedor externo é utilizado.
- O frontend é organizado em `components`, `pages` e `services`, consumindo os endpoints por `fetch` com o prefixo `/api`.
- A identificação do dono é fornecida pelo cliente no campo `owner`; esta etapa não inclui autenticação, sessão ou controle de acesso.

## 8. Plano de execução

1. Definir as variáveis de ambiente necessárias, incluindo porta da aplicação e caminho local de armazenamento.
2. Preparar a configuração de `multer` com `diskStorage` para gravar uploads em `backend/storage`.
3. Definir o repositório em memória responsável por criar, consultar e localizar metadados de documentos.
4. Definir os serviços de upload, listagem e recuperação para download, aplicando as regras descritas nesta especificação.
5. Definir controllers para validar as entradas e traduzir os resultados e erros dos serviços em respostas HTTP.
6. Definir as rotas `POST /upload`, `GET /documents` e `GET /documents/:id/download`, conectando-as aos respectivos controllers.
7. Definir o serviço de comunicação do frontend e as telas ou componentes necessários para upload, listagem e download.
8. Criar testes de integração do backend para os fluxos de sucesso e os erros `400`, `404` e `500` especificados.
9. Validar o fluxo completo de upload, listagem e download usando somente o armazenamento local e os metadados em memória.

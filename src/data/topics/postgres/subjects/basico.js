export default {
  id: "basico",
  name: "Conceitos Básicos",
  content: `# PostgreSQL - Conceitos Básicos

## O que é PostgreSQL?

PostgreSQL é um sistema gerenciador de banco de dados objeto-relacional (SGBDOR) avançado e de código aberto. Ele oferece recursos como transações ACID, chaves estrangeiras, triggers, views, integridade transacional e controle de concorrência multiversão.

## Características principais

- **Código aberto**: Licença PostgreSQL, similar à MIT
- **ACID Compliant**: Atomicidade, Consistência, Isolamento e Durabilidade
- **Extensível**: Suporte a tipos de dados personalizados, operadores e funções
- **Robusto**: Alta confiabilidade e integridade de dados
- **Escalável**: Funciona bem em ambientes de alta demanda

## Instalação

### Ubuntu/Debian
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib
\`\`\`

### macOS (usando Homebrew)
\`\`\`bash
brew install postgresql
\`\`\`

## Comandos básicos

### Iniciar serviço
\`\`\`bash
sudo service postgresql start
# ou
sudo systemctl start postgresql
\`\`\`

### Acessar o PostgreSQL
\`\`\`bash
sudo -u postgres psql
\`\`\`

### Criar um banco de dados
\`\`\`sql
CREATE DATABASE meu_banco;
\`\`\`

### Listar bancos de dados
\`\`\`sql
\\l
\`\`\`

### Conectar a um banco de dados
\`\`\`sql
\\c meu_banco
\`\`\`

### Criar uma tabela
\`\`\`sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Inserir dados
\`\`\`sql
INSERT INTO usuarios (nome, email) 
VALUES ('João Silva', 'joao@exemplo.com');
\`\`\`

### Consultar dados
\`\`\`sql
SELECT * FROM usuarios;
\`\`\`

## Tipos de dados comuns

- **INTEGER**: Números inteiros
- **SERIAL**: Inteiro com auto-incremento
- **VARCHAR(n)**: String de tamanho variável com limite
- **TEXT**: String de tamanho variável sem limite
- **BOOLEAN**: Valores true/false
- **DATE**: Data (sem hora)
- **TIMESTAMP**: Data e hora
- **NUMERIC(p,s)**: Números decimais com precisão
- **JSONB**: Dados JSON com indexação
`
};

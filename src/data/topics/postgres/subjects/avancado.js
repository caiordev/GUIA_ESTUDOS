export default {
  id: "avancado",
  name: "Recursos Avançados",
  content: `# PostgreSQL - Recursos Avançados

## Índices

Os índices melhoram a performance de consultas, permitindo que o PostgreSQL encontre dados sem precisar escanear a tabela inteira.

### Tipos de índices
\`\`\`sql
-- B-tree (padrão, bom para comparações =, <, >, BETWEEN, etc)
CREATE INDEX idx_usuarios_nome ON usuarios(nome);

-- Hash (bom apenas para comparações de igualdade)
CREATE INDEX idx_hash_email ON usuarios USING HASH (email);

-- GiST (Generalized Search Tree, bom para dados geométricos, texto completo)
CREATE INDEX idx_gist_localizacao ON pontos USING GIST (localizacao);

-- GIN (Generalized Inverted Index, bom para arrays e JSONB)
CREATE INDEX idx_gin_tags ON documentos USING GIN (tags);
\`\`\`

## Stored Procedures e Functions

### Criando uma função
\`\`\`sql
CREATE OR REPLACE FUNCTION calcular_idade(data_nascimento DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, data_nascimento));
END;
$$ LANGUAGE plpgsql;

-- Usando a função
SELECT nome, calcular_idade(data_nascimento) AS idade FROM usuarios;
\`\`\`

## Triggers

Triggers são procedimentos que são executados automaticamente quando ocorre um evento específico.

\`\`\`sql
-- Função para o trigger
CREATE OR REPLACE FUNCTION registrar_alteracao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
CREATE TRIGGER atualizar_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION registrar_alteracao();
\`\`\`

## Views

Views são consultas salvas que podem ser usadas como tabelas virtuais.

\`\`\`sql
CREATE VIEW usuarios_ativos AS
SELECT id, nome, email, ultimo_login
FROM usuarios
WHERE status = 'ativo';

-- Usando a view
SELECT * FROM usuarios_ativos;
\`\`\`

## Materialized Views

Views materializadas armazenam fisicamente os resultados da consulta, melhorando a performance.

\`\`\`sql
CREATE MATERIALIZED VIEW relatorio_mensal AS
SELECT 
  EXTRACT(MONTH FROM data_venda) AS mes,
  SUM(valor) AS total_vendas
FROM vendas
GROUP BY mes;

-- Atualizar a view materializada
REFRESH MATERIALIZED VIEW relatorio_mensal;
\`\`\`

## Particionamento de Tabelas

O particionamento divide tabelas grandes em partes menores para melhorar a performance.

\`\`\`sql
CREATE TABLE vendas (
  id SERIAL,
  data_venda DATE NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  produto_id INTEGER NOT NULL
) PARTITION BY RANGE (data_venda);

-- Criar partições
CREATE TABLE vendas_2023 PARTITION OF vendas
  FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
  
CREATE TABLE vendas_2024 PARTITION OF vendas
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
\`\`\`

## JSONB

PostgreSQL tem excelente suporte para JSON e JSONB (JSON binário).

\`\`\`sql
CREATE TABLE documentos (
  id SERIAL PRIMARY KEY,
  dados JSONB
);

-- Inserir dados JSON
INSERT INTO documentos (dados) VALUES ('{"nome": "João", "interesses": ["PostgreSQL", "Python"]}');

-- Consultar dados JSON
SELECT dados->'nome' AS nome FROM documentos;

-- Filtrar por valor em JSON
SELECT * FROM documentos WHERE dados @> '{"interesses": ["PostgreSQL"]}';
\`\`\`

## Extensões

PostgreSQL pode ser estendido com módulos adicionais.

\`\`\`sql
-- Instalar extensão
CREATE EXTENSION pg_stat_statements;

-- PostGIS para dados geoespaciais
CREATE EXTENSION postgis;

-- Full-text search avançado
CREATE EXTENSION pg_trgm;
\`\`\`
`
};

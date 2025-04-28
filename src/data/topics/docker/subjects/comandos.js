export default {
  id: "comandos",
  name: "Comandos Essenciais",
  content: `# Comandos Essenciais do Docker

## Gerenciamento de Imagens

\`\`\`bash
# Listar imagens
docker images

# Baixar uma imagem
docker pull nome-da-imagem:tag

# Construir uma imagem a partir de um Dockerfile
docker build -t nome-da-imagem:tag .

# Remover uma imagem
docker rmi nome-da-imagem:tag
\`\`\`

## Gerenciamento de Contêineres

\`\`\`bash
# Listar contêineres em execução
docker ps

# Listar todos os contêineres
docker ps -a

# Criar e iniciar um contêiner
docker run -d --name meu-container -p 8080:80 nome-da-imagem:tag
\`\`\``
};

export default {
  id: "conceitos",
  name: "Conceitos Básicos",
  content: `# Conceitos Básicos do Docker

## O que é Docker?

Docker é uma plataforma de código aberto que automatiza a implantação de aplicações dentro de contêineres. Virtualização a nível de sistema operacional
que permite criar, implemetar e executar aplicações em containers. Os contêineres são ambientes isolados que compartilham 
o kernel do sistema operacional do host, mas possuem seus próprios sistemas de arquivos, bibliotecas e configurações.

## Principais Conceitos

### Imagens

Imagens são templates somente leitura que contêm o sistema operacional, aplicação e suas dependências.

### Contêineres

Contêineres são instâncias em execução de uma imagem. São isolados, mas compartilham o kernel do host.

### Dockerfile

Arquivo de texto que contém instruções para construir uma imagem Docker.

### Docker Hub

Repositório público de imagens Docker.

Contaniers são mais leves que máquinas virtuais. 
Uma imagem do docker pode rodar em qualquer máquina que tenha o docker instalado.

### Executado o primeiro container

\`\`\`bash
docker run hello-world
\`\`\`
O docker tem a imagem de vários sistemas operacionais, como ubuntu, alpine, etc.

## Construindo a primeira imagem

O comando docker build constroi uma imagem do docker a partir de um Dockerfile.

O Dockerfile deve estar no diretório atual. e é necessário do jar da aplicação.
mvn clean package-> cria o jar da aplicação.

\`\`\`bash
docker build -t nome-da-imagem:tag .
\`\`\`

### Removendo uma imagem

\`\`\`bash
docker rmi nome-da-imagem:tag ou id
docker image remove nome-da-imagem:tag ou id
\`\`\`

### Listando as imagens

\`\`\`bash
docker images
\`\`\`

### Executando o container

\`\`\`bash
docker run -d --name meu-container -p 8080:80 nome-da-imagem:tag
\`\`\`

### Listando os contêineres

\`\`\`bash
docker ps ou docker container ls
\`\`\`

### Removendo o contêiner

\`\`\`bash
docker rm meu-container
\`\`\`

### Listando os contêineres

\`\`\`bash
docker ps -a
\`\`\`

### Ver os logs do container

\`\`\`bash
docker logs -f meu-container 
\`\`\`

o -f é para seguir os logs em tempo real.

### Parar o contêiner

\`\`\`bash
docker stop meu-container
\`\`\`

### Iniciar o contêiner

\`\`\`bash
docker start meu-container
\`\`\`

## Enviar a image para o Docker Hub

### Criar uma tag para a imagem
\`\`\`bash
docker tag nome-da-imagem:tag nome-do-usuario/nome-da-imagem:tag
\`\`\`

### Fazer login no Docker Hub
\`\`\`bash
docker login docker.io
\`\`\`

### Enviar a image para o Docker Hub
\`\`\`bash
docker push nome-do-usuario/nome-da-imagem:tag
\`\`\`

### Dockerfiles vs Container images vs Containers

- Dockerfile: Arquivo de texto que contém instruções para construir uma imagem Docker.
- Container image: Imagem do Docker, que contém o sistema operacional, aplicação e suas dependências.
- Container: Instância em execução de uma imagem. É um contêiner isolado que compartilha o kernel do host.

## Dockerfile

\`\`\`Dockerfile
FROM ubuntu:24.04

# Instalar o Java
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Copiar o jar da aplicação
COPY target/your-application.jar /app/your-application.jar

# Expor a porta
EXPOSE 8080

# Iniciar a aplicação
CMD ["java", "-jar", "/app/your-application.jar"]
\`\`\`

## Rodar a imagem a partir do Docker Hub

### Baixar a imagem
\`\`\`bash
docker pull nome-do-usuario/nome-da-imagem:tag
\`\`\`

### Rodar o container
\`\`\`bash
docker run -d --name meu-container -p 8080:80 nome-do-usuario/nome-da-imagem:tag
\`\`\`

## Gerenciamento de docker images

\`\`\`bash
 docker search nome-do-usuario/nome-da-imagem:tag
\`\`\`

\`\`\`bash
docker image history nome-do-usuario/nome-da-imagem:tag ou id 
docker image inspect nome-do-usuario/nome-da-imagem:tag ou id
\`\`\`

## Gerenciamento de docker containers

### Pausar o container

\`\`\`bash
docker pause meu-container
\`\`\`

### Despausar o container

\`\`\`bash
docker unpause meu-container
\`\`\`

### Parar o container

\`\`\`bash
docker stop meu-container
\`\`\`

### Iniciar o container

\`\`\`bash
docker start meu-container
\`\`\`

### Remover o container

\`\`\`bash
docker rm meu-container
\`\`\`

\`\`\`bash
docker container kill meu-container ou id
\`\`\`

`
};

export default {
  id: "configuracao",
  name: "Configuração do Docker Linux",
  content: `# Como instalar o Docker no Linux Mint

O Docker é uma ferramenta poderosa para criar, implantar e gerenciar containers em sistema Linux. Aprenda nesse guia como instalar a última versão do Docker dentro do Linux Mint.

## Tópicos abordados
- Preparando o ambiente
- Adicionando o repositório do Docker
- Instalando o Docker

## Preparando o ambiente
Abra um terminal e siga os passos:

### 01 - Atualize seu sistema
\`\`\`bash
sudo apt-get update && sudo apt-get upgrade
\`\`\`

### 02 - Instale as dependências do Docker
\`\`\`bash
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
\`\`\`

### 03 - Instale a chave do Docker
\`\`\`bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker-archive-keyring.gpg
\`\`\`

## Adicione o repositório do Docker
Aqui temos uma observação importante: a variável $UBUNTU_VERSION provavelmente estará vazia. Precisamos descobrir em qual versão do Ubuntu nosso Linux Mint é baseado.

### 04 - Execute o comando para verificar
\`\`\`bash
cat /etc/upstream-release/lsb-release
\`\`\`

Normalmente a versão do Ubuntu (DISTRIB_CODENAME) será "jammy"

### 05 - Adicione o repositório do Docker
\`\`\`bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu jammy stable"
\`\`\`

Onde está "jammy" substitua pelo valor do seu DISTRIB_CODENAME caso seja diferente

### 06 - Atualize os repositórios novamente
\`\`\`bash
sudo apt update
\`\`\`

## Instalando o Docker
### 07 - Execute o comando de instalação
\`\`\`bash
sudo apt -y install docker-ce
\`\`\`

### 08 - Adicione seu usuário ao grupo docker
\`\`\`bash
sudo usermod -aG docker $USER && newgrp docker
\`\`\`

## Verificando a instalação
### 09 - Teste com o container de exemplo
\`\`\`bash
docker run hello-world
\`\`\`

Agora com a última versão do Docker instalado em seu Linux Mint, você está pronto para começar a trabalhar com containers!`
};
export const topics = [
  {
    "id": "python",
    "name": "Python",
    "subjects": [
      { 
        "id": "basico", 
        "name": "Conceitos Básicos", 
        "content": "# Introdução ao Python\n\nPython é uma linguagem de programação interpretada, de alto nível e propósito geral.\n\n## Variáveis e Tipos\n\n- Inteiros: `x = 10`\n- Strings: `nome = \"Python\"`\n- Listas: `[1, 2, 3]`\n\n## Estruturas de Controle\n\n```python\nif condicao:\n    print(\"Verdadeiro\")\nelse:\n    print(\"Falso\")\n```",
      },
      { 
        "id": "avancado", 
        "name": "Tópicos Avançados", 
        "content": "# Python Avançado\n\n## Classes\n\n```python\nclass Pessoa:\n    def __init__(self, nome):\n        self.nome = nome\n\n    def saudacao(self):\n        return f\"Olá, {self.nome}!\"\n```",
      },
      { 
        "id": "bibliotecas", 
        "name": "Bibliotecas Essenciais", 
        "content": "# Bibliotecas Essenciais em Python\n\n## NumPy\n\nBiblioteca para computação numérica em Python.\n\n```python\nimport numpy as np\n\n# Criar um array\narr = np.array([1, 2, 3, 4, 5])\n\n# Operações vetorizadas\nprint(arr * 2)  # [2, 4, 6, 8, 10]\n```\n\n## Pandas\n\nBiblioteca para manipulação e análise de dados.\n\n```python\nimport pandas as pd\n\n# Criar um DataFrame\ndf = pd.DataFrame({\n    \"A\": [1, 2, 3],\n    \"B\": [\"a\", \"b\", \"c\"]\n})\n\n# Filtrar dados\nprint(df[df[\"A\"] > 1])\n```",
      }
    ]
  },
  {
    "id": "linux",
    "name": "Linux",
    "subjects": [
      { 
        "id": "comandos", 
        "name": "Comandos Essenciais", 
        "content": "# Comandos Essenciais do Linux\n\n## Navegação\n\n- pwd: Mostra o diretório atual\n- ls: Lista arquivos e diretórios\n  - ls -l: Formato longo\n  - ls -a: Mostra arquivos ocultos\n- cd: Muda de diretório\n  - cd ..: Volta um diretório\n  - cd ~: Vai para o diretório home\n\n## Manipulação de Arquivos\n\n- touch: Cria um arquivo vazio\n- mkdir: Cria um diretório\n- rm: Remove arquivos\n  - rm -r: Remove diretórios recursivamente\n- cp: Copia arquivos\n- mv: Move ou renomeia arquivos",
      },
      { 
        "id": "configuracoes", 
        "name": "Configurações do Sistema", 
        "content": "# Configurações do Sistema Linux\n\n## Gerenciamento de Pacotes\n\n### Debian/Ubuntu (apt)\n\n```bash\n# Atualizar lista de pacotes\nsudo apt update\n\n# Atualizar pacotes instalados\nsudo apt upgrade\n\n# Instalar um pacote\nsudo apt install nome-do-pacote\n\n# Remover um pacote\nsudo apt remove nome-do-pacote\n```\n\n### Red Hat/Fedora (dnf/yum)\n\n```bash\n# Atualizar pacotes\nsudo dnf update\n\n# Instalar um pacote\nsudo dnf install nome-do-pacote\n```",
      },
      { 
        "id": "shell", 
        "name": "Shell Scripting", 
        "content": "# Shell Scripting\n\n## Introdução\n\nShell scripting é a arte de escrever scripts para automatizar tarefas no terminal Linux.\n\n## Primeiro Script\n\n```bash\n#!/bin/bash\n\n# Meu primeiro script\necho \"Olá, mundo!\"\n```\n\nSalve como script.sh e dê permissão de execução:\n\n```bash\nchmod +x script.sh\n./script.sh\n```\n\n## Variáveis\n\n```bash\n#!/bin/bash\n\nNOME=\"Linux\"\necho \"Olá, $NOME!\"\n```",
      }
    ]
  },
  {
    "id": "docker",
    "name": "Docker",
    "subjects": [
      { 
        "id": "conceitos", 
        "name": "Conceitos Básicos", 
        "content": "# Conceitos Básicos do Docker\n\n## O que é Docker?\n\nDocker é uma plataforma de código aberto que automatiza a implantação de aplicações dentro de contêineres.\n\n## Principais Conceitos\n\n### Imagens\n\nImagens são templates somente leitura que contêm o sistema operacional, aplicação e suas dependências.\n\n### Contêineres\n\nContêineres são instâncias em execução de uma imagem. São isolados, mas compartilham o kernel do host.\n\n### Dockerfile\n\nArquivo de texto que contém instruções para construir uma imagem Docker.\n\n### Docker Hub\n\nRepositório público de imagens Docker.",
      },
      { 
        "id": "comandos", 
        "name": "Comandos Essenciais", 
        "content": "# Comandos Essenciais do Docker\n\n## Gerenciamento de Imagens\n\n```bash\n# Listar imagens\ndocker images\n\n# Baixar uma imagem\ndocker pull nome-da-imagem:tag\n\n# Construir uma imagem a partir de um Dockerfile\ndocker build -t nome-da-imagem:tag .\n\n# Remover uma imagem\ndocker rmi nome-da-imagem:tag\n```\n\n## Gerenciamento de Contêineres\n\n```bash\n# Listar contêineres em execução\ndocker ps\n\n# Listar todos os contêineres\ndocker ps -a\n\n# Criar e iniciar um contêiner\ndocker run -d --name meu-container -p 8080:80 nome-da-imagem:tag\n```",
      }
    ]
  }
];

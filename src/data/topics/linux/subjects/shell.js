export default {
  id: "shell",
  name: "Shell Scripting",
  content: `# Shell Scripting

## Introdução

Shell scripting é a arte de escrever scripts para automatizar tarefas no terminal Linux.

## Primeiro Script

\`\`\`bash
#!/bin/bash

# Meu primeiro script
echo "Olá, mundo!"
\`\`\`

Salve como script.sh e dê permissão de execução:

\`\`\`bash
chmod +x script.sh
./script.sh
\`\`\`

## Variáveis

\`\`\`bash
#!/bin/bash

NOME="Linux"
echo "Olá, $NOME!"
\`\`\``
};

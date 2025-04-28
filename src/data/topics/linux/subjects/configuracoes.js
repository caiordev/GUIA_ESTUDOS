export default {
  id: "configuracoes",
  name: "Configurações do Sistema",
  content: `# Configurações do Sistema Linux

## Gerenciamento de Pacotes

### Debian/Ubuntu (apt)

\`\`\`bash
# Atualizar lista de pacotes
sudo apt update

# Atualizar pacotes instalados
sudo apt upgrade

# Instalar um pacote
sudo apt install nome-do-pacote

# Remover um pacote
sudo apt remove nome-do-pacote
\`\`\`

### Red Hat/Fedora (dnf/yum)

\`\`\`bash
# Atualizar pacotes
sudo dnf update

# Instalar um pacote
sudo dnf install nome-do-pacote
\`\`\``
};

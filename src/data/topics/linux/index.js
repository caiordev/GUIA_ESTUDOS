import comandos from './subjects/comandos.js';
import configuracoes from './subjects/configuracoes.js';
import shell from './subjects/shell.js';

export default {
  id: "linux",
  name: "Linux",
  subjects: [
    comandos,
    configuracoes,
    shell
  ]
};

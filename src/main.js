import './assets/main.css';
import './assets/notion.css';
import './assets/topic-icons.css';

// Importar arquivo de depuração para verificar variáveis de ambiente
import './debug-env.js';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

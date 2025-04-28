import './assets/main.css';
import './assets/notion.css';
import './assets/topic-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

import { createRouter, createWebHistory } from 'vue-router';
import TopicsView from './components/TopicsView.vue';
import SubjectsView from './components/SubjectsView.vue';
import DetailsView from './components/DetailsView.vue';
import LoginPage from './components/LoginPage.vue';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  { 
    path: '/', 
    name: 'Topics', 
    component: TopicsView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/topico/:topicId', 
    name: 'Subjects', 
    component: SubjectsView, 
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/topico/:topicId/assunto/:subjectId', 
    name: 'Details', 
    component: DetailsView, 
    props: true,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guarda de navegação para verificar autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Criar uma promessa para verificar o estado de autenticação
  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  };
  
  // Usar async/await para aguardar a verificação do estado de autenticação
  const checkAuth = async () => {
    if (requiresAuth) {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Usuário não autenticado, redirecionar para login
          next('/login');
        } else {
          // Usuário autenticado, permitir acesso
          next();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        next('/login');
      }
    } else if (to.path === '/login') {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Se já está autenticado e tenta acessar login, redirecionar para home
          next('/');
        } else {
          // Não está autenticado, permitir acesso à página de login
          next();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        next();
      }
    } else {
      // Rota não requer autenticação
      next();
    }
  };
  
  // Executar a verificação
  checkAuth();
});

export default router;

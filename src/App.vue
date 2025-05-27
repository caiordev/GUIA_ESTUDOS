<template>
  <div class="notion-container">
    <!-- Verificar se está na página de login -->
    <template v-if="!isLoginPage">
    <!-- Sidebar -->
    <aside class="notion-sidebar" :class="{ 'open': isSidebarOpen, 'minimized': isSidebarMinimized && !isSidebarOpen }">
      <div class="notion-sidebar-header">
        <span v-if="!isSidebarMinimized || isSidebarOpen">Guia de Estudos</span>
        <button @click="toggleMinimizeSidebar" class="notion-sidebar-toggle" title="Minimizar menu">
          <span v-if="!isSidebarMinimized" class="toggle-icon">◀</span>
          <span v-else class="toggle-icon">▶</span>
        </button>
      </div>
      <nav class="notion-sidebar-nav">
        <router-link 
          v-for="topic in topics" 
          :key="topic.id" 
          :to="`/topico/${topic.id}`"
          class="notion-sidebar-item"
          :class="{ 'active': $route.params.topicId === topic.id }"
          :title="topic.name"
        >
          <span class="notion-sidebar-icon" :class="`icon-${topic.id}`">
            <span v-if="topic.id === 'python'" class="topic-emoji">🐍</span>
            <span v-else-if="topic.id === 'linux'" class="topic-emoji">🐧</span>
            <span v-else-if="topic.id === 'docker'" class="topic-emoji">🐳</span>
            <span v-else-if="topic.id === 'postgres'" class="topic-emoji">🐘</span>
            <span v-else-if="topic.id === 'java'" class="topic-emoji">☕</span>
            <span v-else class="topic-emoji">📖</span>
          </span>
          <span v-if="!isSidebarMinimized || isSidebarOpen" class="topic-name">{{ topic.name }}</span>
        </router-link>
      </nav>
      
      <!-- Informações do usuário e logout no final do menu lateral -->
      <div class="sidebar-footer" v-if="currentUser && (!isSidebarMinimized || isSidebarOpen)">
        <div class="user-info-sidebar">
          <div class="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="user-details-sidebar">
            <span class="user-name-sidebar">{{ userDisplayName }}</span>
            <span class="user-email-sidebar">{{ currentUser.email }}</span>
          </div>
        </div>
        <button @click="handleLogout" class="sidebar-logout-btn" title="Sair">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="notion-content" :class="{ 'sidebar-minimized': isSidebarMinimized && !isSidebarOpen }">
      <router-view />
    </main>
    </template>
    
    <!-- Se estiver na página de login, mostrar apenas o conteúdo principal -->
    <template v-else>
      <main class="login-main">
        <router-view />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { topics } from './data/index.js';
import { Bars3Icon, DocumentTextIcon } from '@heroicons/vue/24/outline';
import { onAuthChange, logout } from './firebase/auth';

const isSidebarOpen = ref(false);
const isSidebarMinimized = ref(false);
const windowWidth = ref(window.innerWidth);
const route = useRoute();
const router = useRouter();
const currentUser = ref(null);

// Check if device is mobile based on window width
const isMobile = computed(() => windowWidth.value < 768);

// Verificar se está na página de login
const isLoginPage = computed(() => route.path === '/login');

// Nome de exibição do usuário (email sem o domínio)
const userDisplayName = computed(() => {
  if (!currentUser.value) return '';
  const email = currentUser.value.email;
  return email ? email.split('@')[0] : 'Usuário';
});

// Função para fazer logout
async function handleLogout() {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

// Update window width on resize
function handleResize() {
  windowWidth.value = window.innerWidth;
  
  // If window is resized to mobile size, ensure sidebar is not minimized
  if (isMobile.value) {
    isSidebarMinimized.value = false;
  }
}

// Toggle sidebar open/close (for mobile)
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

// Toggle sidebar minimized state (for desktop)
function toggleMinimizeSidebar() {
  isSidebarMinimized.value = !isSidebarMinimized.value;
  
  // Save preference to localStorage
  localStorage.setItem('sidebarMinimized', isSidebarMinimized.value);
}

// Load saved preference on mount
onMounted(() => {
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Load saved preference from localStorage
  const savedMinimized = localStorage.getItem('sidebarMinimized');
  if (savedMinimized !== null && !isMobile.value) {
    isSidebarMinimized.value = savedMinimized === 'true';
  }
  
  // Monitorar mudanças no estado de autenticação
  const unsubscribe = onAuthChange((user) => {
    currentUser.value = user;
  });
  
  // Limpar o listener quando o componente for desmontado
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
});

onUnmounted(() => {
  // Remove resize event listener
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
@import './assets/notion.css';

.login-main {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notion-mobile-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-menu-left {
  display: flex;
  align-items: center;
}

/* Estilos para o footer do sidebar com informações do usuário */
.sidebar-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid rgba(55, 53, 47, 0.1);
}

.user-info-sidebar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(55, 53, 47, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #37352f;
}

.user-details-sidebar {
  display: flex;
  flex-direction: column;
}

.user-name-sidebar {
  font-weight: 500;
  font-size: 14px;
  color: #37352f;
}

.user-email-sidebar {
  font-size: 12px;
  color: rgba(55, 53, 47, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.sidebar-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: rgba(55, 53, 47, 0.08);
  color: #37352f;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-logout-btn:hover {
  background-color: rgba(55, 53, 47, 0.16);
}

.notion-sidebar-nav {
  flex: 1;
  overflow-y: auto;
}

.notion-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>

<template>
  <div class="notion-container">
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
    </aside>

    <!-- Mobile Menu -->
    <div class="notion-mobile-menu">
      <button @click="toggleSidebar" class="mr-3">
        <Bars3Icon class="w-6 h-6" />
      </button>
      <span class="font-medium">Guia de Estudos</span>
    </div>

    <!-- Desktop Toggle Button (visible when sidebar is minimized) -->
    <button 
      v-if="isSidebarMinimized && !isMobile" 
      @click="toggleMinimizeSidebar" 
      class="notion-sidebar-expand-button"
      title="Expandir menu"
    >
      <span class="toggle-icon">▶</span>
    </button>

    <!-- Main Content -->
    <main class="notion-content" :class="{ 'sidebar-minimized': isSidebarMinimized && !isSidebarOpen }">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { topics } from './data/index.js';
import { Bars3Icon, DocumentTextIcon } from '@heroicons/vue/24/outline';

const isSidebarOpen = ref(false);
const isSidebarMinimized = ref(false);
const windowWidth = ref(window.innerWidth);

// Check if device is mobile based on window width
const isMobile = computed(() => windowWidth.value < 768);

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
});

onUnmounted(() => {
  // Remove resize event listener
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
@import './assets/notion.css';
</style>

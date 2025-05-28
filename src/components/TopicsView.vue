<template>
  <div class="notion-page">
    <div class="notion-page-header">
      <div class="notion-page-icon">📚</div>
      <h1 class="notion-page-title">Guia de Estudos</h1>
      <p class="notion-page-description">Selecione um tópico para começar a explorar os materiais de estudo.</p>
    </div>
    
    <!-- Botão para adicionar novo tópico -->
    <div class="add-topic-container">
      <button @click="showAddForm = true" class="add-topic-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Adicionar Tópico
      </button>
    </div>
    
    <!-- Mensagem de carregamento -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando tópicos...</p>
    </div>
    
    <!-- Mensagem de erro -->
    <div v-else-if="error" class="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ error }}</p>
      <button @click="loadTopicsFromFirebase" class="retry-button">Tentar novamente</button>
    </div>
    
        <!-- Lista de tópicos -->
    <div class="notion-collection">
      <router-link 
        v-for="topic in allTopics" 
        :key="topic.id" 
        :to="`/topico/${topic.id}`"
        class="notion-collection-card"
      >
        <div class="notion-card-icon" :class="`icon-${topic.id}`">
          <span v-if="topic.emoji">{{ topic.emoji }}</span>
          <span v-else-if="topic.id === 'python'">🐍</span>
          <span v-else-if="topic.id === 'linux'">🐧</span>
          <span v-else-if="topic.id === 'docker'">🐳</span>
          <span v-else-if="topic.id === 'postgres'">🐘</span>
          <span v-else-if="topic.id === 'java'">☕</span>
          <span v-else>📘</span>
        </div>
        <div class="notion-card-content">
          <h3 class="notion-card-title">{{ topic.name }}</h3>
          <div class="notion-card-meta">
            <span class="notion-card-count">{{ (topic.subjects && topic.subjects.length) || 0 }} assuntos</span>
            <span class="notion-card-arrow">→</span>
          </div>
        </div>
      </router-link>
      
      <!-- Card para adicionar novo tópico (alternativa ao botão) -->
      <div @click="showAddForm = true" class="notion-collection-card add-card">
        <div class="notion-card-icon add-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div class="notion-card-content">
          <h3 class="notion-card-title">Adicionar Tópico</h3>
          <div class="notion-card-meta">
            <span class="notion-card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para adicionar novo tópico -->
    <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
      <div class="modal-container">
        <AddTopicForm 
          @added="handleTopicAdded" 
          @cancel="showAddForm = false" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { topics as defaultTopics } from '../data/index.js';
import AddTopicForm from './AddTopicForm.vue';
import { getTopics, addTopic } from '../firebase/topics.js';

// Estado para armazenar os tópicos
const customTopics = ref([]);
const allFirebaseTopics = ref([]);
const showAddForm = ref(false);
const loading = ref(true);
const error = ref(null);

// Carregar tópicos do Firebase
const loadTopicsFromFirebase = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Buscar tópicos do Firebase
    const fetchedTopics = await getTopics();
    console.log('Tópicos carregados do Firebase:', fetchedTopics);
    allFirebaseTopics.value = fetchedTopics;
  } catch (err) {
    console.error('Erro ao carregar tópicos do Firebase:', err);
    error.value = 'Erro ao carregar tópicos. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Carregar tópicos ao montar o componente
onMounted(async () => {
  await loadTopicsFromFirebase();
});

// Combinar tópicos padrão e do Firebase
const allTopics = computed(() => {
  // Se temos tópicos do Firebase, usamos eles
  if (allFirebaseTopics.value && allFirebaseTopics.value.length > 0) {
    return allFirebaseTopics.value;
  }
  // Caso contrário, usamos os tópicos padrão
  return defaultTopics;
});

// Função para lidar com a adição de um novo tópico
const handleTopicAdded = async (newTopic) => {
  try {
    loading.value = true;
    
    // Adicionar o tópico ao Firebase
    const addedTopic = await addTopic(newTopic);
    console.log('Tópico adicionado ao Firebase:', addedTopic);
    
    // Recarregar os tópicos do Firebase
    await loadTopicsFromFirebase();
    
    // Fechar o modal
    showAddForm.value = false;
  } catch (err) {
    console.error('Erro ao adicionar tópico ao Firebase:', err);
    error.value = 'Erro ao adicionar tópico. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.notion-collection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.notion-collection-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  height: 100%;
}

.notion-collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12);
}

.notion-card-icon {
  font-size: 40px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f7f6f3, #fbfbfa);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-python {
  background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
}

.icon-linux {
  background: linear-gradient(135deg, #fff7e6, #fff1d6);
}

.icon-docker {
  background: linear-gradient(135deg, #e6f7ff, #d6f0ff);
}

.icon-postgres {
  background: linear-gradient(135deg, #f0fff4, #e6ffec);
}

.icon-java {
  background: linear-gradient(135deg, #fff0f0, #ffe6e6);
}

.notion-card-content {
  padding: 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.notion-card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #37352f;
}

.notion-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
}

.notion-card-count {
  background-color: rgba(55, 53, 47, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.notion-card-arrow {
  font-size: 18px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.notion-collection-card:hover .notion-card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.notion-page-description {
  color: rgba(55, 53, 47, 0.7);
  font-size: 1.1rem;
  margin-top: 0.5rem;
  max-width: 700px;
  line-height: 1.5;
}

/* Estilos para o botão de adicionar tópico */
.add-topic-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.add-topic-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4a90e2, #5a6acf);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

.add-topic-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

/* Estilos para o card de adicionar tópico */
.add-card {
  cursor: pointer;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.7);
}

.add-card:hover {
  border-color: #4a90e2;
  background-color: rgba(74, 144, 226, 0.05);
}

.add-icon {
  color: #4a90e2;
  background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
}

/* Estilos para o modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-container {
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para o estado de carregamento */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(74, 144, 226, 0.2);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilos para o estado de erro */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #e74c3c;
  text-align: center;
}

.error-container svg {
  margin-bottom: 16px;
  width: 48px;
  height: 48px;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .notion-collection {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    width: 95%;
  }
}
</style>

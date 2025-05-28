<template>
  <div class="notion-page">
    <div class="notion-breadcrumb">
      <router-link to="/" class="notion-breadcrumb-link">
        <span class="notion-breadcrumb-icon">←</span>
        <span>Voltar para Tópicos</span>
      </router-link>
    </div>

    <!-- Indicador de carregamento -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando assuntos...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="error" class="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p class="error-message">{{ error }}</p>
      <button @click="loadTopicFromFirebase" class="retry-button">Tentar novamente</button>
    </div>

    <!-- Conteúdo principal -->
    <template v-else>
      <div class="notion-page-header">
        <div class="notion-page-icon" :class="`icon-${topic?.id}`">
          <span v-if="topic?.id === 'python'">🐍</span>
          <span v-else-if="topic?.id === 'linux'">🐧</span>
          <span v-else-if="topic?.id === 'docker'">🐳</span>
          <span v-else-if="topic?.id === 'postgres'">🐘</span>
          <span v-else-if="topic?.id === 'java'">☕</span>
          <span v-else>📝</span>
        </div>
        <div>
          <h1 class="notion-page-title">{{ topic?.name }}</h1>
          <p class="notion-page-description">Selecione um assunto para ver o conteúdo detalhado.</p>
        </div>
      </div>
      
      <div class="notion-section">
        <div class="notion-section-header">
          <h2 class="notion-section-title">Assuntos Disponíveis</h2>
          
          <!-- Botão para adicionar novo assunto -->
          <button @click="showAddForm = true" class="add-subject-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar Assunto
          </button>
        </div>
        
        <!-- Mensagem quando não há assuntos -->
        <div v-if="allSubjects.length === 0" class="no-subjects-message">
          <p>Este tópico ainda não possui assuntos. Adicione o primeiro!</p>
        </div>
        
        <!-- Grade de assuntos -->
        <div v-else class="notion-subjects-grid">
          <router-link 
            v-for="subject in allSubjects" 
            :key="subject.id" 
            :to="`/topico/${topicId}/assunto/${subject.id}`"
            class="notion-subject-card"
          >
            <div class="notion-subject-content">
              <h3 class="notion-subject-title">{{ subject.name }}</h3>
              <div class="notion-subject-preview">
                {{ getPreviewText(subject.content) }}
              </div>
            </div>
            <div class="notion-subject-footer">
              <span class="notion-subject-read-more">Ler mais</span>
              <span class="notion-subject-arrow">→</span>
            </div>
          </router-link>
          
          <!-- Card para adicionar novo assunto (alternativa ao botão) -->
          <div @click="showAddForm = true" class="notion-subject-card add-card">
            <div class="notion-subject-content add-content">
              <div class="add-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <h3 class="notion-subject-title">Adicionar Assunto</h3>
              <div class="notion-subject-preview">
                Clique aqui para adicionar um novo assunto a este tópico.
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Modal para adicionar novo assunto -->
    <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
      <div class="modal-container">
        <AddSubjectForm 
          @added="handleSubjectAdded" 
          @cancel="showAddForm = false" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AddSubjectForm from './AddSubjectForm.vue';
import { getTopic, addSubjectToTopic } from '../firebase/topics.js';

const route = useRoute();
const topicId = computed(() => route.params.topicId);

// Estado para o tópico, modal e carregamento
const currentTopic = ref(null);
const showAddForm = ref(false);
const loading = ref(true);
const error = ref(null);

// Função para carregar o tópico do Firebase
const loadTopicFromFirebase = async () => {
  if (!topicId.value) {
    console.error('ID do tópico não disponível na rota');
    error.value = 'ID do tópico não disponível.';
    return;
  }
  
  console.log('Tentando carregar tópico com ID:', topicId.value);
  console.log('Tipo do ID:', typeof topicId.value);
  
  try {
    loading.value = true;
    error.value = null;
    
    // Buscar o tópico do Firebase
    const fetchedTopic = await getTopic(topicId.value);
    console.log('Tópico carregado do Firebase:', fetchedTopic);
    currentTopic.value = fetchedTopic;
  } catch (err) {
    console.error(`Erro ao carregar tópico ${topicId.value}:`, err);
    error.value = `Erro ao carregar o tópico: ${err.message}. Por favor, verifique se o tópico existe e tente novamente.`;
    
    // Tentar criar o tópico se ele não existir
    if (err.message === 'Tópico não encontrado') {
      console.log('Tentando criar um tópico temporário com ID:', topicId.value);
      try {
        const newTopic = {
          id: topicId.value,
          name: `Tópico ${topicId.value}`,
          emoji: '📖',
          subjects: []
        };
        
        const { addTopic } = await import('../firebase/topics.js');
        const addedTopic = await addTopic(newTopic);
        console.log('Tópico temporário criado:', addedTopic);
        
        // Tentar carregar o tópico novamente
        const refetchedTopic = await getTopic(topicId.value);
        console.log('Tópico recarregado após criação:', refetchedTopic);
        currentTopic.value = refetchedTopic;
        error.value = null;
      } catch (createErr) {
        console.error('Erro ao criar tópico temporário:', createErr);
        error.value = `Não foi possível criar um tópico temporário: ${createErr.message}`;
      }
    }
  } finally {
    loading.value = false;
  }
};

// Carregar o tópico ao montar o componente
onMounted(async () => {
  await loadTopicFromFirebase();
});

// Observar mudanças no ID do tópico
watch(topicId, async () => {
  await loadTopicFromFirebase();
});

// Computed property para o tópico
const topic = computed(() => {
  return currentTopic.value || { name: 'Tópico não encontrado', subjects: [] };
});

// Computed property para os assuntos
const allSubjects = computed(() => {
  return topic.value?.subjects || [];
});

// Função para adicionar um novo assunto
const handleSubjectAdded = async (newSubject) => {
  try {
    loading.value = true;
    
    // Adicionar o assunto ao tópico no Firebase
    const result = await addSubjectToTopic(topicId.value, newSubject);
    console.log('Assunto adicionado ao tópico no Firebase:', result);
    
    // Atualizar o tópico local com os dados mais recentes
    await loadTopicFromFirebase();
    
    // Fechar o modal
    showAddForm.value = false;
  } catch (err) {
    console.error('Erro ao adicionar assunto ao tópico:', err);
    error.value = 'Erro ao adicionar assunto. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

function getPreviewText(content) {
  // Remove markdown formatting and get first 100 characters
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\*\*|__/g, '') // Remove bold
    .replace(/\*|_/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
    .replace(/\n+/g, ' '); // Replace newlines with spaces
  
  return plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
}
</script>

<style scoped>
.notion-breadcrumb {
  margin-bottom: 20px;
}

.notion-breadcrumb-link {
  display: inline-flex;
  align-items: center;
  color: rgba(55, 53, 47, 0.65);
  text-decoration: none;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.notion-breadcrumb-link:hover {
  background-color: rgba(55, 53, 47, 0.08);
  color: rgba(55, 53, 47, 0.9);
}

.notion-breadcrumb-icon {
  margin-right: 6px;
}

.notion-page-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
}

.notion-page-icon {
  font-size: 40px;
  margin-right: 16px;
  padding: 16px;
  background-color: #f7f6f3;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Estilos para o cabeçalho da seção com botão de adicionar */
.notion-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-subject-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4a90e2, #5a6acf);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

.add-subject-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.notion-subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.notion-subject-card {
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
  padding: 20px;
}

.notion-subject-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12);
}

.notion-subject-content {
  flex: 1;
}

.notion-subject-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #37352f;
}

.notion-subject-preview {
  font-size: 14px;
  color: rgba(55, 53, 47, 0.7);
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notion-subject-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(55, 53, 47, 0.09);
  margin-top: auto;
}

.notion-subject-read-more {
  font-size: 14px;
  font-weight: 500;
  color: #2383e2;
}

.notion-subject-arrow {
  font-size: 18px;
  color: #2383e2;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.notion-subject-card:hover .notion-subject-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Estilos para o card de adicionar assunto */
.add-card {
  cursor: pointer;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.add-card:hover {
  border-color: #4a90e2;
  background-color: rgba(74, 144, 226, 0.05);
}

/* Estilos para o indicador de carregamento */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #2383e2;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilos para mensagens de erro */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  margin: 20px 0;
}

.error-message {
  color: #e53e3e;
  margin: 16px 0;
  font-size: 16px;
  text-align: center;
}

.retry-button {
  background-color: #2383e2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #1a6fc9;
}

/* Estilo para mensagem de nenhum assunto */
.no-subjects-message {
  text-align: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
  font-size: 16px;
  margin: 20px 0;
}

.add-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.add-icon {
  color: #4a90e2;
  margin-bottom: 16px;
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

@media (max-width: 768px) {
  .notion-subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .notion-page-header {
    flex-direction: column;
  }
  
  .notion-page-icon {
    margin-bottom: 16px;
    margin-right: 0;
  }
  
  .notion-section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .modal-container {
    width: 95%;
  }
}
</style>

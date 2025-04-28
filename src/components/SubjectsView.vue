<template>
  <div class="notion-page">
    <div class="notion-breadcrumb">
      <router-link to="/" class="notion-breadcrumb-link">
        <span class="notion-breadcrumb-icon">←</span>
        <span>Voltar para Tópicos</span>
      </router-link>
    </div>

    <div class="notion-page-header">
      <div class="notion-page-icon" :class="`icon-${topic?.id}`">
        <span v-if="topic?.id === 'python'">🐍</span>
        <span v-else-if="topic?.id === 'linux'">🐧</span>
        <span v-else-if="topic?.id === 'docker'">🐳</span>
        <span v-else>📝</span>
      </div>
      <div>
        <h1 class="notion-page-title">{{ topic?.name }}</h1>
        <p class="notion-page-description">Selecione um assunto para ver o conteúdo detalhado.</p>
      </div>
    </div>
    
    <div class="notion-section">
      <h2 class="notion-section-title">Assuntos Disponíveis</h2>
      
      <div class="notion-subjects-grid">
        <router-link 
          v-for="subject in topic?.subjects || []" 
          :key="subject.id" 
          :to="`/topico/${topic.id}/assunto/${subject.id}`"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { topics } from '../data/index.js';

const route = useRoute();
const topic = computed(() => topics.find(t => t.id === route.params.topicId));

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
}
</style>

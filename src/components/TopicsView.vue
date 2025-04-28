<template>
  <div class="notion-page">
    <div class="notion-page-header">
      <div class="notion-page-icon">📚</div>
      <h1 class="notion-page-title">Guia de Estudos</h1>
      <p class="notion-page-description">Selecione um tópico para começar a explorar os materiais de estudo.</p>
    </div>
    
    <div class="notion-collection">
      <router-link 
        v-for="topic in topics" 
        :key="topic.id" 
        :to="`/topico/${topic.id}`"
        class="notion-collection-card"
      >
        <div class="notion-card-icon" :class="`icon-${topic.id}`">
          <span v-if="topic.id === 'python'">🐍</span>
          <span v-else-if="topic.id === 'linux'">🐧</span>
          <span v-else-if="topic.id === 'docker'">🐳</span>
          <span v-else>📘</span>
        </div>
        <div class="notion-card-content">
          <h3 class="notion-card-title">{{ topic.name }}</h3>
          <div class="notion-card-meta">
            <span class="notion-card-count">{{ topic.subjects.length }} assuntos</span>
            <span class="notion-card-arrow">→</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { topics } from '../data/index.js';
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

@media (max-width: 768px) {
  .notion-collection {
    grid-template-columns: 1fr;
  }
}
</style>

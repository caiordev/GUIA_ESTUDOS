<template>
  <div class="notion-page">
    <div class="notion-breadcrumb">
      <router-link :to="`/topico/${route.params.topicId}`" class="notion-breadcrumb-link">
        <span class="notion-breadcrumb-icon">←</span>
        <span>Voltar para {{ topic?.name }}</span>
      </router-link>
    </div>

    <div class="notion-page-header">
      <div class="notion-page-icon" :class="`icon-${topic?.id}`">
        <span v-if="topic?.id === 'python'">🐍</span>
        <span v-else-if="topic?.id === 'linux'">🐧</span>
        <span v-else-if="topic?.id === 'docker'">🐳</span>
        <span v-else>📓</span>
      </div>
      <div>
        <h1 class="notion-page-title">{{ subject?.name }}</h1>
        <div class="notion-page-meta">
          <span class="notion-page-topic">{{ topic?.name }}</span>
        </div>
      </div>
    </div>
    
    <div class="notion-content-wrapper">
      <div class="notion-content-renderer" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { topics } from '../data/index.js';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const route = useRoute();
const topic = computed(() => topics.find(t => t.id === route.params.topicId));
const subject = computed(() => topic.value?.subjects.find(s => s.id === route.params.subjectId));

// Configure marked with highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

// Render markdown content
const renderedContent = computed(() => {
  if (!subject.value?.content) return '';
  return marked.parse(subject.value.content);
});
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

.notion-page-meta {
  display: flex;
  margin-top: 8px;
}

.notion-page-topic {
  font-size: 14px;
  color: #2383e2;
  background-color: rgba(35, 131, 226, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.notion-content-wrapper {
  max-width: 100%;
  overflow-x: auto;
}

.notion-content-renderer {
  line-height: 1.7;
  color: #37352f;
}

.notion-content-renderer h1,
.notion-content-renderer h2,
.notion-content-renderer h3,
.notion-content-renderer h4,
.notion-content-renderer h5,
.notion-content-renderer h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.notion-content-renderer h1 {
  font-size: 1.875rem;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  padding-bottom: 0.3em;
}

.notion-content-renderer h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
  padding-bottom: 0.3em;
}

.notion-content-renderer h3 {
  font-size: 1.25rem;
}

.notion-content-renderer p {
  margin: 1em 0;
}

.notion-content-renderer ul,
.notion-content-renderer ol {
  padding-left: 1.5em;
  margin: 1em 0;
}

.notion-content-renderer li {
  margin: 0.5em 0;
}

.notion-content-renderer pre {
  background-color: #f7f6f3;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 1em 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.notion-content-renderer code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  background-color: rgba(55, 53, 47, 0.08);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.notion-content-renderer pre code {
  background-color: transparent;
  padding: 0;
}

@media (max-width: 768px) {
  .notion-page-header {
    flex-direction: column;
  }
  
  .notion-page-icon {
    margin-bottom: 16px;
    margin-right: 0;
  }
}
</style>

<style>
/* Non-scoped styles for the rendered markdown content */
.hljs {
  background: #f7f6f3 !important;
  border-radius: 4px;
}
</style>

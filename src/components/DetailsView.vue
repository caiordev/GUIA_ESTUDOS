<template>
  <div class="notion-page">
    <div class="notion-breadcrumb">
      <router-link to="/" class="breadcrumb-item">Início</router-link>
      <span class="breadcrumb-separator">/</span>
      <router-link :to="`/topico/${topicId}`" class="breadcrumb-item">{{ topic.name }}</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">{{ subject.name }}</span>
    </div>

    <div class="notion-page-header">
      <div class="notion-page-icon">
        <DocumentTextIcon class="w-8 h-8" />
      </div>
      <h1 class="notion-page-title">{{ subject.name }}</h1>
    </div>

    <div class="notion-page-content">
      <!-- Conteúdo original do guia -->
      <div v-html="renderedContent"></div>
      
      <!-- Divisor minimalista -->
      <div class="content-divider-minimal"></div>
      
      <!-- Seção de blocos personalizados -->
      <div class="user-blocks-section">
        <!-- Visualizador de blocos -->
        <CodeBlockViewer 
          :topicId="topicId" 
          :subjectId="subjectId"
          @edit="startEditing"
          @has-blocks="checkUserBlocks"
        />
        
        <!-- Botão minimalista para adicionar novo bloco -->
        <div class="add-block-container-minimal" v-if="!showBlockEditor">
          <button @click="showBlockEditor = true" class="add-icon-button">
            <span class="add-icon">+</span>
          </button>
        </div>
        
        <!-- Editor de blocos -->
        <CodeBlockEditor 
          v-if="showBlockEditor" 
          :topicId="topicId" 
          :subjectId="subjectId"
          :initialBlockType="editingBlock ? editingBlock.type : 'text'"
          :initialLanguage="editingBlock && editingBlock.language ? editingBlock.language : 'javascript'"
          :editingBlock="editingBlock"
          @saved="onBlockSaved"
          @cancel="cancelEditing"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { topics } from '../data/index.js';
import { marked } from 'marked';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import CodeBlockEditor from './CodeBlockEditor.vue';
import CodeBlockViewer from './CodeBlockViewer.vue';

export default {
  components: {
    DocumentTextIcon,
    CodeBlockEditor,
    CodeBlockViewer
  },
  setup() {
    const route = useRoute();
    const topicId = computed(() => route.params.topicId);
    const subjectId = computed(() => route.params.subjectId);
    
    const topic = computed(() => {
      return topics.find(t => t.id === topicId.value) || { name: 'Tópico não encontrado' };
    });
    
    const subject = computed(() => {
      const foundTopic = topics.find(t => t.id === topicId.value);
      if (foundTopic) {
        return foundTopic.subjects.find(s => s.id === subjectId.value) || { name: 'Assunto não encontrado', content: '' };
      }
      return { name: 'Assunto não encontrado', content: '' };
    });
    
    // Configurar o marked para usar highlight.js
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });
    
    const renderedContent = computed(() => {
      return marked(subject.value.content || '');
    });
    
    // Estado para o editor de blocos
    const showBlockEditor = ref(false);
    const editingBlock = ref(null);
    const hasUserBlocks = ref(false);
    
    // Funções para gerenciar blocos
    const onBlockSaved = (blockData) => {
      showBlockEditor.value = false;
      editingBlock.value = null;
      hasUserBlocks.value = true;
    };
    
    const cancelEditing = () => {
      showBlockEditor.value = false;
      editingBlock.value = null;
    };
    
    const startEditing = (block) => {
      editingBlock.value = block;
      showBlockEditor.value = true;
    };
    
    // Verificar se existem blocos do usuário
    const checkUserBlocks = (hasBlocks) => {
      hasUserBlocks.value = hasBlocks;
    };
    
    onMounted(() => {
      // Aplicar highlight.js aos blocos de código após a montagem
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    });
    
    return {
      topicId,
      subjectId,
      topic,
      subject,
      renderedContent,
      showBlockEditor,
      editingBlock,
      hasUserBlocks,
      onBlockSaved,
      cancelEditing,
      startEditing,
      checkUserBlocks
    };
  }
};
</script>

<style scoped>
.notion-breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb-item {
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

.add-block-container-minimal {
  margin: 0 0 20px;
  display: flex;
  justify-content: center;
}

.add-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: transparent;
  border: 1px dashed #d1d5db;
  border-radius: 50%;
  color: #aaa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-icon-button:hover {
  color: #2383e2;
  border-color: #2383e2;
  transform: scale(1.05);
}

.notion-page-meta {
  display: flex;
  margin-top: 8px;
}

.content-section.add-icon {
  font-size: 18px;
  line-height: 1;
}

.content-divider-minimal {
  margin: 30px 0 20px;
  border-top: 1px dashed #eaeaea;
  padding-top: 10px;
  opacity: 0.5;
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

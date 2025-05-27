<template>
  <div class="code-blocks-container">
    <div v-if="loading" class="loading-blocks">
      Carregando blocos...
    </div>
    
    <div v-else-if="blocks.length === 0" class="no-blocks">
      <!-- Nenhum bloco adicionado ainda - não exibimos nada -->
    </div>
    
    <div v-else class="blocks-list">
      <div v-for="block in blocks" :key="block.id" class="block-item">
        <!-- Conteúdo do bloco com design minimalista -->
        <div class="block-content">
          <!-- Bloco de código com formatação bash -->
          <pre v-if="block.type === 'code'" class="code-content language-bash">
            <code>{{ block.content }}</code>
          </pre>
          <!-- Bloco de texto com estilo minimalista -->
          <div v-else class="text-content-minimal" v-html="renderMarkdown(block.content)">
          </div>
        </div>
        
        <!-- Apenas ações minimalistas no rodapé do bloco -->
        <div class="block-actions-only">
          <button @click="editBlock(block)" class="minimal-button edit">
            <span class="action-icon">✎</span>
          </button>
          <button @click="deleteBlock(block.id)" class="minimal-button delete">
            <span class="action-icon">×</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import hljs from 'highlight.js';
import { marked } from 'marked';

export default {
  name: 'CodeBlockViewer',
  props: {
    topicId: {
      type: String,
      required: true
    },
    subjectId: {
      type: String,
      required: true
    }
  },
  emits: ['edit', 'has-blocks'],
  setup(props, { emit }) {
    const blocks = ref([]);
    const loading = ref(true);
    
    // Função para carregar os blocos do Firestore
    const loadBlocks = () => {
      const blocksCollection = collection(db, 'topics', props.topicId, 'subjects', props.subjectId, 'blocks');
      // Ordenar por data de criação, do mais antigo para o mais recente
      const blocksQuery = query(blocksCollection, orderBy('createdAt', 'asc'));
      
      // Configurar listener em tempo real
      const unsubscribe = onSnapshot(blocksQuery, (snapshot) => {
        const blocksData = [];
        snapshot.forEach((doc) => {
          blocksData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        blocks.value = blocksData;
        loading.value = false;
        
        // Emitir evento indicando se há blocos
        emit('has-blocks', blocksData.length > 0);
        
        // Aplicar highlight.js aos blocos de código após o próximo ciclo de renderização
        nextTick(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
          });
        });
      }, (error) => {
        console.error("Erro ao carregar blocos:", error);
        loading.value = false;
      });
      
      // Retornar função para cancelar a inscrição quando o componente for desmontado
      return unsubscribe;
    };
    
    // Excluir um bloco
    const deleteBlock = async (blockId) => {
      if (confirm("Tem certeza que deseja excluir este bloco?")) {
        try {
          const blockRef = doc(db, 'topics', props.topicId, 'subjects', props.subjectId, 'blocks', blockId);
          await deleteDoc(blockRef);
        } catch (error) {
          console.error("Erro ao excluir bloco:", error);
          alert("Erro ao excluir o bloco. Por favor, tente novamente.");
        }
      }
    };
    
    // Editar um bloco
    const editBlock = (block) => {
      emit('edit', block);
    };
    
    // Carregar blocos quando o componente for montado
    let unsubscribe;
    onMounted(() => {
      unsubscribe = loadBlocks();
    });
    
    // Recarregar blocos quando topicId ou subjectId mudar
    watch([() => props.topicId, () => props.subjectId], () => {
      if (unsubscribe) {
        unsubscribe();
      }
      loading.value = true;
      unsubscribe = loadBlocks();
    });
    
    // Função para renderizar markdown no texto
    const renderMarkdown = (content) => {
      // Configurar o marked para respeitar corretamente os cabeçalhos
      marked.setOptions({
        headerIds: false,
        mangle: false,
        gfm: true
      });
      return marked(content || '');
    };
    
    return {
      blocks,
      loading,
      deleteBlock,
      editBlock,
      renderMarkdown
    };
  }
};
</script>

<style>
.code-blocks-container {
  margin-bottom: 20px;
}

.loading-blocks {
  padding: 10px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.blocks-list {
  display: flex;
  flex-direction: column;
}

.block-item {
  border: none;
  border-radius: 0;
  overflow: hidden;
  background-color: transparent;
  box-shadow: none;
  margin-bottom: 8px;
  position: relative;
}

.block-actions-only {
  display: flex;
  gap: 4px;
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0;
  transition: opacity 0.2s;
}

.block-item:hover .block-actions-only {
  opacity: 1;
}

.minimal-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  opacity: 0.6;
  background-color: transparent;
}

.minimal-button:hover {
  opacity: 1;
}

.minimal-button.edit {
  color: #2383e2;
}

.minimal-button.delete {
  color: #e53935;
}

.action-icon {
  font-size: 14px;
  line-height: 1;
}


.code-content {
  margin: 0;
  padding: 6px 8px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.3;
  overflow-x: auto;
}

.text-content-minimal {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.text-content-minimal h1 {
  margin-top: 0.4em;
  margin-bottom: 0.2em;
  font-weight: 700;
  font-size: 1.5em;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.2em;
}

.text-content-minimal h2 {
  margin-top: 0.4em;
  margin-bottom: 0.3em;
  font-weight: 600;
  font-size: 1.3em;
}

.text-content-minimal h3 {
  margin-top: 0.3em;
  margin-bottom: 0.2em;
  font-weight: 600;
  font-size: 1.1em;
}

.text-content-minimal p {
  margin-bottom: 0.5em;
}

.text-content-minimal ul, .text-content-minimal ol {
  padding-left: 1.2em;
  margin-top: 0.3em;
  margin-bottom: 0.6em;
}

.text-content-minimal a {
  color: #2383e2;
  text-decoration: none;
}

.text-content-minimal a:hover {
  text-decoration: underline;
}

/* Estilo específico para código bash */
.language-bash {
  background-color: #f7f6f3;
  color: #abb2bf;
  border-left: none;
  border-radius: 7px;
  max-width: 100%;
}

.language-bash .hljs-keyword,
.language-bash .hljs-selector-tag,
.language-bash .hljs-title,
.language-bash .hljs-section,
.language-bash .hljs-doctag,
.language-bash .hljs-name,
.language-bash .hljs-strong {
  color: #e06c75;
}

.language-bash .hljs-string,
.language-bash .hljs-comment {
  color: #98c379;
}
</style>

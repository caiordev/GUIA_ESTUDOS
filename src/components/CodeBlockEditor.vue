<template>
  <div class="code-block-editor-minimal">
    <div class="editor-container-minimal">
      <textarea 
        v-model="content" 
        :class="['editor-textarea-minimal', { 'code-mode': blockType === 'code' }]"
        :placeholder="blockType === 'code' ? 'Digite seu código aqui...' : 'Digite seu texto aqui (suporta Markdown)'"
        autofocus
      ></textarea>
      
      <div class="editor-controls-minimal">
        <div class="editor-type-controls">
          <button 
            @click="blockType = 'text'" 
            :class="['type-button', { 'active': blockType === 'text' }]"
            title="Texto com Markdown"
          >T</button>
          <button 
            @click="blockType = 'code'" 
            :class="['type-button', { 'active': blockType === 'code' }]"
            title="Código"
          >&lt;/&gt;</button>
          <select 
            v-if="blockType === 'code'" 
            v-model="language" 
            class="language-selector-minimal"
            title="Linguagem de programação"
          >
            <option value="javascript">JS</option>
            <option value="python">PY</option>
            <option value="java">Java</option>
            <option value="sql">SQL</option>
            <option value="bash">Bash</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
        
        <div class="editor-action-controls">
          <button @click="saveBlock" class="action-button save" title="Salvar">✓</button>
          <button @click="$emit('cancel')" class="action-button cancel" title="Cancelar">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '../firebase/config';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'CodeBlockEditor',
  props: {
    topicId: {
      type: String,
      required: true
    },
    subjectId: {
      type: String,
      required: true
    },
    initialBlockType: {
      type: String,
      default: 'text'
    },
    initialLanguage: {
      type: String,
      default: 'javascript'
    },
    editingBlock: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    const blockType = ref(props.initialBlockType);
    const language = ref(props.initialLanguage);
    const content = ref(props.editingBlock ? props.editingBlock.content : '');
    const blockId = ref(props.editingBlock ? props.editingBlock.id : null);
    const loading = ref(false);

    const saveBlock = async () => {
      if (!content.value.trim()) {
        alert('Por favor, adicione algum conteúdo.');
        return;
      }
      
      loading.value = true;
      
      try {
        const blockData = {
          type: blockType.value,
          content: content.value,
          updatedAt: serverTimestamp()
        };
        
        // Adicionar campo language apenas para blocos de código
        if (blockType.value === 'code') {
          blockData.language = language.value;
        }
        
        if (blockId.value) {
          // Estamos editando um bloco existente
          const blockRef = doc(db, 'topics', props.topicId, 'subjects', props.subjectId, 'blocks', blockId.value);
          await updateDoc(blockRef, blockData);
        } else {
          // Estamos criando um novo bloco
          blockData.createdAt = serverTimestamp();
          const blocksCollection = collection(db, 'topics', props.topicId, 'subjects', props.subjectId, 'blocks');
          await addDoc(blocksCollection, blockData);
        }
        
        emit('saved', blockData);
      } catch (error) {
        console.error('Erro ao salvar bloco:', error);
        alert('Erro ao salvar o bloco. Por favor, tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    return {
      blockType,
      language,
      content,
      saveBlock
    };
  }
};
</script>

<style>
.code-block-editor-minimal {
  margin: 10px 0 20px;
}

.editor-container-minimal {
  position: relative;
}

.editor-textarea-minimal {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

.editor-textarea-minimal:focus {
  border-color: #2383e2;
}

.editor-textarea-minimal.code-mode {
  font-family: 'Courier New', monospace;
  background-color: #f8f8f8;
}

.editor-controls-minimal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.editor-type-controls,
.editor-action-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.type-button {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  background-color: transparent;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.type-button.active {
  background-color: #f0f7ff;
  color: #2383e2;
  border-color: #2383e2;
}

.language-selector-minimal {
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  background-color: white;
  font-size: 12px;
  outline: none;
  color: #666;
}

.action-button {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.save {
  background-color: #f0f7ff;
  color: #2383e2;
}

.action-button.save:hover {
  background-color: #e1f0ff;
}

.action-button.cancel {
  background-color: #f9f9f9;
  color: #888;
}

.action-button.cancel:hover {
  background-color: #f0f0f0;
}
</style>

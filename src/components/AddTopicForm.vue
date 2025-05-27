<template>
  <div class="add-topic-form">
    <h3 class="form-title">Adicionar Novo Tópico</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="topicId">ID do Tópico</label>
        <input 
          type="text" 
          id="topicId" 
          v-model="topicId" 
          required
          placeholder="Ex: javascript"
          class="form-input"
        />
        <small class="form-help">Use apenas letras minúsculas, sem espaços ou caracteres especiais</small>
      </div>
      
      <div class="form-group">
        <label for="topicName">Nome do Tópico</label>
        <input 
          type="text" 
          id="topicName" 
          v-model="topicName" 
          required
          placeholder="Ex: JavaScript"
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <label for="topicEmoji">Emoji do Tópico</label>
        <input 
          type="text" 
          id="topicEmoji" 
          v-model="topicEmoji" 
          required
          placeholder="Ex: 📘"
          class="form-input"
          maxlength="2"
        />
        <small class="form-help">Escolha um emoji que represente o tópico</small>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      
      <div v-if="successMessage" class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="cancel-button">Cancelar</button>
        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="!loading">Adicionar Tópico</span>
          <div v-else class="spinner"></div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const topicId = ref('');
const topicName = ref('');
const topicEmoji = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

const emit = defineEmits(['added', 'cancel']);

const validateForm = () => {
  // Verificar se o ID contém apenas letras minúsculas, números e hífens
  const idPattern = /^[a-z0-9-]+$/;
  if (!idPattern.test(topicId.value)) {
    errorMessage.value = 'O ID deve conter apenas letras minúsculas, números e hífens';
    return false;
  }
  
  return true;
};

const handleSubmit = () => {
  // Limpar mensagens anteriores
  errorMessage.value = '';
  successMessage.value = '';
  
  // Validar o formulário
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  try {
    // Criar o objeto do tópico
    const newTopic = {
      id: topicId.value,
      name: topicName.value,
      emoji: topicEmoji.value,
      subjects: []
    };
    
    // Mostrar mensagem de sucesso
    successMessage.value = `Tópico "${topicName.value}" adicionado com sucesso!`;
    
    // Limpar o formulário
    topicId.value = '';
    topicName.value = '';
    topicEmoji.value = '';
    
    // Emitir evento para o componente pai
    emit('added', newTopic);
    
    // Limpar a mensagem de sucesso após 3 segundos
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
    
  } catch (error) {
    console.error('Erro ao adicionar tópico:', error);
    errorMessage.value = `Erro ao adicionar tópico: ${error.message}`;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-topic-form {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.form-title {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: #37352f;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #37352f;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  outline: none;
}

.form-help {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  padding: 10px 16px;
  background-color: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.submit-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4a90e2, #5a6acf);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

.submit-button:disabled {
  background: linear-gradient(135deg, #a0c4f1, #b0b8e8);
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e74c3c;
  margin-bottom: 20px;
  font-size: 14px;
  padding: 12px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2ecc71;
  margin-bottom: 20px;
  font-size: 14px;
  padding: 12px;
  background-color: rgba(46, 204, 113, 0.1);
  border-radius: 4px;
  border-left: 3px solid #2ecc71;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

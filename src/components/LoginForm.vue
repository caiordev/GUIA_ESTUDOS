<template>
  <div class="login-form-container">
    <!-- Formulário de login -->
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <div class="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          placeholder="Email"
          class="form-input"
          autocomplete="email"
        />
      </div>
      
      <div class="input-group">
        <div class="input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="Senha"
          class="form-input"
          autocomplete="current-password"
        />
      </div>
      
      <div v-if="errorMessage" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      
      <button type="submit" class="login-button" :disabled="loading">
        <span v-if="!loading">Entrar</span>
        <div v-else class="spinner"></div>
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithEmailAndPassword } from '../firebase/auth';

export default {
  name: 'LoginForm',
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loading = ref(false);
    const router = useRouter();

    // Função para fazer login
    const handleLogin = async () => {
      errorMessage.value = '';
      loading.value = true;
      
      try {
        const result = await loginWithEmailAndPassword(email.value, password.value);
        
        if (!result.success) {
          // Traduzir mensagens de erro comuns do Firebase
          if (result.code === 'auth/user-not-found') {
            errorMessage.value = 'Usuário não encontrado.';
          } else if (result.code === 'auth/wrong-password') {
            errorMessage.value = 'Senha incorreta.';
          } else if (result.code === 'auth/invalid-credential') {
            errorMessage.value = 'Credenciais inválidas.';
          } else if (result.code === 'auth/too-many-requests') {
            errorMessage.value = 'Muitas tentativas. Tente novamente mais tarde.';
          } else {
            errorMessage.value = result.error;
          }
        } else {
          // Login bem-sucedido - redirecionar para a página inicial
          email.value = '';
          password.value = '';
          router.push('/');
        }
      } catch (error) {
        errorMessage.value = 'Erro ao fazer login. Tente novamente.';
        console.error('Erro ao fazer login:', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      errorMessage,
      loading,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-form-container {
  width: 100%;
}

.login-form {
  width: 100%;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a94a6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}

.form-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}

.form-input::placeholder {
  color: #8a94a6;
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
  border-radius: 8px;
  border-left: 3px solid #e74c3c;
}

.error-message svg {
  color: #e74c3c;
  flex-shrink: 0;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #4a90e2, #5a6acf);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

.login-button:disabled {
  background: linear-gradient(135deg, #a0c4f1, #b0b8e8);
  cursor: not-allowed;
}

/* Spinner para o botão de login */
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilos para o usuário logado */
.user-info {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.welcome-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #4a90e2;
}

.welcome-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.user-details {
  margin-bottom: 24px;
  background-color: rgba(74, 144, 226, 0.05);
  border-radius: 8px;
  padding: 16px;
}

.user-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 16px;
  word-break: break-all;
}

.logout-button {
  width: 100%;
  background-color: white;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-button:hover {
  background-color: #f5f5f5;
  border-color: rgba(0, 0, 0, 0.2);
}

.logout-button svg {
  color: #666;
}
</style>

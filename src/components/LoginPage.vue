<template>
  <div class="login-page">
    <div class="login-background"></div>
    <div class="login-overlay"></div>
    
    <div class="login-container">
      <div class="login-header">
        <div class="logo-container">
          <div class="logo">📚</div>
        </div>
        <h1>Guia de Estudos</h1>
        <p class="login-description">Acesse o conhecimento</p>
      </div>
      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import LoginForm from './LoginForm.vue';
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4a90e2, #7f53ac);
  z-index: -2;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23ffffff" fill-opacity="0.05" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"%3E%3C/path%3E%3C/svg%3E');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: 150% auto;
  z-index: -1;
}

.login-container {
  max-width: 450px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 40px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.logo {
  width: 70px;
  height: 70px;
  background-color: #4a90e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

h1 {
  margin-bottom: 8px;
  color: #333;
  font-size: 30px;
  font-weight: 700;
}

.login-description {
  margin-bottom: 10px;
  color: #666;
  font-size: 16px;
  font-weight: 500;
}
</style>

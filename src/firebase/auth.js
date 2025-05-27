import { auth } from './config';
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

// Função para fazer login com email e senha
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      success: true
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {
      error: error.message,
      success: false,
      code: error.code
    };
  }
};

// Função para fazer logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return {
      error: error.message,
      success: false
    };
  }
};

// Função para observar mudanças no estado de autenticação
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Função para obter o usuário atual
export const getCurrentUser = () => {
  return auth.currentUser;
};

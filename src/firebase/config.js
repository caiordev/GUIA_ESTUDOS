import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGDDe4iVXrB2rWKh9gc_ToojzGmzPnOL4", // Substitua com sua chave API
  authDomain: "guia-estudos-643c5.firebaseapp.com", // Substitua com seu domínio
  projectId: "guia-estudos-643c5", // Substitua com seu ID de projeto
  storageBucket: "guia-estudos-643c5.firebasestorage.app", // Substitua com seu bucket
  messagingSenderId: "463886830136", // Substitua com seu ID de remetente
  appId: "1:463886830136:web:f25495dbed907fb78ab4cd" // Substitua com seu ID de app
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = getFirestore(app);

// Inicializar o Auth
const auth = getAuth(app);

export { db, auth };

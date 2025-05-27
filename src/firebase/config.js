import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
// Usando valores diretos temporariamente para resolver o problema de API key inválida
const firebaseConfig = {
  apiKey: "AIzaSyBGDDe4iVXrB2rWKh9gc_ToojzGmzPnOL4",
  authDomain: "guia-estudos-643c5.firebaseapp.com",
  projectId: "guia-estudos-643c5",
  storageBucket: "guia-estudos-643c5.firebasestorage.app",
  messagingSenderId: "463886830136",
  appId: "1:463886830136:web:f25495dbed907fb78ab4cd"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = getFirestore(app);

// Inicializar o Auth
const auth = getAuth(app);

export { db, auth };

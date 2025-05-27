import { db } from './config';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Referência à coleção 'topics' no Firestore
const topicsCollection = collection(db, 'topics');

// Buscar todos os tópicos
export const getTopics = async () => {
  try {
    const snapshot = await getDocs(topicsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      subjects: doc.data().subjects || []
    }));
  } catch (error) {
    console.error('Erro ao buscar tópicos:', error);
    throw error;
  }
};

// Adicionar um novo tópico
export const addTopic = async (topic) => {
  try {
    // Garantir que o tópico tenha uma array de subjects vazia se não for fornecida
    const topicWithSubjects = {
      ...topic,
      subjects: topic.subjects || []
    };
    
    const docRef = await addDoc(topicsCollection, topicWithSubjects);
    return {
      id: docRef.id,
      ...topicWithSubjects
    };
  } catch (error) {
    console.error('Erro ao adicionar tópico:', error);
    throw error;
  }
};

// Buscar um tópico específico pelo ID
export const getTopic = async (id) => {
  try {
    const docRef = doc(db, 'topics', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        subjects: docSnap.data().subjects || []
      };
    } else {
      throw new Error('Tópico não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar tópico:', error);
    throw error;
  }
};

// Atualizar um tópico existente
export const updateTopic = async (id, topicData) => {
  try {
    const docRef = doc(db, 'topics', id);
    await updateDoc(docRef, topicData);
    return {
      id,
      ...topicData
    };
  } catch (error) {
    console.error('Erro ao atualizar tópico:', error);
    throw error;
  }
};

// Excluir um tópico
export const deleteTopic = async (id) => {
  try {
    const docRef = doc(db, 'topics', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir tópico:', error);
    throw error;
  }
};

import { db, auth } from './config';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Referência à coleção 'topics' no Firestore
const topicsCollection = collection(db, 'topics');

// Função para verificar se o usuário está autenticado
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Função para garantir que o usuário está autenticado
const ensureAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Usuário não autenticado. Faça login para continuar.');
  }
  return user;
};

// Buscar todos os tópicos
export const getTopics = async () => {
  try {
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Buscar do Firestore
    console.log('Buscando tópicos do Firestore.');
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
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Garantir que o tópico tenha uma array de subjects vazia se não for fornecida
    const topicWithSubjects = {
      ...topic,
      subjects: topic.subjects || []
    };
    
    // Verificar se o tópico já tem um ID definido
    if (topic.id) {
      // Usar o ID fornecido pelo usuário
      console.log('Salvando tópico com ID personalizado no Firestore:', topic.id);
      const docRef = doc(db, 'topics', topic.id);
      await setDoc(docRef, topicWithSubjects);
      
      return {
        id: topic.id,
        ...topicWithSubjects
      };
    } else {
      // Deixar o Firestore gerar um ID automaticamente
      console.log('Salvando tópico no Firestore com ID automático.');
      const docRef = await addDoc(topicsCollection, topicWithSubjects);
      console.log('Tópico salvo com sucesso no Firestore:', docRef.id);
      
      return {
        id: docRef.id,
        ...topicWithSubjects
      };
    }
  } catch (error) {
    console.error('Erro ao adicionar tópico:', error);
    throw error;
  }
};

// Buscar um tópico específico pelo ID
export const getTopic = async (id) => {
  try {
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Verificar se o ID é válido
    if (!id) {
      console.error('ID do tópico não fornecido');
      throw new Error('ID do tópico não fornecido');
    }
    
    // Buscar do Firestore
    console.log('Buscando tópico do Firestore:', id);
    const docRef = doc(db, 'topics', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Tópico encontrado:', docSnap.data());
      return {
        id: docSnap.id,
        ...docSnap.data(),
        subjects: docSnap.data().subjects || []
      };
    } else {
      console.error(`Tópico com ID '${id}' não encontrado no Firestore`);
      
      // Vamos listar todos os tópicos disponíveis para debug
      console.log('Tentando listar todos os tópicos disponíveis...');
      try {
        const snapshot = await getDocs(topicsCollection);
        const allTopics = [];
        snapshot.forEach(doc => {
          allTopics.push({ id: doc.id, ...doc.data() });
        });
        console.log('Tópicos disponíveis:', allTopics);
      } catch (listError) {
        console.error('Erro ao listar tópicos:', listError);
      }
      
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
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Atualizar no Firestore
    console.log('Atualizando tópico no Firestore:', id);
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

// Adicionar um assunto a um tópico
export const addSubjectToTopic = async (topicId, subject) => {
  try {
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Primeiro, buscar o tópico atual
    const topicData = await getTopic(topicId);
    
    // Verificar se o tópico já tem subjects
    const subjects = topicData.subjects || [];
    
    // Verificar se já existe um assunto com o mesmo ID
    const existingSubjectIndex = subjects.findIndex(s => s.id === subject.id);
    
    if (existingSubjectIndex !== -1) {
      // Se já existe um assunto com o mesmo ID, atualizar em vez de adicionar
      console.log('Assunto com ID já existente. Atualizando:', subject.id);
      subjects[existingSubjectIndex] = subject;
    } else {
      // Adicionar o novo assunto
      // Se não tiver ID, gerar um ID único
      if (!subject.id) {
        subject.id = `firebase_${Date.now()}`;
      }
      
      // Adicionar o assunto à lista
      subjects.push(subject);
    }
    
    // Atualizar o tópico com o array de subjects atualizado
    console.log('Atualizando tópico no Firestore com novo assunto:', subject);
    const updatedTopic = await updateTopic(topicId, { subjects });
    
    console.log('Assunto adicionado/atualizado com sucesso no Firestore:', subject);
    return {
      topicId,
      subject,
      updatedTopic
    };
  } catch (error) {
    console.error(`Erro ao adicionar assunto ao tópico ${topicId}:`, error);
    throw error;
  }
};

// Atualizar um assunto de um tópico
export const updateSubjectInTopic = async (topicId, subjectId, updatedSubject) => {
  try {
    // Verificar se o usuário está autenticado
    await getCurrentUser();
    
    // Primeiro, buscar o tópico atual
    const topicData = await getTopic(topicId);
    
    // Verificar se o tópico tem subjects
    if (!topicData.subjects || !Array.isArray(topicData.subjects)) {
      throw new Error('O tópico não possui assuntos');
    }
    
    // Encontrar o índice do assunto a ser atualizado
    const subjectIndex = topicData.subjects.findIndex(s => s.id === subjectId);
    
    if (subjectIndex === -1) {
      throw new Error('Assunto não encontrado');
    }
    
    // Criar um novo array de subjects com o assunto atualizado
    const updatedSubjects = [...topicData.subjects];
    updatedSubjects[subjectIndex] = {
      ...updatedSubjects[subjectIndex],
      ...updatedSubject
    };
    
    // Atualizar o tópico com o novo array de subjects
    const updatedTopic = await updateTopic(topicId, { subjects: updatedSubjects });
    
    return {
      topicId,
      subjectId,
      updatedTopic
    };
  } catch (error) {
    console.error(`Erro ao atualizar assunto ${subjectId} do tópico ${topicId}:`, error);
    throw error;
  }
};

// Excluir um tópico
export const deleteTopic = async (id) => {
  try {
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Excluir do Firestore
    console.log('Excluindo tópico do Firestore:', id);
    const docRef = doc(db, 'topics', id);
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir tópico:', error);
    throw error;
  }
};

// Adicionar função para remover um assunto de um tópico
export const removeSubjectFromTopic = async (topicId, subjectId) => {
  try {
    // Garantir que o usuário está autenticado
    await ensureAuthenticated();
    
    // Primeiro, buscar o tópico atual
    const topicData = await getTopic(topicId);
    
    // Verificar se o tópico tem subjects
    if (!topicData.subjects || !Array.isArray(topicData.subjects)) {
      throw new Error('O tópico não possui assuntos');
    }
    
    // Filtrar o assunto a ser removido
    const updatedSubjects = topicData.subjects.filter(s => s.id !== subjectId);
    
    // Verificar se o assunto foi encontrado
    if (updatedSubjects.length === topicData.subjects.length) {
      throw new Error('Assunto não encontrado');
    }
    
    // Atualizar o tópico com o novo array de subjects
    const updatedTopic = await updateTopic(topicId, { subjects: updatedSubjects });
    
    return {
      topicId,
      success: true,
      updatedTopic
    };
  } catch (error) {
    console.error(`Erro ao remover assunto ${subjectId} do tópico ${topicId}:`, error);
    throw error;
  }
};

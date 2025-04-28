import { createRouter, createWebHistory } from 'vue-router';
import TopicsView from './components/TopicsView.vue';
import SubjectsView from './components/SubjectsView.vue';
import DetailsView from './components/DetailsView.vue';

const routes = [
  { path: '/', name: 'Topics', component: TopicsView },
  { path: '/topico/:topicId', name: 'Subjects', component: SubjectsView, props: true },
  { path: '/topico/:topicId/assunto/:subjectId', name: 'Details', component: DetailsView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

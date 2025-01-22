import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css';
import { createPinia } from 'pinia';
import { useThemeStore } from './stores/theme';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');

// Aplicar el tema globalmente desde el store
const themeStore = useThemeStore();
if (themeStore.isDarkMode) {
  document.body.classList.add('dark');
}

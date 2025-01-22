// stores/theme.ts
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: localStorage.getItem('theme') === 'dark', // Cargar tema desde localStorage
  }),
  actions: {
    toggleTheme(isDarkMode: boolean) {
      // Actualizar el estado del tema
      this.isDarkMode = isDarkMode;

      // Cambiar el tema en el body y en localStorage
      if (this.isDarkMode) {
        document.body.classList.add('dark'); // Añadir clase 'dark' al body
        localStorage.setItem('theme', 'dark');  // Guardar tema en localStorage
      } else {
        document.body.classList.remove('dark'); // Remover clase 'dark' del body
        localStorage.setItem('theme', 'light'); // Guardar tema en localStorage
      }
    },
  },
});

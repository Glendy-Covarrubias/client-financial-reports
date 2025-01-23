import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: localStorage.getItem('theme') === 'dark', // Cargar tema desde localStorage
  }),
  actions: {
    toggleTheme(isDarkMode: boolean) {
      // Actualizar el estado del tema
      this.isDarkMode = isDarkMode;

      if (this.isDarkMode) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
  },
});

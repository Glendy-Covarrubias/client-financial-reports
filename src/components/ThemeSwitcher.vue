<template>
  <div class="flex justify-center items-center space-x-2">
    <!-- Etiqueta para el toggle -->
    <label for="themeToggle" class="text-sm text-gray-600 text-gray-200">
      {{ isDarkMode ? 'Modo Oscuro' : 'Modo Claro' }}
    </label>
    
    <!-- El Toggle Switch -->
    <div class="relative">
      <input
        type="checkbox"
        id="themeToggle"
        v-model="isDarkMode"
        class="toggle-checkbox"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

// Obtener el store de tema
const themeStore = useThemeStore();

// Propiedad computada para ver si es `isDarkMode` que refleja el estado global
const isDarkMode = computed({
  get: () => themeStore.isDarkMode,
  set: (value) => themeStore.toggleTheme(value),
});
</script>

<style scoped>
</style>

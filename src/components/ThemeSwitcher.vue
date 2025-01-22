<template>
  <div class="flex justify-center items-center space-x-2">
    <!-- Etiqueta para el toggle -->
    <label for="themeToggle" class="text-sm text-gray-600 text-gray-200">
      {{ isDarkMode ? 'Modo Claro' : 'Modo Oscuro' }}
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

// Propiedad computada para `isDarkMode` que refleja el estado global
const isDarkMode = computed({
  get: () => themeStore.isDarkMode,
  set: (value) => themeStore.toggleTheme(value),  // Pasamos el valor directamente al store
});
</script>

<style scoped>
/* Estilo del toggle switch */
.toggle-checkbox {
  width: 50px;
  height: 25px;
  border-radius: 50px;
  background-color: #ddd;
  position: relative;
  cursor: pointer;
  appearance: none;
  transition: background-color 0.3s ease;
}

/* Estilo cuando el toggle está activado (modo oscuro) */
.toggle-checkbox:checked {
  background-color: #4CAF50;
}

/* Estilo de la bolita interna del toggle */
.toggle-checkbox::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.3s ease;
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
}

/* Estilo de la bolita cuando el toggle está activado */
.toggle-checkbox:checked::before {
  transform: translateX(25px) translateY(-50%);
}
</style>

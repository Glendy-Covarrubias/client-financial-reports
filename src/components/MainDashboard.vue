<template>
    <div class="h-screen grid grid-cols-1 lg:grid-cols-[200px_1fr]">
        <!-- Sidebar -->
        <aside class="bg-gray-800 text-white p-4 lg:col-span-1">
            <ThemeSwitcher />
            <h1 class="text-2xl font-bold mb-6 mt-4">
                Dashboard

            </h1>
            <nav>
                <ul>
                    <li>
                        <button
                            class="w-full text-left py-2 px-4 mb-2 hover:bg-gray-700 rounded"
                            @click="selectedMenu = 'transactions'"
                        >
                            Gestión de transacciones
                        </button>
                    </li>
                    <li>
                        <button
                            class="w-full text-left py-2 px-4 mb-2 hover:bg-gray-700 rounded"
                            @click="selectedMenu = 'metrics'"
                        >
                            Visualización de métricas
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Header -->
            <header class="bg-gray-100 p-4 border-b border-gray-300">
                <h1 class="text-2xl font-semibold">Sistema de Reportes Financieros</h1>
            </header>

            <!-- Content -->
            <main class="flex-1 bg-gray-50 p-4 overflow-y-auto">
                <component :is="selectMenu" />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Import de los componentes
import TransactionManager from './TransactionManager.vue';
import ViewingMetrics from './ViewingMetrics.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

// Estado para almacenar el menú seleccionado
const selectedMenu = ref('transactions');

// Computed para determinar el componente actual
const selectMenu = computed(() => {
    switch (selectedMenu.value) {
        case 'transactions':
            return TransactionManager;
        case 'metrics':
            return ViewingMetrics;
        case 'default':
        default:
            return null;
    }
});
</script>

<style scoped>
</style>

<template>
    <div class="space-y-6">
        <!-- Título principal -->
        <div>
            <h6 class="text-lg font-semibold mt-0 mb-3 text-gray-800">Visualización de métricas</h6>
            <hr />
        </div>

        <!-- Cards contenedores -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div class="bg-white shadow rounded-lg p-4">
                <h2 class="text-lg font-medium text-gray-700 mb-2">Análisis por categoría</h2>
                <CategoryAnalysis />
            </div>

            <div class="bg-white shadow rounded-lg p-4">
                <h2 class="text-lg font-medium text-gray-700 mb-2">Evolución temporal</h2>
                <TypeAnalysis />
            </div>

            <div class="bg-white shadow rounded-lg p-4">
                <h2 class="text-lg font-medium text-gray-700 mb-2">Resumen por cliente</h2>
                <CustomerSummary />
            </div>

            <div class="bg-white shadow rounded-lg p-4">
                <h2 class="text-lg font-medium text-gray-700 mb-2">Estados de transacciones</h2>
                <TransactionStates />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import CategoryAnalysis from './CategoryAnalysis.vue';
    import CustomerSummary from './CustomerSummary.vue';
    import TransactionStates from './TransactionStates.vue';
    import TypeAnalysis from './TypeAnalysis.vue';
</script>
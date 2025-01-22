<template>
    <div class="p-4 bg-gray-50 rounded shadow">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Estados de Transacciones</h2>
        <div class="flex justify-between mb-4">
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Activas</span>
            </div>
            <span class="text-lg font-semibold text-gray-800">{{ activeCount }}</span>
        </div>
        <div class="flex justify-between">
            <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Desactivadas</span>
            </div>
            <span class="text-lg font-semibold text-gray-800">{{ inactiveCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useTransactionStore } from '@/stores/transactions';

    // Store de transacciones
    const store = useTransactionStore();

    // Contar transacciones activas y desactivadas
    const activeCount = computed(() =>
        store.transactions.filter((transaction) => transaction.status === 'active').length
    );

    const inactiveCount = computed(() =>
        store.transactions.filter((transaction) => transaction.status === 'inactive').length
    );
</script>

<style scoped></style>
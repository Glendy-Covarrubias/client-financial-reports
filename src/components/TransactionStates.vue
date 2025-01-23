<!--Estados de transacciones-->
<template>
    <div class="p-4 bg-gray-50 rounded shadow">
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
    import { computed, onMounted } from 'vue';
    import { useTransactionStore } from '@/stores/transactions';

    // Store de transacciones
    const store = useTransactionStore();
    const transactions = computed(() => store.transactions);

    onMounted(() => {
        store.fetchTransactions(); // Llama a la función para cargar las transacciones cuando el componente se monta
    });

    // Contar transacciones activas y desactivadas
    const activeCount = computed(() =>
        transactions.value.filter((t) => t.status === 'activa').length
    );

    const inactiveCount = computed(() =>
        store.transactions.filter((t) => t.status === 'inactiva').length
    );
</script>

<style scoped></style>
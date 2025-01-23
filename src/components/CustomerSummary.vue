<!--Resumen por cliente-->
<template>
    <div class="p-4 bg-white rounded shadow">
        <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="py-2 px-4 border-b text-left text-gray-700">Cliente</th>
                        <th class="py-2 px-4 border-b text-right text-gray-700">Ingresos Totales</th>
                        <th class="py-2 px-4 border-b text-right text-gray-700">Gastos Totales</th>
                        <th class="py-2 px-4 border-b text-right text-gray-700">Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="client in clientSummary" :key="client.name" class="hover:bg-gray-50">
                        <td class="py-2 px-4 border-b text-gray-600">{{ client.name }}</td>
                        <td class="py-2 px-4 border-b text-right text-green-600">${{ client.totalIncome.toFixed(2) }}
                        </td>
                        <td class="py-2 px-4 border-b text-right text-red-600">${{ client.totalExpenses.toFixed(2) }}
                        </td>
                        <td class="py-2 px-4 border-b text-right text-gray-600">${{ client.average.toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useTransactionStore } from '@/stores/transactions';
    import { ITransaction, IClientSummary } from '@/interfaces/ITransaction';

    // Store de transacciones
    const store = useTransactionStore();

    // Calcular el resumen por cliente
    const clientSummary = computed(() => {
        const summary: Record<number, IClientSummary> = {};

        store.transactions.forEach((transaction: ITransaction) => {
            const clientId = transaction.cliente_id;

            if (!summary[clientId]) {
                summary[clientId] = { totalIncome: 0, totalExpenses: 0, count: 0 };
            }

            if (transaction.amount > 0) {
                summary[clientId].totalIncome += transaction.amount;
            } else {
                summary[clientId].totalExpenses += Math.abs(transaction.amount);
            }

            summary[clientId].count += 1;
        });

        return Object.keys(summary).map((clientId) => {
            const data = summary[Number(clientId)];
            return {
                name: `Cliente ${clientId}`,
                totalIncome: data.totalIncome,
                totalExpenses: data.totalExpenses,
                average: (data.totalIncome + data.totalExpenses) / data.count,
            };
        });
    });
</script>


<style scoped></style>
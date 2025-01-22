<template>
    <div class="p-4 bg-gray-50 rounded shadow">
        <h2 class="text-xl font-semibold text-gray-700 mb-4 text-center">Análisis por Categoría</h2>

        <!-- Contenedor del gráfico -->
        <div class="relative aspect-square sm:aspect-video">
            <canvas ref="categoryChart" class="w-full h-full"></canvas>
        </div>

        <!-- Desglose de categorías -->
        <div class="mt-4">
            <div v-for="(value, category) in categoryData" :key="category"
                class="flex justify-between items-center text-sm md:text-base mb-2">
                <span class="text-gray-700">{{ category }}</span>
                <span class="font-semibold text-gray-900">{{ formatAmount(value) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useTransactionStore } from '@/stores/transactions';
    import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

    // Registra los componentes necesarios
    Chart.register(PieController, ArcElement, Tooltip, Legend);

    // Referencia al canvas para el gráfico
    const categoryChart = ref<HTMLCanvasElement | null>(null);

    // Store de transacciones
    const store = useTransactionStore();

    // Calculamos el desglose de ingresos y gastos por categoría
    const categoryData = computed(() => {
        const data = {
            Alimentacion: 1,
            Transporte: 2,
            Entretenimiento: 0,
            Otros: 0,
        };

        store.transactions.forEach(transaction => {
            if (transaction.category === 'Alimentación') {
                data.Alimentacion += transaction.amount;
            } else if (transaction.category === 'Transporte') {
                data.Transporte += transaction.amount;
            } else if (transaction.category === 'Entretenimiento') {
                data.Entretenimiento += transaction.amount;
            } else {
                data.Otros += transaction.amount;
            }
        });

        return data;
    });

    // Datos del gráfico (por categorías)
    const chartData = computed(() => ({
        labels: Object.keys(categoryData.value),
        datasets: [
            {
                label: 'Ingresos y Gastos por Categoría',
                data: Object.values(categoryData.value),
                backgroundColor: ['#4CAF50', '#FF5722', '#03A9F4', '#9E9E9E'],
                borderColor: ['#388E3C', '#D32F2F', '#0288D1', '#616161'],
                borderWidth: 1,
            },
        ],
    }));

    // Formateo de montos
    const formatAmount = (value: number) => `$${value.toFixed(2)}`;

    // Inicializa el gráfico
    onMounted(() => {
        if (categoryChart.value) {
            new Chart(categoryChart.value, {
                type: 'pie',
                data: chartData.value,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.raw !== undefined) {
                                        label += `$${(context.raw as number).toFixed(2)}`;
                                    }
                                    return label;
                                },
                            },
                        },
                    },
                },
            });
        }
    });
</script>

<style scoped></style>
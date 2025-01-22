<template>
    <div class="p-4 bg-white rounded shadow">
        <h2 class="text-lg font-medium text-gray-700 mb-4">Evolución Temporal</h2>
        <div class="relative">
            <canvas ref="timeChart" class="w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[400px]"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Tooltip,
        Legend,
    } from 'chart.js';

    // Registro de los componentes necesarios
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

    const timeChart = ref<HTMLCanvasElement | null>(null);

    // Ejemplo de datos (pueden ser reemplazados con props o datos de una store)
    const incomeData = [500, 700, 800, 650, 720];
    const expenseData = [400, 600, 750, 680, 700];
    const dateLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];

    // Datos del gráfico
    const chartData = computed(() => ({
        labels: dateLabels,
        datasets: [
            {
                label: 'Ingresos',
                data: incomeData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.3, // Curvatura de las líneas
            },
            {
                label: 'Gastos',
                data: expenseData,
                borderColor: '#FF5722',
                backgroundColor: 'rgba(255, 87, 34, 0.2)',
                fill: true,
                tension: 0.3,
            },
        ],
    }));

    onMounted(() => {
        if (timeChart.value) {
            new Chart(timeChart.value, {
                type: 'line',
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
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    if (context.raw !== undefined) {
                                        label += `$${(context.raw as number).toFixed(2)}`;
                                    }
                                    return label;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Mes',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Monto ($)',
                            },
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    });
</script>

<style scoped></style>

<!--Evolución temporal-->
<template>
    <div class="p-4 bg-white rounded shadow">
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
    import { useTransactionStore } from '@/stores/transactions';

    // Registro de los componentes
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

    // Store de transacciones
    const store = useTransactionStore();
    const transactions = computed(() => store.transactions);

    const dateLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const timeChart = ref<HTMLCanvasElement | null>(null);
    let incomeData: number[] = [];
    let expenseData: number[] = [];

    onMounted(() => {

        store.fetchTransactions(); // Llama a la función para cargar las transacciones cuando el componente se monta

        // Datos para la lineas de la gráfica con respecto al ingrego y gasto
        if (transactions.value.length > 0) {
            transactions.value.filter((t) => {
                if (t.type === "ingreso") {
                    incomeData.push(t.amount);
                }
            });

            transactions.value.filter((t) => {
                if (t.type === "gasto") {
                    expenseData.push(t.amount);
                }
            });
        }

        //Armar la gráfica
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

    // Datos del gráfico
    const chartData = computed(() => ({
        labels: dateLabels,
        datasets: [
            {
                label: 'Ingresos',
                data: incomeData, // Se incorporan los datos que representan la linea de ingresos
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.3, // Curvatura de las líneas
            },
            {
                label: 'Gastos',
                data: expenseData, // Se incorporan los datos que representan la linea de gastos
                borderColor: '#FF5722',
                backgroundColor: 'rgba(255, 87, 34, 0.2)',
                fill: true,
                tension: 0.3,
            },
        ],
    }));
</script>

<style scoped></style>

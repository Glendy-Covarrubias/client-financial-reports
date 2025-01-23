<!--Análisis por categoría-->
<template>
    <div class="p-4 bg-gray-50 rounded shadow">
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
    let categoryData = {};

    // Funcion para generar colores aletorios podria colocarse en otro lado del proyecto para reutilizar como un utilities
    const generateRandomColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Datos del gráfico (por categorías)
    const chartData = computed(() => {
        const colors = new Set<string>(); // Set para asegurar colores únicos

        // Generar colores únicos para backgroundColor y borderColor
        const backgroundColor: string[] = [];
        const borderColor: string[] = [];

        // Recorrer las categorías y asignar colores únicos
        Object.keys(categoryData).forEach(() => {
            let randomColor;
            // Asegurarse de que el color no se repita
            do {
                randomColor = generateRandomColor();
            } while (colors.has(randomColor));

            // Agregar el color al set y las listas
            colors.add(randomColor);
            backgroundColor.push(randomColor);
            borderColor.push(randomColor);
        });

        return {
            labels: Object.keys(categoryData),
            datasets: [
                {
                    label: 'Ingresos y Gastos por Categoría',
                    data: Object.values(categoryData),
                    backgroundColor, // Colores de fondo
                    borderColor,     // Colores de borde
                    borderWidth: 1,
                },
            ],
        };
    });

    // Formateo de montos
    const formatAmount = (value: number) => `$${value.toFixed(2)}`;

    // Inicializa el gráfico
    onMounted(() => {

        // Creación de un objeto dinamico con categorías como claves y el total de `amount` como valor
        categoryData = store.transactions.reduce((acc: { [key: string]: number }, transaction) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = 0;
            }
            acc[transaction.category] += transaction.amount;
            return acc;
        }, {});

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
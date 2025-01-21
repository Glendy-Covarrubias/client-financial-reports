<template>
    <!-- Componente que maneja el listado de transacciones y permite agregar, editar, eliminar transacciones -->
    <div class="space-y-4 mt-3">
        <!-- Formulario para agregar nueva transacción -->
        <div v-if="showForm" class="p-4 bg-gray-100 rounded shadow">
            <TransactionForm />
        </div>

        <!-- Tabla que muestra las transacciones con filtros -->
        <div v-else class="p-4 bg-gray-100 rounded shadow">
            <!-- Encabezado y botón para agregar una nueva transacción -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h3 class="text-2xl font-semibold">Lista de Transacciones</h3>
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 sm:mt-0"
                    @click="addTransaction">
                    + Agregar Transacción
                </button>
            </div>

            <!-- Filtros para buscar transacciones -->
            <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                <!-- Filtro por Cliente ID -->
                <input v-model.number="filterClientID" type="number" placeholder="Filtrar por Cliente ID..."
                    class="border border-gray-300 p-2 rounded w-full" />

                <!-- Filtro por Categoría -->
                <input v-model="filterCategory" type="text" placeholder="Buscar por Categoría..."
                    class="border border-gray-300 p-2 rounded w-full" />

                <!-- Filtro por Tipo  -->
                <select v-model="filterType" id="type"
                    class="border border-gray-300 p-2 rounded w-full" required>
                    <option value="" disabled selected>Selecciona un tipo</option>
                    <option value="ingreso">ingreso</option>
                    <option value="gasto">gasto</option>
                </select>

                <!-- Filtros por Fechas -->
                <input v-model="filterStartDate" type="date" placeholder="Fecha inicio"
                    class="border border-gray-300 p-2 rounded w-full" />
                <input v-model="filterEndDate" type="date" placeholder="Fecha fin"
                    class="border border-gray-300 p-2 rounded w-full" />

                <!-- Botón para resetear los filtros -->
                <button @click="resetFilters"
                    class="bg-gray-500 text-white py-2.5 px-5 rounded hover:bg-gray-600 text-sm w-full sm:w-auto mr-1">
                    Limpiar
                </button>

            </div>

            <!-- Tabla para mostrar las transacciones filtradas -->
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="border border-gray-300 px-4 py-2 text-left">ID</th>
                            <th class="border border-gray-300 px-4 py-2 text-left">CLIENTE ID</th>
                            <th class="border border-gray-300 px-4 py-2 text-left">MONTO</th>
                            <th class="border border-gray-300 px-4 py-2 text-center">CATEGORIA</th>
                            <th class="border border-gray-300 px-4 py-2 text-center">FECHA</th>
                            <th class="border border-gray-300 px-4 py-2 text-center">TIPO</th>
                            <th class="border border-gray-300 px-4 py-2 text-center">ESTADO</th>
                            <th class="border border-gray-300 px-4 py-2 text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Iterar sobre las transacciones filtradas -->
                        <tr v-for="transaction in filteredTransactions" :key="transaction.transaccion_id"
                            class="hover:bg-gray-100">
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.transaccion_id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.cliente_id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.amount }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.category }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.date }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.type }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.status }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-center">
                                <button class="text-blue-500 hover:underline mx-2"
                                    @click="editTransaction(transaction)">
                                    Editar
                                </button>
                                <button class="text-red-500 hover:underline mx-2"
                                    @click="deleteTransaction(transaction.transaccion_id)">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    /**
     * Componente de Lista de Transacciones
     * 
     * Este componente muestra una lista de transacciones y permite realizar varias acciones sobre ellas, como:
     * - Filtrar las transacciones por Cliente ID, Categoría, Tipo y Fecha.
     * - Agregar, editar o eliminar transacciones.
     * 
     * Si el estado `showForm` es verdadero, se muestra un formulario para agregar o editar una transacción.
     */

    import { computed, ref } from 'vue';
    import { useTransactionStore } from '@/stores/transactions';
    import TransactionForm from './TransactionForm.vue';
    import { ITransaction } from '@/interfaces/ITransaction';

    // Store de transacciones
    const store = useTransactionStore();
    const transactions = computed(() => store.transactions);
    const showForm = computed(() => store.showForm);

    // Filtros individuales usando `ref`
    const filterClientID = ref<number | null>(null);
    const filterCategory = ref('');
    const filterType = ref('');
    const filterStartDate = ref('');
    const filterEndDate = ref('');

    // Computed para filtrar las transacciones según los criterios seleccionados
    const filteredTransactions = computed(() => {
        return transactions.value.filter((transaction) => {
            const matchesClientID = filterClientID.value !== null ? transaction.cliente_id === filterClientID.value : true;
            const matchesCategory = filterCategory.value !== '' ? transaction.category.toLowerCase().includes(filterCategory.value.toLowerCase()) : true;
            const matchesType = filterType.value !== '' ? transaction.type.toLowerCase().includes(filterType.value.toLowerCase()) : true;
            const matchesStartDate = filterStartDate.value ? new Date(transaction.date) >= new Date(filterStartDate.value) : true;
            const matchesEndDate = filterEndDate.value ? new Date(transaction.date) <= new Date(filterEndDate.value) : true;
            const isActive = transaction.status !== 'inactiva'; // Excluir transacciones inactivas

            return matchesClientID && matchesCategory && matchesType && matchesStartDate && matchesEndDate && isActive;
        });
    });

    // Función para resetear filtros
    const resetFilters = () => {
        filterStartDate.value = '';
        filterEndDate.value = '';
    };

    // Funciones para manejar transacciones
    const addTransaction = () => {
        store.setSelectedTransaction(null); // Nueva transacción
        store.toggleForm();
    };

    const editTransaction = (transaction: ITransaction) => {
        store.setSelectedTransaction(transaction); // Editar transacción existente
        store.toggleForm();
    };

    const deleteTransaction = (id: number) => {
        store.deleteTransaction(id); // Eliminar transacción
    };
</script>

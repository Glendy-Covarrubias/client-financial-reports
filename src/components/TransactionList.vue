<template>
    <!-- Componente que maneja el listado de transacciones y permite agregar, editar, eliminar transacciones -->
    <div class="space-y-4 mt-3">
        <!-- Formulario para agregar nueva transacción -->
        <div v-if="showForm" class="p-4 bg-gray-100 rounded shadow">
            <TransactionForm />
        </div>

        <!-- Tabla que muestra las transacciones con filtros -->
        <div v-else class="p-4 dark:bg-gray-100 rounded shadow">
            <!-- Encabezado y botón para agregar una nueva transacción -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h3 class="text-2xl font-semibold">Lista de Transacciones</h3>
                <div class="flex space-x-4">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 sm:mt-0"
                        @click="addTransaction">
                        + Agregar Transacción
                    </button>
                    <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 sm:mt-0"
                        @click="downloadXLSX">
                        Descargar XLSX
                    </button>
                </div>
            </div>

            <!-- Filtros para buscar transacciones Nota: Por falta de tiempo este pudo ser desarrollado como componente para
             retutilizar en el filtrado de gráficas FilterData.vue -->
            <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                <!-- Filtro por Cliente ID -->
                <input v-model.number="filterClientID" type="number" placeholder="Filtrar por Cliente ID..."
                    class="border border-gray-300 p-2 rounded w-full" />

                <!-- Filtro por Categoría -->
                <input v-model="filterCategory" type="text" placeholder="Buscar por Categoría..."
                    class="border border-gray-300 p-2 rounded w-full" />

                <!-- Filtro por Tipo  -->
                <select v-model="filterType" id="type" class="border border-gray-300 p-2 rounded w-full" required>
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
                    <!-- Encabezado de la tabla con botones de ordenación -->
                    <thead class="bg-gray-200">
                        <tr>
                            <th @click="setSortConfig('transaccion_id')" class="cursor-pointer border border-gray-300 px-4 py-2 text-left">
                                TRANSACCION
                                <span v-if="sortConfig.column === 'transaccion_id'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th @click="setSortConfig('cliente_id')" class="cursor-pointer border border-gray-300 px-4 py-2 text-left">
                                CLIENTE ID
                                <span v-if="sortConfig.column === 'cliente_id'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th @click="setSortConfig('amount')" class="cursor-pointer border border-gray-300 px-4 py-2 text-left">
                                MONTO
                                <span v-if="sortConfig.column === 'amount'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th @click="setSortConfig('category')" class="cursor-pointer border border-gray-300 px-4 py-2 text-center">
                                CATEGORIA
                                <span v-if="sortConfig.column === 'category'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th @click="setSortConfig('date')" class="cursor-pointer border border-gray-300 px-4 py-2 text-center">
                                FECHA
                                <span v-if="sortConfig.column === 'date'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th @click="setSortConfig('type')" class="cursor-pointer border border-gray-300 px-4 py-2 text-center">
                                TIPO
                                <span v-if="sortConfig.column === 'type'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th @click="setSortConfig('status')" class="cursor-pointer border border-gray-300 px-4 py-2 text-center">
                                ESTADO
                                <span v-if="sortConfig.column === 'status'" class="ml-2">
                                    {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                                </span>
                                <span v-else class="ml-2 opacity-50">↑↓</span>
                            </th>
                            <th class="border border-gray-300 px-4 py-2 text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Iterar sobre las transacciones filtradas -->
                        <tr v-for="transaction in filteredTransactions" :key="transaction._id"
                            class="hover:bg-gray-100">
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.transaccion_id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.cliente_id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.amount }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.category }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.date }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.type }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ transaction.status }}</td>
                            <td class="border border-gray-300 px-4 py-2 text-center">
                                <button
                                    class="bg-blue-500 text-white font-medium text-sm px-3 py-1 rounded shadow hover:bg-blue-600 hover:shadow-md transition duration-300 ease-in-out mx-2 max-h-80"
                                    @click="editTransaction(transaction)">
                                    Editar
                                </button>
                                <input type="checkbox" id="themeToggle"
                                    v-model="transaction.status"
                                    :true-value="'activa'" :false-value="'inactiva'"
                                    class="toggle-checkbox"
                                    @change="transaction._id ? inactiveTransaction(transaction._id, transaction) : console.error('ID no válido')" />
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

    import { computed, ref, onMounted } from 'vue';
    import { useTransactionStore } from '@/stores/transactions';
    import TransactionForm from './TransactionForm.vue';
    import { ITransaction } from '@/interfaces/ITransaction';
    import * as XLSX from 'xlsx';

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

    onMounted(() => {
        store.fetchTransactions(); // Llama a la función para cargar las transacciones cuando el componente se monta
    });

   // Computed para filtrar y ordenar las transacciones
    const filteredTransactions = computed(() => {
        // Filtrar las transacciones como lo haces ahora
        const filtered = transactions.value.filter((transaction) => {
            const matchesClientID = filterClientID.value !== null ? transaction.cliente_id === filterClientID.value : true;
            const matchesCategory = filterCategory.value !== '' ? transaction.category.toLowerCase().includes(filterCategory.value.toLowerCase()) : true;
            const matchesType = filterType.value !== '' ? transaction.type.toLowerCase().includes(filterType.value.toLowerCase()) : true;
            const matchesStartDate = filterStartDate.value ? new Date(transaction.date) >= new Date(filterStartDate.value) : true;
            const matchesEndDate = filterEndDate.value ? new Date(transaction.date) <= new Date(filterEndDate.value) : true;

            return matchesClientID && matchesCategory && matchesType && matchesStartDate && matchesEndDate;
        });

        // Ordenar las transacciones
        return filtered.sort(sortTransactions);
    });

    // Función para resetear filtros
    const resetFilters = () => {
        filterClientID.value = null,
        filterCategory.value = "",
        filterType.value = "";
        filterStartDate.value = '';
        filterEndDate.value = '';

        store.fetchTransactions(); 
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

    const inactiveTransaction = (id: number, transaction: ITransaction) => {
        store.inactiveTransaction(id, transaction); // Inactivar transacción
    };

    // Función para exportar las transacciones a XLSX
    const downloadXLSX = () => {
        const data = filteredTransactions.value.map(transaction => ({
            ID: transaction.transaccion_id,
            ClienteID: transaction.cliente_id,
            Monto: transaction.amount,
            Categoria: transaction.category,
            Fecha: transaction.date,
            Tipo: transaction.type,
            Estado: transaction.status
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transacciones");

        // Descarga el archivo XLSX
        XLSX.writeFile(wb, "transacciones.xlsx");
    };

    // Estado de ordenación
    const sortConfig = ref({
        column: '',
        direction: 'asc'  // Dirección del orden'asc'
    });

    // Función para ordenar las transacciones
    const sortTransactions = (a: ITransaction, b: ITransaction) => {
        const { column, direction } = sortConfig.value;

        if (!column) return 0; // Si no hay columna seleccionada, no hacemos nada

        const aValue = a[column as keyof ITransaction];
        const bValue = b[column as keyof ITransaction];

        if (aValue === undefined || bValue === undefined) return 0;

        if (column === 'date') {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            
            // Verificamos que las fechas son válidas
            if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) return 0; // Si alguna fecha no es válida, no ordenamos

            return direction === 'asc'
                ? aDate.getTime() - bDate.getTime()
                : bDate.getTime() - aDate.getTime();
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return direction === 'asc'
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString());
    };

    // Función para cambiar el criterio de ordenación
    const setSortConfig = (column: string) => {
        if (sortConfig.value.column === column) {
            // Alternamos dirección
            sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.value.column = column;
            sortConfig.value.direction = 'asc';
        }
    };
</script>

<style scoped>
</style>

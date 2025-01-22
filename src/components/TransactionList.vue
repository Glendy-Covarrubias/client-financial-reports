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

            <!-- Filtros para buscar transacciones -->
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
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="border border-gray-300 px-4 py-2 text-left">TRANSACCION</th>
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
                                <button class="text-blue-500 hover:underline mx-2"
                                    @click="editTransaction(transaction)">
                                    Editar
                                </button>
                                <input type="checkbox" id="themeToggle" class="toggle-checkbox"
                                    @change="transaction._id ? inactiveTransaction(transaction._id) : console.error('ID no válido')" />
                                <!--Lo agrege para que pueda manejar con facilidad en mi interfaz vaciar mi tabla-->
                                <button class="text-blue-500 hover:underline mx-2"
                                    @click="transaction._id ? deleTransaction(transaction._id) : console.error('ID no válido')">
                                    Delete
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

    // Computed para filtrar las transacciones según los criterios seleccionados
    const filteredTransactions = computed(() => {
        return transactions.value.filter((transaction) => {
            const matchesClientID = filterClientID.value !== null ? transaction.cliente_id === filterClientID.value : true;
            const matchesCategory = filterCategory.value !== '' ? transaction.category.toLowerCase().includes(filterCategory.value.toLowerCase()) : true;
            const matchesType = filterType.value !== '' ? transaction.type.toLowerCase().includes(filterType.value.toLowerCase()) : true;
            const matchesStartDate = filterStartDate.value ? new Date(transaction.date) >= new Date(filterStartDate.value) : true;
            const matchesEndDate = filterEndDate.value ? new Date(transaction.date) <= new Date(filterEndDate.value) : true;
            //const isActive = transaction.status !== 'inactiva'; // Excluir transacciones inactivas isActive

            return matchesClientID && matchesCategory && matchesType && matchesStartDate && matchesEndDate;
        });
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

    const inactiveTransaction = (id: number) => {
        store.inactiveTransaction(id); // Inactivar transacción
    };

    const deleTransaction = (id: number) => {
        store.deleteTransaction(id); // Eliminar transacción
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
</script>

<style scoped>
    /* Estilo del toggle switch */
    .toggle-checkbox {
        width: 50px;
        height: 25px;
        border-radius: 50px;

        background-color: #4CAF50;
        position: relative;
        cursor: pointer;
        appearance: none;
        transition: background-color 0.3s ease;
    }

    /* Estilo cuando el toggle está activado (modo oscuro) */
    .toggle-checkbox:checked {
        background-color: #ddd;
    }

    /* Estilo de la bolita interna del toggle */
    .toggle-checkbox::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: white;
        transition: transform 0.3s ease;
        top: 50%;
        left: 4px;
        transform: translateY(-50%);
    }

    /* Estilo de la bolita cuando el toggle está activado */
    .toggle-checkbox:checked::before {
        transform: translateX(25px) translateY(-50%);
    }
</style>

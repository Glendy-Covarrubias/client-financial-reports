<template>
    <div class="p-4 bg-gray-50 rounded shadow">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
            {{ isEditing ? 'Editar Transacción' : 'Nueva Transacción' }}
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
            <div>
                <input v-model="cliente_id" type="hidden" id="cliente_id"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    placeholder="Ejemplo: Cliente ID" required />
            </div>
            <div>
                <label for="type" class="block text-sm font-medium text-gray-600">Tipo</label>
                <select v-model="type" id="type"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500" required>
                    <option value="" disabled selected>Selecciona un tipo</option>
                    <option value="ingreso">ingreso</option>
                    <option value="gasto">gasto</option>
                </select>
            </div>
            <div>
                <label for="amount" class="block text-sm font-medium text-gray-600">Monto</label>
                <input v-model.number="amount" type="number" id="amount"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    placeholder="Ejemplo: 100.50" required />
            </div>
            <div>
                <label for="category" class="block text-sm font-medium text-gray-600">Categoría</label>
                <input v-model="category" type="text" id="category"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    placeholder="Ejemplo: Compras" required />
            </div>
            <div>
                <label for="date" class="block text-sm font-medium text-gray-600">Fecha</label>
                <input v-model="date" type="date" id="date"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div class="flex justify-end space-x-4">
                <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    Guardar
                </button>
                <button type="button" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                    @click="closeForm">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactions';
import { ITransaction } from '@/interfaces/ITransaction';

// Store de transacciones
const store = useTransactionStore();

// Propiedades reactivas para el formulario
const cliente_id = ref<number>(0);
const type = ref<string>('');
const amount = ref<number>(0);
const category = ref<string>('');
const date = ref<string>('');

// Resetear el formulario
const resetForm = () => {
    cliente_id.value = 0;
    type.value = '';
    amount.value = 0;
    category.value = '';
    date.value = '';
};

// Computed para determinar si se está editando
const selectedTransaction = computed<ITransaction | null>(() => store.selectedTransaction);
const isEditing = computed(() => !!selectedTransaction.value);

// Precargar datos de la transacción seleccionada
watch(
    selectedTransaction,
    (transaction) => {
        if (transaction) {
            cliente_id.value = transaction.cliente_id;
            type.value = transaction.type;
            amount.value = transaction.amount;
            category.value = transaction.category;
            date.value = transaction.date;
        } else {
            resetForm();
        }
    },
    { immediate: true }
);

// Enviar el formulario
const submitForm = () => {
    if (!amount.value || !date.value) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const transaction: ITransaction = {
        transaccion_id: selectedTransaction.value?.transaccion_id ?? Date.now(),
        cliente_id: cliente_id.value,
        type: type.value.trim(),
        amount: amount.value,
        category: category.value,
        date: date.value,
        status: 'activa'
    };

    if (isEditing.value) {
        store.updateTransaction(transaction); // Actualizar transacción
    } else {
        store.addTransaction(transaction); // Agregar nueva transacción
    }

    closeForm();
};

// Cerrar el formulario
const closeForm = () => {
    store.toggleForm(); // Cerrar formulario
    store.clearSelectedTransaction(); // Limpiar transacción seleccionada
    resetForm(); // Resetear formulario
};
</script>

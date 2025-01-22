<template>
    <div class="p-4 bg-gray-50 rounded shadow">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
            {{ isEditing ? 'Editar Transacción' : 'Nueva Transacción' }}
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Campo: Tipo -->
            <div>
                <label for="type" class="block text-sm font-medium text-gray-600">Tipo</label>
                <select v-model="type" id="type"
                    @blur="touched.type = true"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.type && touched.type }" required>
                    <option value="" disabled selected>Selecciona un tipo</option>
                    <option value="ingreso">ingreso</option>
                    <option value="gasto">gasto</option>
                </select>
                <p v-if="errors.type && touched.type" class="text-sm text-red-500">{{ errors.type }}</p>
            </div>

            <!-- Campo: Monto -->
            <div>
                <label for="amount" class="block text-sm font-medium text-gray-600">Monto</label>
                <input v-model.number="amount" type="number" id="amount"
                    @blur="touched.amount = true"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.amount && touched.amount }" placeholder="Ejemplo: 100.50" required />
                <p v-if="errors.amount && touched.amount" class="text-sm text-red-500">{{ errors.amount }}</p>
            </div>

            <!-- Campo: Categoría -->
            <div>
                <label for="category" class="block text-sm font-medium text-gray-600">Categoría</label>
                <input v-model="category" type="text" id="category"
                    @blur="touched.category = true"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.category && touched.category }" placeholder="Ejemplo: Compras" required />
                <p v-if="errors.category && touched.category" class="text-sm text-red-500">{{ errors.category }}</p>
            </div>

            <!-- Campo: Fecha -->
            <div>
                <label for="date" class="block text-sm font-medium text-gray-600">Fecha</label>
                <input v-model="date" type="date" id="date"
                    @blur="touched.date = true"
                    class="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errors.date && touched.date }" required />
                <p v-if="errors.date && touched.date" class="text-sm text-red-500">{{ errors.date }}</p>
            </div>

            <div class="flex justify-end space-x-4">
                <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    :disabled="isFormInvalid">
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
    const amount = ref<number | string>('');  // Cambiado a string vacío
    const category = ref<string>('');
    const date = ref<string>('');

    // Mensajes de error
    const errors = ref({
        type: '',
        amount: '',
        category: '',
        date: '',
    });

    // Bandera de campos tocados
    const touched = ref({
        type: false,
        amount: false,
        category: false,
        date: false
    });

    // Resetear el formulario
    const resetForm = () => {
        cliente_id.value = 0;
        type.value = '';
        amount.value = '';  // Restablecer como string vacío
        category.value = '';
        date.value = '';
        touched.value = { type: false, amount: false, category: false, date: false }; // Resetear las banderas
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

    // Validar el formulario
    const validateForm = () => {
        errors.value.type = type.value ? '' : 'El tipo es obligatorio.';
        errors.value.amount = (amount.value !== '' && !isNaN(Number(amount.value))) ? '' : 'El monto es obligatorio y debe ser un número válido.';
        errors.value.category = category.value ? '' : 'La categoría es obligatoria.';
        errors.value.date = date.value ? '' : 'La fecha es obligatoria.';
    };

    // Computed property para verificar si el formulario es inválido
    const isFormInvalid = computed(() => {
        validateForm();
        return Object.values(errors.value).some(e => e !== '');
    });

    // Enviar el formulario
    const submitForm = () => {
        if (isFormInvalid.value) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        const transaction: ITransaction = {
            transaccion_id: selectedTransaction.value?.transaccion_id ?? Date.now(),
            cliente_id: 1,
            type: type.value.trim(),
            amount: Number(amount.value), // Asegurarse de que sea un número
            category: category.value,
            date: date.value,
            status: 'activa'
        };

        if (isEditing.value) {
            store.updateTransaction(transaction, selectedTransaction.value?._id); // Actualizar transacción
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

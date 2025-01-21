<template>
    <!-- Componente principal del Gestor de Transacciones -->
    <!-- Este componente sirve como contenedor para la lista de transacciones y contiene el encabezado y la estructura principal. -->
    <div>
        <h6 class="text-lg font-semibold mt-0 mb-3">Gestor de Transacciones</h6>
        <hr />
        <!-- Lista de transacciones (es una instancia del componente TransactionList) -->
        <TransactionList />
    </div>
</template>

<script setup lang="ts">
    /**
    * Componente: Gestor de Transacciones
    * 
    * Este componente sirve como contenedor principal para el listado de transacciones. 
    * Incluye las acciones para la Creación, Edición, Eliminación del listado de transacciones. 
    * `TransactionList`, que es responsable de mostrar la lista de transacciones.
    * 
    * Este componente es la vista principal para gestionar las transacciones en el sistema.
    */
    import TransactionList from './TransactionList.vue';
</script>
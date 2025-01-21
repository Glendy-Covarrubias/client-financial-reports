import { defineStore } from 'pinia';
import { ITransaction } from '@/interfaces/ITransaction';

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [] as ITransaction[],
        showForm: false, // Estado global para controlar el formulario
        selectedTransaction: null as ITransaction | null
    }),

    actions: {
        async fetchTransactions() {
            // Aquí puedes simular una llamada API para obtener las transacciones
            const data: ITransaction[] = [];
            this.transactions = data;
        },

        addTransaction(transaction: ITransaction) {
            
            
            this.transactions.push(transaction);
            console.log("Transacciones actuales:", this.transactions);  // Verifica que el estado de las transacciones se actualiza
        },        

        updateTransaction(updatedTransaction: ITransaction) {
            console.log("GUARDAR :", updatedTransaction)
            const index = this.transactions.findIndex(t => t.transaccion_id === updatedTransaction.transaccion_id);
            if (index !== -1) {
                // Actualiza la transacción en el índice encontrado
                this.transactions[index] = updatedTransaction;
            }
        },

        deleteTransaction(id: number) {
            //this.transactions = this.transactions.filter(t => t.transaccion_id !== id); Elminación definitivamente
            const index = this.transactions.findIndex(t => t.transaccion_id === id);
            if (index !== -1) {
                // Actualiza la transacción en el índice encontrado
                this.transactions[index].status = "inactiva";
            }
        },
        toggleForm() {
            this.showForm = !this.showForm;
        },
        setSelectedTransaction(transaction: ITransaction | null) {
            this.selectedTransaction = transaction;
        },
        clearSelectedTransaction() {
            this.selectedTransaction = null;
        },
    },
});

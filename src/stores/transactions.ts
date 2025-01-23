import { defineStore } from 'pinia';
import { ITransaction } from '@/interfaces/ITransaction';
import axios from 'axios';

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [] as ITransaction[],
        showForm: false, // Estado global para controlar el formulario
        selectedTransaction: null as ITransaction | null
    }),

    actions: {
        async fetchTransactions() {
            try {
                const response = await axios.get(process.env.VUE_APP_URL_API);
                this.transactions = response.data; // Asigna los datos obtenidos al estado de las transacciones
                return response.data;
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }
        },

        async addTransaction(transaction: ITransaction) {
            try {
                const response = await axios.post(process.env.VUE_APP_URL_API, transaction);
                await this.fetchTransactions(); // Hacemos la recarga para los nuevos datos ingresados
                return response;
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }
        },

        async updateTransaction(updatedTransaction: ITransaction, _id?: number) {
            try {
                const response = await axios.put(`${process.env.VUE_APP_URL_API}/${_id}`, updatedTransaction);
                await this.fetchTransactions();
                return response;
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }
        },

        async deleteTransaction(id: number) {
            try {
                const response = await axios.delete(`${process.env.VUE_APP_URL_API}/${id}`);
                await this.fetchTransactions();
                return response;
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }
        },

        async inactiveTransaction(id: number) {

            try {
                const data = await this.fetchTransactions();
                const search_info = data.find((t: ITransaction) => t._id === id);

                if (search_info !== null || search_info !== undefined) {
                    // Actualiza la transacción en el índice encontrado
                    search_info.status = search_info.status === "inactiva" ? "activa" : "inactiva";
                    delete search_info._id;
                    const response = await axios.put(`${process.env.VUE_APP_URL_API}/${id}`, search_info);
                    await this.fetchTransactions();
                    return response;
                }
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
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

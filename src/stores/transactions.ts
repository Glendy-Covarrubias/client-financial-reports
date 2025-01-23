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

        /**Funcionalidades para la integración de llamadas a las APIS */
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

        async inactiveTransaction(id: number, updatedTransaction: ITransaction) {
            try {
                if (updatedTransaction !== null || updatedTransaction !== undefined) {
                    delete updatedTransaction._id;
                    const response = await axios.put(`${process.env.VUE_APP_URL_API}/${id}`, updatedTransaction);
                    await this.fetchTransactions();
                    return response;
                }
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }
        },

        /**Funcionalidades auxiliares por interracción en la pantalla */
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

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
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }
        },        

        async updateTransaction(updatedTransaction: ITransaction) {
            try {
                
                console.log("URL :", updatedTransaction._id)
                const response = await axios.put(`${process.env.VUE_APP_URL_API}/${updatedTransaction._id}`, updatedTransaction);
                console.log("res :", response)
                await this.fetchTransactions(); 
            } catch (error) {
                console.error('Error al obtener las transacciones:', error);
            }  
        },

        async deleteTransaction(id: number) {
                try {
                    const response = await axios.delete(`${process.env.VUE_APP_URL_API}/${id}`);
                    await this.fetchTransactions(); 
                } catch (error) {
                    console.error('Error al obtener las transacciones:', error);
                }  
        },
        async inactiveTransaction(id: number) {

                try {

                    
                    const data = await this.fetchTransactions();
                    /*const search = data.find((t: ITransaction) => t._id === id);
                    if(search !== null || search !== undefined){
                        // Actualiza la transacción en el índice encontrado
                        search.status = search.status === "inactiva" ? "activa" : "inactiva";

                        const response = await axios.put(`${process.env.VUE_APP_URL_API}/${search._id}`, search);
                        await this.fetchTransactions(); 
                    }*/





                    
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

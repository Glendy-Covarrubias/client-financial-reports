export interface ITransaction {
    transaccion_id: number;
    cliente_id: number;
    amount: number;
    category: string;
    date: string;
    type: string;
    status: string;
}
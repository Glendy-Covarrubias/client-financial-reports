export interface ITransaction {
    _id?: number,
    transaccion_id: number;
    cliente_id: number;
    amount: number;
    category: string;
    date: string;
    type: string;
    status: string;
}
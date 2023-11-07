export interface AdminApiErrorResponse{
    data: string;
    statusCode: number;
    message: string;
    succeeded: boolean;
}

export type Product = {
    image: string;
    name: string;
    category: string;
    price: number;
    sold: number;
    profit: number;
};
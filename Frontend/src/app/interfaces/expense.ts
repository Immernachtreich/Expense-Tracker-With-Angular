import { UserDetails } from "./credentials"

export interface Expense {
    _id?: string
    expenseAmount: number,
    description: string,
    category: string
}

export interface ExpenseResponse {
    expenseAmount: number,
    description: string,
    category: string,
    createdAt?: Date,
    userId?: UserDetails,
    _id: string
}
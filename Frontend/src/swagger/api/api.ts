export * from './expenses.service';
import { ExpensesService } from './expenses.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [ExpensesService, UsersService];

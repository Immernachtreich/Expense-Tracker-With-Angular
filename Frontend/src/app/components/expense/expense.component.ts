
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ExpenseServiceService } from 'src/app/services/expense-service.service';
import { Expense, ExpenseResponse } from 'src/app/interfaces/expense';
import { ExpenseDetails, ExpensesService } from 'src/swagger';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  displayPopup: boolean = false;
  popupHeading?: string;
  popupText?: string;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  editingOptions = {
    isEditing: false,
    id: ''
  }

  private token!: string;

  expenses: ExpenseDetails[] = [];

  form: FormGroup = new FormGroup({
    amount: new FormControl(),
    description: new FormControl(),
    category: new FormControl()
  });

  constructor(private router: Router, private expenseService: ExpensesService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') as string;
    this.getExpenses();
  }

  getExpenses(): void {

    this.expenseService.getExpenses(this.token, 1).subscribe((response) => {

      if(!response.expenses) 
        return;

      this.expenses = response.expenses;
    });
  }

  addExpense(e: Event): void {
    e.preventDefault();

    if (this.form.invalid) {
      this.showPopup('Error', 'Enter Valid Details');
      return;
    }

    const expense: ExpenseDetails = {
      expenseAmount: this.form.value.amount,
      description: this.form.value.description,
      category: this.form.value.category
    }

    if(this.editingOptions.isEditing) {
      expense._id = this.editingOptions.id;

      this.editingOptions = {
        isEditing: false,
        id: ''
      }

      this.addEditedExpense(expense);
      return;
    }

    this.expenseService.addExpense(expense, this.token).subscribe((response) => {

      const newExpense: ExpenseResponse = {
        expenseAmount: response.expenseAmount!,
        description: response.description!,
        category: response.category!,
        _id: response._id!
      }

      this.expenses.push(newExpense);
    });
  }

  deleteExpense(id: string | undefined): void {

    this.expenseService.deleteExpense(this.token, id).subscribe(() => {
      this.expenses = this.expenses.filter(e => e._id !== id);
    });
  }

  editExpense(expense: ExpenseDetails): void {
    this.form = new FormGroup({
      amount: new FormControl(expense.expenseAmount),
      description: new FormControl(expense.description),
      category: new FormControl(expense.category)
    });

    this.editingOptions = {
      isEditing: true,
      id: expense._id ? expense._id : ''
    }
  }

  addEditedExpense(expense: ExpenseDetails): void {
    this.expenseService.editExpense(expense, expense._id,).subscribe(() => {
      this.getExpenses();
    })
  }

  trackByExpenseId(index: number, expense: ExpenseDetails): string | undefined {
    return expense._id;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  closePopup(): void {
    this.displayPopup = false;
  }

  showPopup(heading: string, text: string) {
    this.popupHeading = heading;
    this.popupText = text;

    this.displayPopup = true;
  }
}

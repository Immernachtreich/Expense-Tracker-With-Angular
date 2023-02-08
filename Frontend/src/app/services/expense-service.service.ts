import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Expense } from '../interfaces/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseServiceService {

  // URL
  private URL = 'http://localhost:5005/expenses';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: localStorage.getItem('token') as string
    })
  }

  constructor(private http: HttpClient) { }

  addExpense(expense: Expense): Observable<any> {
    const url = this.URL + '/add-expense';
    return this.http.post(url, expense, this.httpOptions).pipe(
      catchError(this.handleError('Adding Expense Failed'))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  getExpenses(page: number = 1): Observable<any> {
    const url = this.URL + '/get-expenses/?page=' + page;

    return this.http.get(url, this.httpOptions).pipe(
      catchError(this.handleError('Getting Expenses Failed'))
    );
  }

  deleteExpense(id: string | undefined): Observable<any> {
    const url = this.URL + '/delete-expense/' + id;

    return this.http.delete(url, this.httpOptions).pipe(
      catchError(this.handleError('Deletion Failed'))
    );
  }

  editExpense(expense: Expense): Observable<any> {
    console.log(expense);
    const url = this.URL + '/edit-expense/' + expense._id;

    return this.http.put(url, expense,this.httpOptions).pipe(
      catchError(this.handleError('Editing Failed'))
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private handleError<T>(message: string = 'Failed', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send error to remote logging infrastructure
      console.error(error);
      console.log(message);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CanActivateHomeGuardGuard } from './guards/can-activate-home-guard.guard';
import { CanDeactivateFormGuardsGuard } from './guards/can-deactivate-form-guards.guard';

const routes: Routes = [
  { 
    path: 'expenses', 
    loadComponent: () => import('./components/expense/expense.component').then(m => m.ExpenseComponent),
    canActivate: [CanActivateHomeGuardGuard]
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent),
    canDeactivate: [CanDeactivateFormGuardsGuard] 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canDeactivate: [CanDeactivateFormGuardsGuard] 
  },
  { path: '', redirectTo: '/expenses', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateFormGuardsGuard, CanActivateHomeGuardGuard]
})
export class AppRoutingModule { }

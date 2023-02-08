import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/swagger';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    displayPopup: boolean = false;
    popupHeading?: string;
    popupText?: string;

    form: FormGroup = new FormGroup({
        email: new FormControl('', emailValidator),
        password: new FormControl('', passwordValidator)
    })

    constructor(private authenticationService: AuthenticationService, private router: Router, private authService: UsersService) { }

    login(e: Event): void {
        e.preventDefault();

        if (this.form.invalid) {
            this.showPopup('Error', 'Enter Valid Fields');
            return;
        }

        this.authService
            .loginUser(this.form.value)
            .subscribe((response) => {
                if (!response.userExists || !response.correctPassword) {
                    this.showPopup('Error', 'Wrong Details');
                    return;
                }

                document.cookie = `token: ${response.token}`;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                localStorage.setItem('token', response.token!);
                // Mark as pristine to avoid route guards
                this.form.markAsPristine();
                this.router.navigateByUrl('/expenses');
            });
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

function emailValidator(control: AbstractControl): ValidationErrors | null {
    const email: string = control.value;

    if(email.trim() !== '' || email.includes('@'))
        return null
    return { 'isEmailValid': false };
}

function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;

    if(password.length >= 5 && /[0-9]/.test(password)) {
        return null
    }

    return { 'isPasswordValid': false };
}


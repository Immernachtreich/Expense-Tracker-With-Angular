import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { SignUpCredentials } from 'src/app/interfaces/credentials';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from 'src/swagger';
// import { PopupModule } from '../popup/popup.module'
 
@Component({
    selector: 'app-signup',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    imports: [CommonModule, RouterModule, FormsModule]
})
export class SignupComponent {
    @ViewChild('signupForm') public form!: NgForm;
    displayPopup?: boolean;
    popupHeading?: string;
    popupText?: string;
    credentials: SignUpCredentials = {
        username: '',
        email: '',
        password: ''
    }

    constructor(
        private authService: UsersService,
        private router: Router
    ) {}

    signup(): void {
        const { username, email, password } = this.credentials;

        if ( username === '' || email.includes('@') === false || password === '' ) {
            console.log('here')
            this.showPopup('Error', 'Please Enter All The Fields');
            return;
        }

        this.authService
            .signUpuser(this.credentials)
            .subscribe((response) => {

                if (response.alreadyExisting) {
                    this.showPopup('Error', 'User Already Exists');
                    return;
                }
                this.form.reset();
                this.router.navigateByUrl('/login')
            });
    }

    showPopup(popupHeading: string, popupText: string): void {
        this.popupHeading = popupHeading;
        this.popupText = popupText;

        this.displayPopup = true;
    }

    closePopup(): void {
        this.displayPopup = false;
    }
}

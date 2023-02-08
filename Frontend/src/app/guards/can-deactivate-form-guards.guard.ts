import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CanDeactivate } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateFormGuardsGuard implements CanDeactivate<NgForm> {
    canDeactivate(component: NgForm): boolean {
        if(component.form.dirty) {
            return confirm('Do you want to discard changes?');
        }
        return true;
    }

}

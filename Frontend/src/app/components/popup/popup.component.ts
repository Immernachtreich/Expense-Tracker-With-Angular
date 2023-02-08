import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent {
  @Input() popupHeading?: string;
  @Input() popupText?: string;
  @Output() closeEvent = new EventEmitter<void>();

  closePopup(): void {
    this.closeEvent.emit();
  }
}

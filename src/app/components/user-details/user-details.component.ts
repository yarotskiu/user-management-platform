import { CdkTrapFocus } from '@angular/cdk/a11y';
import { NgIf } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersStore } from '@store/users.store';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  imports: [NgIf, FormsModule, CdkTrapFocus],
})
export class UserDetailsComponent {
  readonly store = inject(UsersStore);
  constructor() {
    effect(() => {
      // whenever selected user changed - turn off edit mode
      if (this.store.selectedUser()) {
        this.editMode.set(false);
      }
    });
  }

  user = this.store.selectedUser;

  editMode = signal(false);
  firstName = model<string>('');
  lastName = model<string>('');
  email = model<string>('');
  phone = model<string>('');
  cell = model<string>('');

  onClose(): void {
    this.editMode.set(false);
  }

  onSave(): void {
    const userData = this.user();

    if (!userData) return;

    const updatedUser: User = {
      ...userData,
      name: {
        ...userData.name,
        first: this.firstName(),
        last: this.lastName(),
      },
      email: this.email(),
      phone: this.phone(),
      cell: this.cell(),
    };

    this.store.updateUser(updatedUser);
    this.store.setSelectedUser(updatedUser);
    this.editMode.set(false);
  }

  onEdit(): void {
    const userData = this.user();

    if (!userData) return;

    this.firstName.set(userData.name.first);
    this.lastName.set(userData.name.last);
    this.email.set(userData.email);
    this.phone.set(userData.phone);
    this.cell.set(userData.cell);
    this.editMode.set(true);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 's' &&
      this.editMode()
    ) {
      event.preventDefault();
      this.onSave();
    } else if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'e' &&
      !this.editMode()
    ) {
      event.preventDefault();
      this.onEdit();
    } else if (event.key === 'Escape' && this.editMode()) {
      event.preventDefault();
      this.onClose();
    }
  }
}

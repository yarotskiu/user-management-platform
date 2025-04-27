import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, effect, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersStore } from '@store/users.store';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  imports: [NgClass, FormsModule, NgForOf, NgIf],
})
export class UserListComponent {
  readonly store = inject(UsersStore);
  constructor() {
    effect(() => this.store.setFilter(this.filter()));
  }

  filteredUsers = this.store.filteredUsers;
  selectedUser = this.store.selectedUser;

  filter = model<string>('');
  order = this.store.filter.order;

  flagUser(event: MouseEvent, user: User) {
    event.stopPropagation();
    user.flagged = !user.flagged;
    this.store.updateUser(user);
  }
  selectUser(user: User): void {
    this.store.setSelectedUser(user);
  }
}

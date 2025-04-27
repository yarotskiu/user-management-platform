import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { UserDetailsComponent } from '@components/user-details/user-details.component';
import { UserListComponent } from '@components/user-list/user-list.component';
import { UsersStore } from '@store/users.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserListComponent, UserDetailsComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly store = inject(UsersStore);

  selectedUser = this.store.selectedUser;
}

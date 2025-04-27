import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { catchError, of, take } from 'rxjs';
import { UsersService } from './users.service';

type Order = 'asc' | 'desc';

export type UsersState = {
  users: User[];
  isLoading: boolean;
  selectedUser: User | null;
  filter: { query: string; order: Order };
};

const initialState: UsersState = {
  users: [],
  isLoading: false,
  selectedUser: null,
  filter: { query: '', order: 'asc' },
};

function getName(user: User) {
  return `${user.name.first} ${user.name.last}`;
}

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, userService = inject(UsersService)) => ({
    setUsers(users: User[]): void {
      patchState(store, (state) => ({ users }));
    },
    setSelectedUser(user: User): void {
      patchState(store, (state) => ({ selectedUser: user }));
    },
    setFilter(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    toggleSort(): void {
      patchState(store, (state) => ({
        filter: {
          query: state.filter.query,
          order: (state.filter.order === 'asc' ? 'desc' : 'asc') as Order,
        },
      }));
    },
    updateUser(user: User): void {
      userService
        .updateUser(user)
        .pipe(
          take(1),
          catchError((error) => {
            console.error(error);
            return of(user);
          }),
        )
        .subscribe(() =>
          patchState(store, (state) => ({
            users: state.users.map((u) => (u.id === user.id ? user : u)),
          })),
        );
    },
  })),
  withHooks((store) => ({
    onInit() {
      const usersService = inject(UsersService);
      usersService
        .getUsers()
        .pipe(
          take(1),
          catchError((err) => {
            console.error(err);
            return of([]);
          }),
        )
        .subscribe((users) => store.setUsers(users));
    },
  })),
  withComputed(({ users, filter }) => ({
    filteredUsers: computed(() => {
      const q = filter.query().toLowerCase();
      const direction = filter.order() === 'asc' ? 1 : -1;
      return users()
        .filter((user) => getName(user).toLowerCase().includes(q))
        .toSorted((a, b) => direction * getName(a).localeCompare(getName(b)));
    }),
  })),
);

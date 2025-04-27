import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  readonly apiUrl = 'http://localhost:3000';

  getUsers(): Observable<Array<User>> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      take(1),
      map((response) => response),
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/users/${user.id}`, user)
      .pipe(take(1));
  }
}

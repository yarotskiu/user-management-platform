import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const dummyUsers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersService,
      ],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers should make a GET request and return users', () => {
    service.getUsers().subscribe((users) => {
      // @ts-ignore
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('updateUser should make a POST request and return the updated user', () => {
    const updatedUser = { id: 1, name: 'Alice Updated' };

    // @ts-ignore
    service.updateUser(updatedUser).subscribe((user) => {
      // @ts-ignore
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });
});

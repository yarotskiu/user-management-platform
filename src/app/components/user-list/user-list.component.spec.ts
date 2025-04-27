import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UsersStore } from '@store/users.store';

let storeSpy: jasmine.SpyObj<any>;
let fixture: ComponentFixture<UserListComponent>;
let component: UserListComponent;

describe('UserListComponent', () => {
  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('UsersStore', [
      'selectedUser',
      'updateUser',
      'setSelectedUser',
      'filter',
      'setFilter',
    ]);

    storeSpy.selectedUser.and.returnValue(null);
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{ provide: UsersStore, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('flagUser toggles flagged and updates the store', () => {
    const user = { flagged: false } as User;
    const fakeEvent = {
      stopPropagation: jasmine.createSpy(),
    } as any as MouseEvent;
    component.flagUser(fakeEvent, user);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(user.flagged).toBeTrue();
    expect(storeSpy.updateUser).toHaveBeenCalledWith(user);
  });

  it('selectUser calls store.setSelectedUser', () => {
    // @ts-ignore
    const user = { id: 123 } as User;
    component.selectUser(user);
    expect(storeSpy.setSelectedUser).toHaveBeenCalledWith(user);
  });
});

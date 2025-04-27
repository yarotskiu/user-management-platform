import { TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from '@components/user-details/user-details.component';
import { UsersStore } from '@store/users.store';

let storeSpy: jasmine.SpyObj<any>;

describe('AppComponent', () => {
  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('UsersStore', [
      'selectedUser',
      'updateUser',
      'setSelectedUser',
    ]);

    storeSpy.selectedUser.and.returnValue(null);
    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent],
      providers: [{ provide: UsersStore, useValue: storeSpy }],
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have editMode false by default', () => {
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const component = fixture.componentInstance;
    expect(component.editMode()).toBeFalse();
  });

  it('onEdit does nothing when no user is selected', () => {
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const component = fixture.componentInstance;
    storeSpy.selectedUser.and.returnValue(null);
    component.onEdit();
    expect(component.editMode()).toBeFalse();
  });

  it('onEdit populates models and enters edit mode when a user is present', () => {
    const testUser = {
      name: { first: 'John', last: 'Doe' },
      email: 'john@example.com',
      phone: '123',
      cell: '456',
      location: { street: { name: 'Main St' } },
    };
    storeSpy.selectedUser.and.returnValue(testUser);
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const component = fixture.componentInstance;
    component.onEdit();
    expect(component.firstName()).toEqual('John');
    expect(component.lastName()).toEqual('Doe');
    expect(component.email()).toEqual('john@example.com');
    expect(component.phone()).toEqual('123');
    expect(component.cell()).toEqual('456');
    expect(component.editMode()).toBeTrue();
  });

  it('onClose always sets edit mode to false', () => {
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const component = fixture.componentInstance;
    const fakeUser = {
      name: { first: '', last: '' },
      email: '',
      phone: '',
      cell: '',
      location: { street: { name: '' } },
    };
    storeSpy.selectedUser.and.returnValue(fakeUser);
    component.onEdit();
    expect(component.editMode()).toBeTrue();
    component.onClose();
    expect(component.editMode()).toBeFalse();
  });

  it('onSave does nothing when no user is selected', () => {
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const component = fixture.componentInstance;
    storeSpy.selectedUser.and.returnValue(null);
    component.onSave();
    expect(storeSpy.updateUser).not.toHaveBeenCalled();
    expect(storeSpy.setSelectedUser).not.toHaveBeenCalled();
    expect(component.editMode()).toBeFalse();
  });

  it('onSave builds updated user and calls store when in edit mode', () => {
    const originalUser = {
      name: { first: 'Jane', last: 'Smith' },
      email: 'jane@old.com',
      phone: '111',
      cell: '222',
    };
    storeSpy.selectedUser.and.returnValue(originalUser);
    const fixture = TestBed.createComponent(UserDetailsComponent);
    const component = fixture.componentInstance;
    component.onEdit();
    component.firstName.set('Janet');
    component.lastName.set('Doe');
    component.email.set('jane@new.com');
    component.phone.set('333');
    component.cell.set('444');
    component.onSave();
    const expectedUser = {
      ...originalUser,
      name: { first: 'Janet', last: 'Doe' },
      email: 'jane@new.com',
      phone: '333',
      cell: '444',
    };
    expect(storeSpy.updateUser).toHaveBeenCalledWith(expectedUser);
    expect(storeSpy.setSelectedUser).toHaveBeenCalledWith(expectedUser);
    expect(component.editMode()).toBeFalse();
  });
});

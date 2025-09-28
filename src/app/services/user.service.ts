import { Injectable } from '@angular/core';
import { User } from '../core/interfaces/user.interface';
import { UserRole } from '../core/enums/user-role.enum';
import { ViewMode } from '../core/enums/view-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User | null = null;

  constructor() { }

  createUser(name: string, viewMode: ViewMode): User {
    const newUser: User = {
      name: name.trim(),
      rol: UserRole.propietario,
      viewMode: viewMode
    };
    
    this.currentUser = newUser;
    return newUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

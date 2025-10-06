import { Injectable } from '@angular/core';
import { User } from '../core/interfaces/user.interface';
import { UserRole } from '../core/enums/user-role.enum';
import { ViewMode } from '../core/enums/view-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: User | null = null;

  constructor() {}

  createUser(
    name: string,
    viewMode: ViewMode,
    rol: UserRole = UserRole.propietario
  ): User {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rol: rol,
      viewMode: viewMode,
    };

    this.currentUser = newUser;
    return newUser;
  }

  // convertir a un getter
  get getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Método para cambiar el modo de visualización del usuario actual
  changeViewMode(newViewMode: ViewMode): boolean {
    if (this.currentUser) {
      this.currentUser.viewMode = newViewMode;
      return true;
    }
    return false;
  }
}

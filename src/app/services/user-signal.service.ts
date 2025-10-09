import { computed, Injectable, Signal, signal } from '@angular/core';
import { User } from '../core/interfaces/user.interface';
import { ViewMode } from '../core/enums/view-mode.enum';
import { UserRole } from '../core/enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserSignalService {
  private userSignal = signal<User | null>(null);

  constructor() {}

  getUserSignal: Signal<User | null> = this.userSignal.asReadonly();

  readonly getViewMode: Signal<ViewMode> = computed(() => {
    const user = this.userSignal();
    return user?.viewMode || ViewMode.jugador;
  });

  createUser(
    name: string,
    viewMode: ViewMode,
    rol: UserRole = UserRole.propietario
  ): void {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rol: rol,
      viewMode: viewMode,
    };

    this.userSignal.set(newUser);
  }
}

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

  /**
   * Crea un nuevo usuario
   * @param name - El nombre del usuario
   * @param viewMode - El modo de visualización del usuario
   * @param rol - El rol del usuario
   * @author Sebastian Aristizabal Castañeda
   */
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

  /**
   * Cambia el modo de visualización del usuario
   * @param newViewMode - El nuevo modo de visualización
   * @author Sebastian Aristizabal Castañeda
   */
  changeViewMode(newViewMode: ViewMode): void {
    const user = this.userSignal();

    if (user) {
      this.userSignal.set({ ...user, viewMode: newViewMode });
      console.log(
        `changeViewMode: Modo de visualización cambiado a: ${newViewMode}`
      );
    } else {
      console.log(`changeViewMode: Usuario no encontrado`);
    }
  }
}

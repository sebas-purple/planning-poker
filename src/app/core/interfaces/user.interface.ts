import { UserRole } from '../enums/user-role.enum';
import { ViewMode } from '../enums/view-mode.enum';

export interface User {
  name: string;
  rol: UserRole;
  viewMode: ViewMode;
}

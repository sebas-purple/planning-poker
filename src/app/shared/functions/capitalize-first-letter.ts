/**
 * Convierte la primera letra del nombre en mayúscula
 * @param name - El nombre a convertir
 * @author Sebastian Aristizabal Castañeda
 */
export function capitalizeFirstLetter(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

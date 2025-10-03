export enum UserRole {
  propietario = 'propietario',      // es el que crea la partida
  administrador = 'administrador',  // es el que puede revelar las cartas, promover a administrador, degradar a jugador
  jugador = 'jugador'               // es el que puede votar
}

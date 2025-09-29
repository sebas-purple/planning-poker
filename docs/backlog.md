# Historia de Usuario 1

**Rol:** Sin Rol

**Historia de Usuario:**  
Crear Partida

**Descripción:**  
Yo como Usuario de planning poker  
necesito poder crear una partida  
para poder iniciar el juego, donde todos se van a conectar.

**Criterios de aceptación:**

1. Al crear la partida, se deben solicitar los siguientes campos obligatorios:
   - Nombre
2. El nombre tiene entre 5 y 20 caracteres, no puede tener caracteres especiales (\_,.\*#/-),  
   máximo puede tener 3 números en el nombre, y no puede contener solo números.

---

# Historia de Usuario 2

**Rol:** administrador

**Historia de Usuario:**  
Crear usuario administrador y modo de visualizacion

**Descripción:**  
Yo como usuario administrador de planning poker
necesito poder crear en el sistema el jugador administrador
para interactuar con el sistema con los permisos administrador.

**Criterios de aceptación:**

1. Al crear el usuario administrador, se deben solicitar los siguientes campos obligatorios:

- Nombre
- Modo de visualizacion(jugador, espectador)

2. el nombre tiene entre 5 y 20 caracteres, no puede tener caracteres especiales (\_,.\*#/-), maximo puede tener 3 numeros el nombre, y no puede contener solo numeros
3. el usuario quedara con el rol propietario.

---

# Historia de Usuario 3

**Rol:** administrador

**Historia de Usuario:**  
Visualizar la mesa de votación con los demas usuarios

**Descripción:**  
Yo como usuario adminitrador de planning poker
necesito poder visualizar la mesa con los demas jugador
para saber si ya todos eligieron carta o falta alguno

**Criterios de aceptación:**

1. cuando no se ha elegido carta por defecto muestra la carta en blanco, con solo el borde

2. si es un jugador espectador la carta sale con un diseño tipo espectador

3. se visualiza a todos los jugadores en mesa redonda

**Atomos**

- card: choice, player, viewer
- table

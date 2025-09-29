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

---

# Historia de Usuario 4

**Rol:** administrador

**Historia de Usuario:**  
Elegir una carta con puntaje

**Descripción:**  
Yo como usuario administrador de planning poker
necesito poder elegir una carta del pool de cartas visibles
para mostrarles a los demas mi puntaje

**Criterios de aceptación:**

1. Solo los usuarios con tipo de visualizacion jugador, pueden elegir carta
2. se debe elegir una de las cartas visualizadas
3. las cartas tienen que tener un puntaje, y no se pueden repetir los puntajes
4. las cartas se cargan de forma dinamica y si no hay ninguna carta se debe mostrar un mensaje de no hay cartas registrada
5. una vez elegida la carta se debe notificar a todos los jugadores que se ha elegido una carta y cambiar la carta de la mesa de votación por una carta default

---

# Historia de Usuario 5

**Rol:** administrador

**Historia de Usuario:**  
Revelar cartas y puntaje promedio

**Descripción:**  
Yo como usuario administrador de planning poker
necesito poder revelar las cartas de todos los jugadores
para saber tomar una decisión sobre que puntaje elegir

**Criterios de aceptación:**

1. solo el rol administrador puede revelar las cartas
2. En la mesa de votación de todos los jugadores se visualiza la carta que cada uno eligio
3. la carta de los espectadores en la mesa de votación se sigue viendo con un diseño tipo espectador
4. se visualiza la cantidad de persona que votaron por cada carta
5. se visualiza el puntaje promedio de la votación, los espectadores no se tienen en cuenta para este puntaje promedio"

---

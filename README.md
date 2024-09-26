

TEMPORIZE by Testeo-games

> Primer proyecto en grupo de los cuatro jinetes: Asier Mimbrero, Xavi Valverde, Ronald Velez y Jorge Berrizbeitia.
Este proyecto se empezó para el aprendizaje de Pasher y la creación de un minijuego. 

Actualmente en desarrollo 

## TAREAS:
### Algunas tareas pendientes:

>- En pausa los elementos siguen moviendose.
>- En pause, los puntos por tiempo no deberían aumentar ni disminuir y las colisiones del jugador deberían estar desactivadas (o añadir modo invulnerable).
>- Revisar y borrar todos los setPadding de las animaciones de glow, parece que no están afectando.
>- Revisar animación de enemigo melee en modo "berserk"


## DIARIO:
### 1/7/24 El grupo se junta para empezar con la idea de proyecto

>- Reunión de grupo para decidir el modo de trabajo, los días que se le dedica a cada parte del proyecto, la organización del grupo en general...


### 10/7/24 Trabajo realizado por el equipo:

>- Inicia el proyecto 'Temporize' del grupo.
>- Creación del repositorio y primer commit.


### 22/7/24 Trabajo realizado por el equipo:

- Se inicia el "blog" del proyecto. (Intentarémos subir info a las redes cada 2 semanas o cuando el proyecto avance de forma notable)
>- Pruebas de colisión del jugador contra las plataformas.
>- Movimientos del jugador por la pantalla.
>- Posición del fondo respecto al movimiento del jugador. (Parallax)
>- Organizar y comentar el código para una mejor lectura.


### 24/7/24 Trabajo realizado por el equipo:

>- Añadido Pausa y efectos de pausa.
>- Añadido Menú de pausa.
>- Añadido Temporizador.


### 21/8/24 Trabajo realizado por el equipo:

>- Empezadas nuevas escenas para un mejor "user flow".
>- Control de tiempo de juego ajustado (min 3, max 59).
>- Añadidos enemigos voladores, enemigos melees, disparos y sus colisiones/ataques.
>- Empezada clase 'Boss' y sus ataques especiales. 
>- Control de puntos en el juego por enemigos eliminados, golpes recibidos y por tiempo. 


## ANOTACIONES:
### Nota "cambios de escena"

>- this.scene.bringToTop("nombreEscena" ó this.)//Mueve la escena a la capa más alta.
>- this.scene.sendToBack("nombreEscena" ó this.)//mueve la escena a la capa más baja.
>- this.scene.moveUp("nombreEscena" ó this.)//mueve esta escena una capa hacia arriba. "nombreEscena" o this.
>- this.scene.moveDown("nombreEscena" ó this.)//mueve esta escena una capa hacia abajo.
>- this.scene.moveAbove("a","b")//mueve escena "b" justo encima de "a".
>- this.scene.moveBelow("a","b")//mueve escena "b" justo debajo de "a".

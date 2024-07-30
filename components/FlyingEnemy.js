export default class FlyingEnemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, player){

        super(scene, x, y, "flyingEnemy");
        this.sceneRef = scene;//esto me gustaria mirarlo mejor, se guarda una copia de la escena y así siempre hay un "backup" para cuando se destruye
        console.log(`El enemigo volador se creó en x=${x}, y=${y}`)

        this.scene = scene;
        this.player = player;
        this.speed = 0.1; //velocidad de movimiento, probando
        this.floatTime = 0; //para controlar el tiempo que el enemigo está flotando en pantalla antes de irse
        this.shootInterval = 5000; //5 segundos para disparar
        this.lastShootTime = 0; //contador de tiempo para el disparo
        this.isFloating = false; //empieza moviendose
        this.setVisible(true);
        this.setDepth(1);
        this.setTexture("flyingEnemy");
        this.setPosition(x, y);
        this.setScale(0.050
        );

        //! asegurarse de que se crea dentro de los limites de la camara
        const camera = this.scene.cameras.main;
        const minX = camera.worldView.x + 100;
        const maxX = camera.worldView.right - 100;
        const minY = camera.worldView.y +100;
        const maxY = camera.worldView.bottom - 100;

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;
        if (y < minY) y = minY;
        if (y > maxY) y = maxY;

        //para moverlo
        this.velocityX = -2; //mov horizontal, negativa izquierda
        this.velocityY = 0.001; //mov vertical
        this.amplitude = 4;
        this.frequency = 10;
    }
    update(time, delta){
        //log para saber donde esta el enemigo:
        console.log(`Enemigo x: ${this.x}, y: ${this.y}`);

        //movimiento horizontal
        this.x += this.velocityX

        //efecto flotar
        //todo no sale, hay que revisar
        this.y += Math.sin(this.frequency * time) * this.amplitude;

        //rebotar en los bordes superiores
        //!
        if (this.y < 0 || this.y > this.scene.game.config.height - this.height) {}

        //Destruir enemigo cuando sale de la pantalla y crear uno nuevo.

        if (this.x < 0 || this.x > this.scene.game.config.width) {
          this.destroy();
          this.sceneRef.createFlyingEnemy()
          }

          /* if (this.x < 0) {
            this.x = this.scene.game.config.width;
          }
          if (this.x <0 || this.x > this.scene.game.config.width ||this.y < 0 || this.y > this.scene.game.config.height){
            this.destroy();
            this.scene.createFlyingEnemy()
          } */

        //No se salga de los limites de la camara(por ahora)

        const camera = this.scene.cameras.main;
        const minX = camera.worldView.x;
        const maxX = camera.worldView.right;
        const minY = camera.worldView.y;
        const maxY = camera.worldView.bottom;

  if (this.x < minX) this.x = minX;
  if (this.x > maxX) this.x = maxX;
  if (this.y < minY) this.y = minY;
  if (this.y > maxY) this.y = maxY;

        //para que se quede en la izq en caso de ir super rápido.
        if (this.x < 0) {
            this.x = 0;
          } else {
            this.x -= this.speed * delta;
          }
        
        //delta tiempo transcurrido desde el ultimo frame en milisec
        if (this.isFloating){ //si el enemigo está flotando incrementa el tiempo de flotacion en milisecs
            this.floatTime += delta;
            if (this.floatTime  >= 3000){ //cuando alcanza los 3 segundos la flotacion acaba y se va hacia la izquierda
                this.isFloating = false;
                this.floatTime = 0;
            }
        } else{
            this.x -= this.speed * delta;
            if (this.x < -this.width){
                this.destroy();
            }
        }
        /* if (time - this.lastShootTime >= this.shootInterval){
            this.lastShootTime = time;
            this.shoot();
        } */
    }
    /* createFlyingEnemy(){
        const enemy = new FlyingEnemy(this, x, y, this.Player)
;       this.add.existing(enemy);
        enemy.body.velocity.x = 100; //100px sec
        this.setVisible(true); //para ver si aparece
        this.setDepth(1);
        this.setTexture('flyingEnemy');
        this.setScale(1);
    }
 */
//TODO Hacer el disparo
//TODO que ronde un poco por la pantalla, se pare y dispare, etc.

}

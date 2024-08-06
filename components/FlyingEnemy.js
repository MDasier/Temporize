export default class FlyingEnemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, "flyingEnemy");
    this.sceneRef = scene; //esto me gustaria mirarlo mejor, se guarda una copia de la escena y así siempre hay un "backup" para cuando se destruye

    //* LOG DE ENEMIGO
    //console.log(`El enemigo volador se creó en x=${x}, y=${y}`)

    /* //! ataque autista
     this.time.addEvent({
      delay: 0.1,
      callback: this.flyingEnemy.shootBeam(),
      callbackScope: this,
      loop: true,
    })
    console.log("disparo enemigo")*/

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
    this.setScale(0.2);

    //! asegurarse de que se crea dentro de los limites de la camara
    const camera = this.scene.cameras.main;
    const minX = camera.worldView.x + 100;
    const maxX = camera.worldView.right - 100;
    const minY = camera.worldView.y + 100;
    const maxY = camera.worldView.bottom - 100;

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    //para moverlo
    this.velocityX = -2; //mov horizontal, negativa izquierda
    this.velocityY = 0.020; //mov vertical
    this.amplitude = 4;
    this.frequency = 10;
  }

  shootBeam() {
    this.scene.createBeam(this.x, this.y, -800, +500);
  }
  update(time) {
    //movimiento horizontgital
    this.x += this.velocityX;

    //efecto flotar
    //todo no sale, hay que revisar
    //this.y += Math.sin(this.frequency * time) * this.amplitude;
    //this.y += Math.sin(this.frequency * time + Math.cos(this.frequency * time * 0.5)) * this.amplitude;
    //this.y += Math.sin(this.frequency * time) * this.amplitude * Math.cos(this.frequency * time * 0.5);
    this.y += this.velocityY;
    this.velocityY += Math.sin(this.frequency * time) * this.amplitude * 0.05;
    //this.velocityY *= 0.99; // Desaceleración

    //rebotar en los bordes superiores y mitad de pantalla

    if (this.y <= 0 || this.y - this.scene.game.config.height >= this.scene.game.config.height) {
      this.velocityY *= -1
    }
    if (this.y >= this.scene.game.config.height/2 ) {
      this.velocityY *= -1
    }
     

    //Destruir enemigo cuando sale de la pantalla y crear uno nuevo.

    if (this.x < 0 || this.x > this.scene.game.config.width) {
      this.destroy();
      console.log("destruido enemigo");
      this.sceneRef.createFlyingEnemy();
    }


//TODO ahora mismo no tiene sentido, para más tarde
    /* //delta tiempo transcurrido desde el ultimo frame en milisec
    if (this.isFloating) {
      //si el enemigo está flotando incrementa el tiempo de flotacion en milisecs
      this.floatTime += delta;
      if (this.floatTime >= 3000) {
        //cuando alcanza los 3 segundos la flotacion acaba y se va hacia la izquierda
        this.isFloating = false;
        this.floatTime = 0;
      }
    } else {
      this.x -= this.speed * delta;
      if (this.x < -this.width) {
        this.destroy();
      }
    } */
    /* if (time - this.lastShootTime >= this.shootInterval){
            this.lastShootTime = time;
            this.shoot();
        } */
  }
  
 
  //TODO Hacer el disparo
  //TODO que ronde un poco por la pantalla, se pare y dispare, etc.
}

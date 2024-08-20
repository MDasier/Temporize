
export default class FlyingEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "flyingEnemy");

    this.scene = scene;
    this.speed = 0.1; //velocidad de movimiento, probando

    /*  this.floatTime = 0; //para controlar el tiempo que el enemigo está flotando en pantalla antes de irse
    this.shootInterval = 5000; //5 segundos para disparar
    this.lastShootTime = 0; //contador de tiempo para el disparo
    this.isFloating = false; //empieza moviendose */

    this.setDepth(1);
    this.setTexture("flyingEnemy");
    this.setPosition(x, y);
    this.setScale(1);

    //para moverlo
    this.velocityX = -3; //mov horizontal, negativa izquierda
    this.velocityY = 0.015; //mov vertical
    this.amplitude = 3;
    this.frequency = 1000;

    this.w = 100;
    this.h = 86;

    // this.createAnimation = this.createAnimation.bind(this);
    // this.createAnimation();
    // this.anims.play("fly");

    this.scene.physics.add.existing(this); //cargar el jugador a la scene
    this.scene.add.existing(this); //hitbox del enemy
    this.body.setSize(this.w, this.h, true); // reducimos en 10 para que la colision de disparos sea mejor.
    this.body.setOffset(0, 0); //tamaño del hitbox

    this.body.setAllowGravity(false)

    this.canShoot = true;
    this.shootTimer = 0;
    this.beamSpeed = 800
  }

  createAnimation() {
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers(this.texture.key, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  shootBeam() {
    const beam = this.scene.add.sprite(this.x, this.y, "fire");
    beam.setScale(0.8);

    const player = this.scene.player;

    this.scene.tweens.add({
      targets: beam,
      x: player.x,
      y: player.y,
      duration: this.beamSpeed,
      onComplete: () => {
        beam.destroy();
      },
    });
    
    //efecto visual pulsación
    this.scene.tweens.add({
      targets: beam,
      scaleX: 0.6,
      scaleY: 0.6,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }

  update(time, delta) {
    //movimiento horizontgital
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityY += Math.sin(this.frequency * time) * this.amplitude * 0.05;

    //rebotar en los bordes superiores y mitad de pantalla
    if (
      this.y <= 0 ||
      this.y - this.scene.game.config.height >= this.scene.game.config.height
    ) {
      this.velocityY *= -1;
    }
    if (this.y >= this.scene.game.config.height / 2) {
      this.velocityY *= -1;
    }

    //Destruir enemigo cuando sale de la pantalla y crear uno nuevo.
    if (this.x < 0 || this.x > this.scene.game.config.width) {
      this.scene.createFlyingEnemy(); // se llama antes de destruir el objeto
      this.destroy();
      console.log("destruido enemigo");
      this.sceneRef.createFlyingEnemy();
    }

    //disparo enemigo
    if (this.canShoot && this.shootTimer <= 0) {
      this.shootTimer = Phaser.Math.Between(2000, 5000); // 2-5 segundos en milisegundos
      this.shootBeam();
    } else {
      this.shootTimer -= delta;
    }
  }
}

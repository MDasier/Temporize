
export default class GroundEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "groundEnemy");

    this.scene = scene;
    this.speed = 0.1; //velocidad de movimiento, probando

    this.setDepth(1);
    this.setTexture("groundEnemy");
    this.setPosition(x, y);
    this.setScale(1);

    //para moverlo
    this.velocityX = -3; //mov horizontal, negativa izquierda
    this.amplitude = 3;
    this.frequency = 1000;

    this.w = 100;
    this.h = 86;

    // this.createAnimation();
    // this.anims.play("walk");

    this.scene.physics.add.existing(this); 
    this.scene.add.existing(this); 
    this.body.setSize(this.w, this.h, true);
    this.body.setOffset(0, 0);
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

  update(time, delta) {
    //movimiento horizontgital
    this.x += this.velocityX;

    //Destruir enemigo cuando sale de la pantalla y crear uno nuevo.
    if (this.x < 0 || this.x > this.scene.game.config.width) {
      this.scene.createGroundEnemy(); 
      this.destroy();
    }
  }
}

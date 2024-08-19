
export default class GroundEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "groundEnemyRun");
    
    this.scene = scene;
    this.speed = 0.1; //velocidad de movimiento, probando

    this.setDepth(1);
    this.setTexture("groundEnemyRun");
    this.setPosition(x, y);
    this.setScale(2.5);

    //para moverlo
    this.velocityX = -3; //mov horizontal, negativa izquierda
    this.amplitude = 3;
    this.frequency = 1000;

    this.w = 30;
    this.h = 30;

    this.createAnimation();
    this.anims.play("run");

    this.scene.physics.add.existing(this)  ; 
    this.scene.add.existing(this); 
    this.body.setSize(this.w, this.h, true);
    this.body.setOffset(26, 35);

    this.flipX = true;
    this.canAttack = false;
  }

  createAnimation() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers(this.texture.key, {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("groundEnemyDeath", { start: 0, end: 22 }),
      frameRate: 10,
      repeat: 0,
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

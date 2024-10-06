export default class Beam extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    flipX,
    velocity,
    scale,
    lifetime,
    width,
    height
  ) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.flipX = flipX;
    this.velocity = velocity;
    this.lifetime = lifetime;

    // agrega el objeto Beam al sistema de físicas y a la escena
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    // configura el tamaño del cuerpo y que no se quede en la pantalla estancada
    this.setCollideWorldBounds(false);
    this.setScale(scale);
    this.body.setSize(width - 10, height, true);

    // destruye el beam después del tiempo especificado
    this.scene.time.delayedCall(this.lifetime, () => {
      this.destroy();
    });
  }

  update() {
    this.setVelocityY(0); // establece la velocidad en "y" a 0 para anular la gravedad
    this.setVelocityX(this.flipX ? -this.velocity : this.velocity); // establece la velocidad en X según flipX

    this.scene.physics.add.overlap(this, this.scene.boss, (beam, boss) => {
      boss.HP -= 1;

        const damageGlow = boss.preFX.addGlow(0xff0000,6,1,false,undefined,10); 
        this.scene.time.delayedCall(100, () => {
          boss.preFX.remove(damageGlow)
        });
      beam.destroy()

    }); // detecta las colisiones con el boss

    if (this.scene.flyingEnemy) {
      this.scene.physics.add.overlap(
        this,
        this.scene.flyingEnemy,
        (beam, enemy) => {
          this.scene.player.coins += 5;
          this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
          
          beam.destroy();

          //* chapuza para que el enemigo "desaparezca" aunque sigue existiendo y llega al final para causar que uno nuevo aparezca.
          enemy.setVisible(false);
          enemy.canShoot = false;
          enemy.body.checkCollision.right = false;
          enemy.body.checkCollision.left = false;
          enemy.body.checkCollision.up = false;
          enemy.body.checkCollision.down = false;
          
        }
      );
    }

    if(this.scene.groundEnemy){
      this.scene.physics.add.overlap(this,this.scene.groundEnemy,(beam, enemy) => {          
          enemy.HP -= 1;
          //beam.destroy()

          if (enemy.HP <= 0) {
            this.scene.player.coins += 5;
            this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
            enemy.body.checkCollision.right = false;
            enemy.body.checkCollision.left = false;
            enemy.body.checkCollision.up = false;
            enemy.anims.play("deathEnemy").on("animationcomplete",() => {
              enemy.setVisible(false);
              enemy.velocityX = -3;
            });
            enemy.isDying = true;
            enemy.velocityX = -1;

            if (this.scene.groundEnemy.isBerserkMode) {
              enemy.destroy();
              this.scene.groundEnemy = null;
            }
          }

          beam.destroy();
        });
    }

  }
}

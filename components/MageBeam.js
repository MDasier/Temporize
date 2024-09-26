export default class MageBeam extends Phaser.Physics.Arcade.Sprite {
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
    height,
    pointerX,
    pointerY
  ) {
    super(scene, x, y, texture);
    this.scene = scene;    
    this.flipX = flipX;
    this.velocity = velocity;
    this.lifetime = lifetime;
    this.pointerX=pointerX;
    this.pointerY=pointerY;
    this.reachedDestination=false;
    // agrega el objeto MageBeam al sistema de físicas y a la escena
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    // Agregar efectos visuales
    //tweens o anim

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
    //this.setVelocityY(1); // establece la velocidad en "y" a 0 para anular la gravedad
    //this.setVelocityX(this.velocity);

    this.scene.physics.add.overlap(this, this.scene.boss, (mageBeam, boss) => {
      boss.HP -= 1;
        const damageGlow = boss.preFX.addGlow(0xff0000,6,1,false,undefined,10); 
        this.scene.time.delayedCall(100, () => {
          boss.preFX.remove(damageGlow)
        });
        mageBeam.destroy()
    }); // detecta las colisiones con el boss

    if (this.scene.flyingEnemy) {
      this.scene.physics.add.overlap(
        this,
        this.scene.flyingEnemy,
        (mageBeam, enemy) => {
          this.scene.player.coins += 5;
          this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
          
          mageBeam.destroy();

          //?el enemigo se deja de ver pero no se destruye. con .destroy se rompe el juego
          enemy.setVisible(false);
          enemy.canShoot = false;
          enemy.body.checkCollision.right = false;
          enemy.body.checkCollision.left = false;
          enemy.body.checkCollision.up = false;
          enemy.body.checkCollision.down = false;
          
        }
      );
    }

    if (this.scene.groundEnemy) {
      this.scene.physics.add.overlap(
        this,
        this.scene.groundEnemy,
        (mageBeam, enemy) => {
          
          enemy.HP -= 1;
          //beam.destroy()

          if (enemy.HP <= 0) {
            this.scene.player.coins += 5;
            this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
            enemy.body.checkCollision.right = false;
            enemy.body.checkCollision.left = false;
            enemy.body.checkCollision.up = false;
            enemy.anims.play("death").on("animationcomplete",() => {
              enemy.setVisible(false);
              enemy.velocityX = -3;
            });
            enemy.isDying = true;
            enemy.velocityX = -1; // para que animacion sea a velocidad estatico

            if (this.scene.groundEnemy.isBerserkMode) {
              enemy.destroy();
              this.scene.groundEnemy = null;
            }
          }

          mageBeam.destroy();
        }
      );
    }

    //this.scene.physics.moveTo(this, this.pointerX, this.pointerY, this.velocity);
    if (!this.reachedDestination) {
      this.scene.physics.moveTo(this, this.pointerX, this.pointerY, this.velocity);
      const distanceToPointer = Phaser.Math.Distance.Between(this.x, this.y, this.pointerX, this.pointerY);
      if (distanceToPointer < 50) {
        this.reachedDestination = true;
      }
    } else {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.x + this.body.velocity.x, this.y + this.body.velocity.y);
      this.setRotation(angle);
      this.setVelocity(this.velocity * Math.cos(angle), this.velocity * Math.sin(angle));
    }
/*
    // Si el disparo aún no ha alcanzado su destino
    if (!this.reachedDestination) {
      this.setVelocity(this.velocity);
      this.scene.physics.moveTo(this, this.pointerX, this.pointerY, this.velocity);

      // Calcular la distancia restante al destino
      const distanceToPointer = Phaser.Math.Distance.Between(this.x, this.y, this.pointerX, this.pointerY);
      if (distanceToPointer < 20) {
        this.reachedDestination = true;
      }
    } else {
      // El disparo ya alcanzó su destino, ahora continúa en la misma dirección
      const angle = Phaser.Math.DegToRad(this.angle);
      this.setVelocityX(this.velocity * Math.cos(angle));
      this.setVelocityY(this.velocity * Math.sin(angle));
    }
*//*
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.pointerX, this.pointerY);
      const directionX = Math.cos(angle);
      const directionY = Math.sin(angle);

      // Establecer manualmente la velocidad en la dirección del puntero
      this.setVelocityX(this.velocity * directionX);
      this.setVelocityY(this.velocity * directionY);
*/
  }
}

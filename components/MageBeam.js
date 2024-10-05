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
    if(this.scene.boss && this.scene.boss.HP>0){
      this.scene.physics.add.overlap(
        this, this.scene.boss, (mageBeam, boss) => {
          boss.HP -= 1;
          this.body.setSize(boss.x, 100, true);
          boss.anims.play("bossHitAnim").on("animationcomplete", () => {
            boss.anims.play("bossIdleAnim")
          });
            const damageGlow = boss.preFX.addGlow(0xff0000,6,1,false,undefined,10); 
            this.scene.time.delayedCall(100, () => {
              boss.preFX.remove(damageGlow)
            });
          mageBeam.destroy()
      }); //colisiones con el Boss
    }
    

    if(this.scene.flyingEnemy && this.scene.flyingEnemy.HP>0){
      this.scene.physics.add.overlap(
        this,
        this.scene.flyingEnemy,
        (mageBeam, enemy) => {
          enemy.HP -= 1;
          this.scene.player.coins += 5;
          this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
          mageBeam.destroy();

          //*FALTA AÑADIR ANIMACION DE MUERTE FLYINGENEMY
          enemy.setVisible(false);
          enemy.canShoot = false;

          /* //!NO HACE FALTA AL NO TENER OVERLAP POR NO TENER VIDA
          enemy.body.checkCollision.right = false;
          enemy.body.checkCollision.left = false;
          enemy.body.checkCollision.up = false;
          enemy.body.checkCollision.down = false;
          */
          
        }
      );
    }//colisiones con flyingEnemy

    if (this.scene.groundEnemy && this.scene.groundEnemy.HP>0) {
      this.scene.physics.add.overlap(
        this,
        this.scene.groundEnemy,
        (mageBeam, enemy) => {
          
          enemy.HP -= 1;
          enemy.anims.play(enemy.isBerserkMode?"hitPlayerAnim":"hitEnemyAnim").on("animationcomplete",() => {
            enemy.anims.play(enemy.isBerserkMode?"runPlayerAnim":"runEnemyAnim")
          });
          if (enemy.HP <= 0) {
            this.scene.player.coins += 5;
            this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
            enemy.anims.play(enemy.isBerserkMode?"deathPlayerAnim":"deathEnemyAnim").on("animationcomplete",() => {
              enemy.setVisible(false);
              enemy.velocityX = -3;
              
            });            
            enemy.isDying = true;
            enemy.velocityX = -1; 
          }
          mageBeam.destroy();
        }
      );
    }//colisiones groundEnemy

    //Si el mageBeam no ha llegado a donde hemos hecho click
    if(!this.reachedDestination){
      this.scene.physics.moveTo(this, this.pointerX, this.pointerY, this.velocity);
      const distanceToPointer = Phaser.Math.Distance.Between(this.x, this.y, this.pointerX, this.pointerY);
      if (distanceToPointer < 50) {//Cuando está apunto de llegar al click (pointer)
        this.reachedDestination = true;
      }
    }else{//Si el mageBeam llega a donde hemos hecho click - Matematicas de IA
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.x + this.body.velocity.x, this.y + this.body.velocity.y);
      this.setRotation(angle);
      this.setVelocity(this.velocity * Math.cos(angle), this.velocity * Math.sin(angle));
    }
    
  }
}

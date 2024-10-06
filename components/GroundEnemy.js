
export default class GroundEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player,clone) {
    super(scene, x, y);
    
    this.player = player
    this.scene = scene;
    this.speed = 0.1; //velocidad de movimiento, probando
    this.enemyX=x;
    this.enemyY=y;
    this.setDepth(1);
    this.setTexture(!clone?"runEnemy":"runPlayer");
    this.setPosition(x, y);
    this.setScale(!clone?2.5:1);

    //para moverlo
    this.velocityX = -3; //mov horizontal, negativa izquierda
    this.amplitude = 3;
    this.frequency = 1000;

    this.w = 30;
    this.h = 40;

    this.createAnimation();
    this.anims.play(!clone?"runEnemyAnim":"runPlayerAnim");

    this.scene.physics.add.existing(this); 
    this.scene.add.existing(this); 
    this.body.setSize(this.w, this.h, true);
    this.body.setOffset(26, 25);

    this.flipX = true;
    this.canAttack = false;
    this.isAttacking = false;
    this.isDamaging = false;
    this.isDying = false;
    this.isBerserkMode = false;
    this.HP=2;
    this.checkCollisions()
  }

  createAnimation() {
    this.anims.create({
      key: "runEnemyAnim",
      frames: this.anims.generateFrameNumbers("runEnemy", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "deathEnemyAnim",
      frames: this.anims.generateFrameNumbers("deathEnemy", { start: 0, end: 22 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "attackEnemyAnim",
      frames: this.anims.generateFrameNumbers("attackEnemy", { start: 0, end: 11 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "hitEnemyAnim",
      frames: this.anims.generateFrameNumbers("hitEnemy", { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 0,
    });


    this.anims.create({
      key: "attackPlayerAnim",
      frames: this.scene.anims.generateFrameNumbers("attackPlayer", {
        start: 3,
        end: 6,
      }),
      frameRate: 15,
      repeat: 1,
    });
    this.anims.create({
      key: "runPlayerAnim",
      frames: this.anims.generateFrameNumbers("runPlayer", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hitPlayerAnim",
      frames: this.anims.generateFrameNumbers("hitPlayer", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "deathPlayerAnim",
      frames: this.anims.generateFrameNumbers("deathPlayer", { start: 0, end: 6 }),
      frameRate: 10,
      repeat: 0,
    });
  }

  seekAndDestroy(){

    this.setScale(1);
    this.body.setSize(25, 75, true);
    this.body.setOffset(100, 70); //tamaño del hitbox
    this.anims.play("runPlayerAnim");

    this.isBerserkMode = true;
    this.HP+=5;
    
  }

  checkCollisions(){
    this.attackCollider = this.scene.physics.add.overlap(this, this.player,()=>{
      
      if(!this.player.isInvencible){
        //console.log("Melee golpea Jugador")
        this.player.isInvencible = true;
        this.player.isHitted=true;
        //this.player.preFX.setPadding(32);
        //const damageGlow = this.player.preFX.addGlow(0xff0000,6,1,false,undefined,10); 
        this.player.coins -= 5
        if(this.player.coins<0){
          this.player.coins=0
        }
        this.scene.scoreText.text = `Score: ${this.player.coins}`

        this.scene.time.delayedCall(300, () => {
          this.player.isInvencible = false;
          this.player.isHitted=false;
          //this.player.preFX.remove(damageGlow)
        });
      }      
    })
    this.attackCollider.active = false
  }

  update(time, delta) {

    if(this.isBerserkMode && this.isDying){
      this.x += this.velocityX;
    }
    if(!this.isBerserkMode){
      this.x += this.velocityX;
    }else{
      if(this.x>=this.player.x+80 && !this.isAttacking){
        this.flipX = true;
        this.x += this.velocityX;
      }else if(this.x<=this.player.x-80 && !this.isAttacking){
        this.flipX = false;
        this.x -= this.velocityX;
      }
    }


    if(this.player.y >= 450 && !this.isDying && !this.isAttacking && ((this.x - 80) <= this.player.x && (this.x + 80) >= this.player.x)){
      this.isAttacking = true
      !this.isBerserkMode?this.body.setSize(60, 40, true):this.body.setSize(80, 75, true);
      !this.isBerserkMode?this.body.setOffset(this.flipX ? 0:20, 25):this.body.setOffset(!this.flipX ? 110:50,70);;
      this.anims.play(!this.isBerserkMode?"attackEnemyAnim":"attackPlayerAnim");//!FALTA CAMBIO DE ANIMACION CUANDO EL CLONE ES MAGO
      this.velocityX = -1;
      this.scene.time.delayedCall(900,()=>{
        this.attackCollider.active=true
      });
      this.scene.time.delayedCall(1200,()=>{
        this.attackCollider.active=false
      });
      this.scene.time.delayedCall(1500, () => {
        if (!this.isDying && (this.x-80)>0) {
          this.isAttacking = false
          if(this.isBerserkMode){
            this.body.setSize(25, 75, true);
            this.body.setOffset(100, 70);
          }else{
            this.body.setSize(this.w, this.h, true);
            this.body.setOffset(26, 25);
          }
          this.anims.play(!this.isBerserkMode?"runEnemyAnim":"runPlayerAnim");
          this.velocityX = -3;
        }
      });
    }

    //Destruir enemigo cuando sale de la pantalla y crear uno nuevo.
    if (this.x < 0 || this.x > this.scene.game.config.width) {
      this.scene.createGroundEnemy();
      this.destroy();
    }

  }//update
}

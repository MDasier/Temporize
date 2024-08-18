export default class Boss extends Phaser.GameObjects.Sprite {
  /* PARA LAS COLISIONES (EN SCENE)
    this.physics.add.collider(ATAQUEJUGADOR, [ENEMIGOS], function (ATAQUEJUGADOR, [ENEMIGOS]) {
        if(facil){
            ENEMIGO.play("HIT");
            ENEMIGO.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                ENEMIGO.destroy();
            });
        }else if(medio){
            hit++
            if(hit>=3){
                ENEMIGO.play("HIT");
                ENEMIGO.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                ENEMIGO.destroy();
                });
            }
        }else if(dificil){
            hit++
            if(hit>=5){
                ENEMIGO.play("HIT");
                ENEMIGO.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                ENEMIGO.destroy();
                });
            }
        }
    });
*/

  //! NECESITO EL TIMER PARA CONTROLAR ACCIONES (O RECIBIR EL TIEMPO DE JUEGO QUE QUEDA Y ORGANIZAR LA IA)
  constructor(scene, x, y, player, dificulty) {
    super(scene, x, y, "spriteBoss");
    this.sceneRef = scene;

    this.scene = scene;
    this.player = player;
    this.dificulty = 1; //dificulty
    this.HP = 10; //VIDA DEL BOSS (ya veremos como ajustamos valores y daño)
    this.speed = 0.1;
    this.setVisible(true);
    this.setDepth(1);
    //this.setTexture("spriteBoss");
    this.setPosition(x, y);
    this.setScale(3);
  
    this.velocityX = 0;
    this.velocityY = 0;
    this.amplitude = 3;
    this.frequency = 10;

    this.createAnimation = this.createAnimation.bind(this);
    this.createAnimation();
    this.anims.play("bossIdleAnim");
  }

  createAnimation() {
    this.anims.create({
      key: "bossIdleAnim",
      frames: this.anims.generateFrameNumbers("bossIdleSprite", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "bossDeathAnim",
      frames: this.anims.generateFrameNumbers("bossDeathSprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "bossAttack1Anim",
      frames: this.anims.generateFrameNumbers("bossAttack1Sprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossAttack2Anim",
      frames: this.anims.generateFrameNumbers("bossAttack2Sprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossFallAnim",
      frames: this.anims.generateFrameNumbers("bossFallSprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossRunAnim",
      frames: this.anims.generateFrameNumbers("bossRunSprite", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "bossHitAnim",
      frames: this.anims.generateFrameNumbers("bossHitSprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossJumpAnim",
      frames: this.anims.generateFrameNumbers("bossJumpSprite", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

  }

  //! FUNCIONES LOCAS DEL BOSS. necesitaré MUCHA ayuda. Estoy contanto con RNG total para esto
  //TODO Esto va en SCENE
  //? DIFÍCIL 3 -> todas
  //? MEDIO 2 -> godmode, callminion, cloneplayer, root, shootBeam, xyRay
  //? FÁCIL 1 -> callminion, cloneplayer, shootBeam, charge

  
  godMode() {
    //Añadir un escudo o algo que proteja al Boss
    this.anims.play("godMode"); //animacion blur?
  }

  callMinion() {
    let enemyAmount = Phaser.Math.Between(1, 5);
    let enemyTipe = Phaser.Math.Between(0, 1);
    return enemyAmount, enemyTipe;
  }

  clonePlayer() {
    //*Crear un enemigo Melee con el sprite que esté usando el player y le persiga
    //this.scene.cloneEnemy = new meleeEnemy(x,y,this.scene.player.texture);
    //*Añadir a la clase meleeEnemy un metodo que haga explotar al enemigo estando cerca del player
    //this.scene.cloneEnemy.seekAndDestroy();
  }

  root() {
    //Llamada a metodo 'root' de player durante 1*dificultad segundos
    this.scene.player.root(1500*this.dificulty)
  } 

  mirror() {
    //En funcion de la dificultad cambiar las teclas de direccion o la rotacion de pantalla en modo espejo.
  }   

  charge() {
    //Sprint del boss por la pantalla que arroya al player si no lo esquiva
  }

  xyRay() {
    //Un segundo de 'carga' de rayo y aviso para el jugador
    //Rayo que ocupa la parte baja o alta de la pantalla en horizontal
    //Rayo que ocupa la parte izquierda o derecha de la pantalla en vertical
  }

  fogOfWar(){
    this.scene.fogOfWar = true;
    this.scene.time.delayedCall(3000*this.dificulty, ()=>{this.scene.fogOfWar = false}, [], this);
  }

  debuffCoin() {
    this.scene.player.coins -= 1
  }  

  debuffDPS() {
    this.scene.player.damage = this.scene.player.damage/2
		this.scene.time.delayedCall(3000*this.dificulty, () => {this.scene.player.damage = this.scene.player.damage*2}, [], this);
  } 

  shootBeam() {
    //* Lo he copiado de 'FlyingEnemy'

    const beam = this.scene.add.sprite(this.x, this.y, "fire");
    beam.setScale(1);

    const player = this.scene.player;
    const beamSpeed = 800;

    this.scene.tweens.add({
      targets: beam,
      x: player.x,
      y: player.y,
      duration: beamSpeed,
      onComplete: () => {
        beam.destroy();
      },
    });

    this.scene.tweens.add({
      targets: beam,
      scaleX: 0.6,
      scaleY: 0.6,
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }

  bossDeath(){
    this.anims.play("bossDeathAnim");
    this.timedEvent = this.scene.time.delayedCall(5000, this.destroy, [], this);//!bugueado, bloquea datos del player
  }

  update(time, delta) {
    //CONTROL DE DAÑOS - Abria que controlar el GAME OVER
    /*if (this.HP <= 0){
      this.bossDeath()
    }*/

    //BOSS MIRANDO AL PLAYER SIEMPRE
    if(this.scene.player.x>=this.x){
      this.flipX=false
    }else{
      this.flipX=true
    }

    //MOVIMIENTO DEL BOSS
    if(!this.flipX && this.x>=50){
      this.x-=1.2
    }
    if(this.flipX && this.x<=this.scene.game.config.width-50){
      this.x+=1.2
    }
  }
}

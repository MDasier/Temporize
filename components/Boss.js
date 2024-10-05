import GroundEnemy from "../components/GroundEnemy.js";
import EnemyBeam from "./EnemyBeam.js";
export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "spriteBoss");

    this.scene = scene;
    this.dificulty = 1; //dificulty
    this.HP = 10; //VIDA DEL BOSS (ya veremos como ajustamos valores y daño)
    this.speed = 0.1;
    this.isInvencible=false
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

    this.fogOfWarOpaqueLvl = 0.9; // 0=transparente, 1=oscuro
    this.isFogOfWarActive = false;

    this.w = 40;
    this.h = 60;

    this.scene.physics.add.existing(this); 
    this.scene.add.existing(this); 
    this.body.setSize(this.w, this.h, true);
    this.body.setOffset(100, 45);

    this.body.setAllowGravity(false);

    this.groundEnemyClone = null;
  }

  createAnimation() {
    this.anims.create({
      key: "bossIdleAnim",
      frames: this.anims.generateFrameNumbers("idleBoss", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "bossDeathAnim",
      frames: this.anims.generateFrameNumbers("deathBoss", {
        start: 0,
        end: 6,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "bossAttack1Anim",
      frames: this.anims.generateFrameNumbers("attack1Boss", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossAttack2Anim",
      frames: this.anims.generateFrameNumbers("attack2Boss", {
        start: 4,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossFallAnim",
      frames: this.anims.generateFrameNumbers("fallBoss", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossRunAnim",
      frames: this.anims.generateFrameNumbers("runBoss", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "bossHitAnim",
      frames: this.anims.generateFrameNumbers("hitBoss", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "bossJumpAnim",
      frames: this.anims.generateFrameNumbers("jumpBoss", {
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

  //* category: attack
  callMinion() {
    let enemyAmount = Phaser.Math.Between(1, 5);
    let enemyTipe = Phaser.Math.Between(0, 1);
    return enemyAmount, enemyTipe;
  }

  //* category: attack
  clonePlayer() {
    //console.log(this.scene.groundEnemy)
    //*Crear un enemigo Melee con el sprite que esté usando el player y le persiga
    /*this.scene.groundEnemyClone = new GroundEnemy(500,450,this.scene.player);
    this.scene.add.existing(this.groundEnemyClone)*/
    //*Añadir a la clase meleeEnemy un metodo que haga explotar al enemigo estando cerca del player
    if(this.scene.groundEnemy && this.scene.groundEnemy.HP>0){
      this.scene.groundEnemy.seekAndDestroy();
    }else{
      this.scene.createGroundEnemy(true)
      this.scene.groundEnemy.seekAndDestroy();
    }
  }

  //* category: debuff
  root() {
    //Llamada a metodo 'root' de player durante 1*dificultad segundos
    this.scene.player.root(1500 * this.dificulty);
  }

  //* category: debuff
  mirror() {
    //En funcion de la dificultad cambiar las teclas de direccion o la rotacion de pantalla en modo espejo.
    this.scene.keys.A = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this.scene.keys.D = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );

    // const mirrorGlow = this.scene.add.sprite(this.x, this.y, "fire");
    this.scene.player.preFX.setPadding(32);
    const mirrowGlow = this.scene.player.preFX.addGlow(0xed3efa); // color,

    //  For PreFX Glow the quality and distance are set in the Game Configuration

    this.scene.tweens.add({
      targets: mirrowGlow,
      outerStrength: 6,
      innerStrength: 1,
      yoyo: true,
      loop: -1,
      ease: "sine.inout",
      duration: 200,
    });

    this.scene.time.delayedCall(
      3000 * this.dificulty,
      () => {
        this.scene.keys.A = this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.A
        );
        this.scene.keys.D = this.scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.D
        );

        // this.scene.tweens.remove()
        mirrowGlow.setActive(false);
      },
      [],
      this
    );
  }

  //* category: attack
  charge() {
    //Sprint del boss por la pantalla que arroya al player si no lo esquiva
    //?Si le ponemos brillo se ralentiza el juego :/
    //!añadir overlap del boss contra player
    // Define las posiciones para las animaciones
    const positionY1 = this.y; //Posición inicial y final en Y
    const positionX1 = this.x; //Posición inicial en X
    const positionX2 = positionX1>350?50:this.scene.game.config.width-50; // Posición final en X
    
    this.isInvencible=true//? Añadirlo a godmode() PRINCIPIOS SOLID CHICOS!
    //!godmode()
    this.anims.play("bossFallAnim");
    this.scene.tweens.add({
      targets: this,
      y: 380,
      duration: 1500,
      ease: 'sine.inout',
      onComplete: () => {
        this.anims.play("bossRunAnim");
          this.scene.tweens.add({
              targets: this,
              y: 380,
              x: positionX2, //Hasta donde va
              duration: 1500, //Duración de la animación
              ease: 'Power2', //Tipo de animacion
              onComplete: () => {
                this.anims.play("bossFallAnim");
                  this.scene.tweens.add({
                    targets: this,
                    y: positionY1, //volver al punto inicial en Y
                    x: positionX1, //Vuelve al punto inicial en X
                    duration: 2500, 
                    ease: 'Power2', 
                    onComplete: () => {
                      this.isInvencible=false
                      this.anims.play("bossIdleAnim");
                    }
                  });
              }
          });
      }
    });
  }

  //* category: attack
  rayOfDoom() {
    //Un segundo de 'carga' de rayo y aviso para el jugador
    //Rayo que ocupa la parte baja o alta de la pantalla en horizontal
    //Rayo que ocupa la parte izquierda o derecha de la pantalla en vertical
  }

  //* category: debuff
  fogOfWar() {
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;

    const rt = this.scene.make.renderTexture(
      {
        x: width / 2,
        y: height / 2,
        width,
        height,
      },
      !this.isFogOfWarActive
    );

    rt.fill(0x000000, this.fogOfWarOpaqueLvl);
    rt.draw(this.scene.ground);
    rt.draw(this.scene.platformGroup);
    rt.setDepth(1000); // Da profundidad para que todo esté oscuro

    // Crear un gráfico circular para usar como textura
    this.circleGraphics = this.scene.make.graphics({ x: 0, y: 0, add: false });
    this.circleGraphics.fillStyle(0xffffff, 1); //color y opacidad
    this.circleGraphics.fillCircle(50, 50, 50); // Radio del círculo (x,y,%radius)

    // Convertir el gráfico en una textura
    this.circleGraphics.generateTexture("vision", 100, 100);

    this.FOWvision = this.scene.make.image({
      x: this.scene.player.x,
      y: this.scene.player.y,
      key: "vision",
      add: false,
    });
    this.FOWvision.scale = 3;

    rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.FOWvision);
    rt.mask.invertAlpha = true;

    this.isFogOfWarActive = true;
    this.scene.time.delayedCall(
      3000 * this.dificulty,
      () => {
        this.isFogOfWarActive = false;
        rt.setVisible(false); // FOW 'desactivado'
      },
      [],
      this
    );
  }

  //* category: attack
  debuffCoin() {
    this.scene.scoreText.setStyle({ fill: '#800000'});
    this.scene.player.coins -= 10*this.dificulty;

    //!falta añadir alguna animacion al texto (tipo efecto combo en cualquier arcade/lucha)

    this.scene.time.delayedCall(
      3000 * this.dificulty,
      () => {
        this.scene.scoreText.setStyle({ fill: '#ffffff'});
      },
      [],
      this
    );

    
  }

  //* category: debuff
  debuffDPS() {
    this.scene.player.damage = this.scene.player.damage / 2;
    this.scene.time.delayedCall(
      3000 * this.dificulty,
      () => {
        this.scene.player.damage = this.scene.player.damage * 2;
      },
      [],
      this
    );
  }

  //* category: attack
  shootBeam() {
    this.scene.time.delayedCall(
      500,
      () => {
        new EnemyBeam(this.scene,this.x,this.y,"bossBeam",100,0.8,1000,50,50)
      },
      [],
      this
    );
    this.scene.time.delayedCall(
      1000,
      () => {
        new EnemyBeam(this.scene,this.x,this.y,"bossBeam",50,0.8,1000,50,50)
      },
      [],
      this
    );
  }

  death() {
    this.anims.play("bossDeathAnim");
    //TODO Después de la animación, se va a la pantalla de puntuación.
    //TODO en momento de la animación, meter algún efecto reshulón, parar spawn de bichos
     this.scene.player.coins*=5 //! Cambiar según pongamos precio items, cosas
        this.scene.scoreText.text = `Score: ${this.scene.player.coins}`


  }
  gameOver(){
     //TODO Después de la animación(de tu derrota/victoria maloso), se va a la pantalla de puntuación.
      this.scene.player.coins/=3 //! Cambiar según pongamos precio items, cosas
        this.scene.scoreText.text = `Score: ${this.scene.player.coins}`
  }
  checkIfDied(){
    if(this.HP <= 0){
      this.death()
      
    }else{
    this.gameOver()
    }
  }
  update(time, delta) {
    //CONTROL DE DAÑOS - Abria que controlar el GAME OVER
    //TODO hacer este check cuando falten entre 10 y 15 segundos del timer.
    /*if (this.HP <= 0){
      this.bossDeath()
    }*/

    //BOSS MIRANDO AL PLAYER SIEMPRE
    if (this.scene.player.x >= this.x) {
      this.flipX = false;
    } else {
      this.flipX = true;
    }

    //MOVIMIENTO DEL BOSS
    //TODO cambiar si se aleja o acerca dependiendo del tipo de jugador (melee o ranged)
    if (!this.flipX && this.x >= 50) {
      this.x -= 1.2;
    }
    if (this.flipX && this.x <= this.scene.game.config.width - 50) {
      this.x += 1.2;
    }
  }
}

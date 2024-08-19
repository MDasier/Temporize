import GroundEnemy from "../components/GroundEnemy.js";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "spriteBoss");

    this.scene = scene;
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

    this.fogOfWarOpaqueLvl = 0.9; // 0=transparente, 1=oscuro
    this.isFogOfWarActive = false;

    this.w = 40;
    this.h = 60;

    this.scene.physics.add.existing(this); //cargar el jugador a la scene
    this.scene.add.existing(this); //hitbox del jugador
    this.body.setSize(this.w, this.h, true);
    this.body.setOffset(100, 45); //tamaño del hitbox

    this.body.setAllowGravity(false);

    this.groundEnemyClone = null;
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

  //* category: attack
  callMinion() {
    let enemyAmount = Phaser.Math.Between(1, 5);
    let enemyTipe = Phaser.Math.Between(0, 1);
    return enemyAmount, enemyTipe;
  }

  //* category: attack
  clonePlayer() {
    //*Crear un enemigo Melee con el sprite que esté usando el player y le persiga
    /*this.scene.groundEnemyClone = new GroundEnemy(500,450,this.scene.player);
    this.scene.add.existing(this.groundEnemyClone)*/
    //*Añadir a la clase meleeEnemy un metodo que haga explotar al enemigo estando cerca del player
    if(this.scene.groundEnemy){
      this.scene.groundEnemy.seekAndDestroy();
    }else{
      this.groundEnemy = new GroundEnemy(this.scene, this.cameras.main.worldView.right, 450, this.scene.player)
      this.scene.groundEnemy.setVisible(true)
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
    ); // variable local para que no consuma recursos al terminar

    rt.fill(0x000000, this.fogOfWarOpaqueLvl);
    rt.draw(this.scene.ground);
    // rt.draw(this.scene.menuOpciones) //! descomentar cuando el boss lance el ataque y solo al estar en pause
    rt.draw(this.scene.platformGroup);

    rt.setDepth(1000); // para que los enemigos tambien se opaquen

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
        this.isFogOfWarActive = false; // el booleano ayuda a funcionalidades que dependen del FOW
        rt.setVisible(false); // remover el FOW actual
      },
      [],
      this
    );
  }

  //* category: attack
  debuffCoin() {
    this.scene.player.coins -= 1;
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

  death() {
    this.anims.play("bossDeathAnim");
    //TODO aqui se va a la pantalla de puntuación.
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

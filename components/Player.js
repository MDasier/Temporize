export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.isPlayerMovable = true;
    this.coins = 0;
    this.playerType=0;//0 para mago, 1 para caballero//!FALTA: hay que añadir el dato al crear el player
    this.isJumping = false;
    this.isInvencible = false;
    this.jumpCount = 0;
    this.isIdle=true;
    this.isHitted=false;

    this.scene.physics.add.existing(this); //cargar el jugador a la scene
    this.scene.add.existing(this); //hitbox del jugador
    this.setCollideWorldBounds(true); //limites para el jugador
    this.body.setSize(25, 75, true);
    this.body.setOffset(100, 70); //tamaño del hitbox

    this.createAnimation();
    this.anims.play("run");

    this.scene.cursors = this.scene.input.keyboard.createCursorKeys();
    //this.scene.keys = this.scene.input.keyboard.addKeys("z");
    this.scene.keys = {
      A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      E: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      Z: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      Q: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    };

    this.isAttacking = false;
    //this.scene.beamGroup = this.scene.physics.add.group()
  }

  playerInitialMove(){
    this.isInvencible=true
    this.isPlayerMovable=false
    // const mirrorGlow = this.scene.add.sprite(this.x, this.y, "fire");
    this.preFX.setPadding(32);
    const initialGlow = this.scene.player.preFX.addGlow(0xffffff); 

    this.scene.tweens.add({
      targets: initialGlow,
      outerStrength: 6,
      innerStrength: 1,
      yoyo: true,
      loop: -1,
      ease: "sine.inout",
      duration: 200,
    });

    // Configura la animación o el tween para que el jugador corra hacia la mitad de la pantalla
    this.scene.tweens.add({
      targets: this,
      x: 450, // Mueve al jugador a la posicion inicial
      duration: 3000, // Duración de la animación en milisegundos
      ease: 'Power2', // Tipo de easing
      onComplete: () => {
        initialGlow.setActive(false);
        
        this.isInvencible=false
        this.isPlayerMovable=true
      }
    });
  }

  root(delay) {
    this.isPlayerMovable = false;
    const mirrowGlow = this.scene.player.preFX.addGlow(0xdcdcdc);
    this.scene.tweens.add({
      targets: this,
      duration: delay, // Duración de la animación en milisegundos
      ease: 'Power2', // Tipo de easing
      onComplete: () => {
        mirrowGlow.setActive(false);
        this.isPlayerMovable=true
      }
    });
  }


  blockOrBlink() {
    const blockOrBlinkGlow = this.scene.player.preFX.addGlow(this.playerType==1?0x000000:0xffffff);
    this.isInvencible=true
    if(this.playerType==1){
      this.isPlayerMovable = false;
      this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.isInvencible=false
          this.isPlayerMovable = true;
          blockOrBlinkGlow.setActive(false);
        }
      });
    }
    if(this.playerType==0){
      this.scene.sound.play('magicSpell');
      this.scene.tweens.add({
        targets: this,
        x: this.x+=this.flipX?-250:250,
        y: this.y-=5,
        alpha: 0, // Reduce la opacidad a 0 para que parezca que desaparece
        scaleY: 0.5, // Reduce la altura a la mitad
        scaleX: 0.5, // Reduce la anchura a la mitad
        duration: 200, 
        ease: 'Power2', 
        onComplete: () => {          
          this.isInvencible=false
          this.setAlpha(1); // Restaura la opacidad
          this.setScale(1); // Restaura la escala       
          blockOrBlinkGlow.setActive(false);
        }
      });
    }
   
  }

  createAnimation() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers(this.texture, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("idlePlayer", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hit",
      frames: this.anims.generateFrameNumbers("hitPlayer", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jumpPlayer", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("attackPlayer", {
        start: 4,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: "jumpAttack",
      frames: this.scene.anims.generateFrameNumbers("attackPlayer", {
        start: 5,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });
  }

  update() {
    if (this.scene.isPaused) {
      this.anims.pause();
    }

    //* MOVIMIENTO LATERAL
    if(this.scene.keys.D.isDown && this.isPlayerMovable) {
      this.scene.player.setVelocityX(125);
      this.scene.player.flipX = false;
    }else if(this.scene.keys.A.isDown && this.isPlayerMovable) {
      this.scene.player.setVelocityX(-125);
      this.scene.player.flipX = true;
    }else{
      this.scene.player.setVelocityX(0);
    }

    //*SALTO Y DOBLE SALTO
    if(  (Phaser.Input.Keyboard.JustDown(this.scene.keys.W) || Phaser.Input.Keyboard.JustDown(this.scene.cursors.space)) &&
      this.isPlayerMovable && (this.jumpCount === 0 /*|| this.jumpCount === 1*/) ){
        this.jumpCount += 1;
        this.scene.player.setVelocityY(-450);
        this.anims.play("jump")
    }
    if(!this.body.touching.down && !this.isAttacking){
      this.anims.play("jump", true); //efecto caida
    }else if(!this.isAttacking){
        if(this.scene.boss){
          this.anims.play(this.scene.player.isHitted?"hit":this.scene.player.body.velocity.x==0?"idle":"run", true)
          //this.anims.play(this.scene.player.body.velocity.x==0?"idle":"run", true)
        }else{
          this.anims.play(this.scene.player.isHitted?"hit":"run", true)
          //this.anims.play(this.scene.player.body.velocity.x==0?"run":"run", true)//!hay que controlar mejor este ternario pero si no lo pongo la animacion de run se ralentiza cuando NO HAY BOSS
        }
    }

    if(this.body.touching.down && this.jumpCount!==0) {
      this.jumpCount = 0;
    }

    //* ATAQUES CON TECLADO
    if( (Phaser.Input.Keyboard.JustDown(this.scene.keys.Z) || Phaser.Input.Keyboard.JustDown(this.scene.keys.E)) && !this.isAttacking){
      this.isAttacking = true;
      
      //*Movemos al player cuando dispara si es mago y estamos en la fase final
      //if(this.scene.boss && this.scene.player.playerType==0){this.x -= this.flipX ? -35 : 35;}
      
      this.anims.play("attack", true).on("animationcomplete", () => {
        this.isAttacking = false;
      });

      const direction = this.flipX ? "left" : "right";
      const offsetX = this.flipX ? -90 : 90; // ajusta la posición de salida del disparo según la dirección
      this.scene.createBeam(this.x + (offsetX), this.y - 22, direction);
    }
    //console.log("HIT: "+this.isHitted)
  }//update()
}

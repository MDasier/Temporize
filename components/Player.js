export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.isPlayerMovable = true;
    this.coins = 0;
    this.isJumping = false;
    this.isInvencible = false;
    this.jumpCount = 0;
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
  root(delay) {
    this.isPlayerMovable = false;
    this.scene.time.delayedCall(
      delay,
      () => {
        this.isPlayerMovable = true;
      },
      [],
      this
    );
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
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("attack", {
        start: 4,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: "jumpAttack",
      frames: this.scene.anims.generateFrameNumbers("attack", {
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

    if (this.scene.cursors.right.isDown) {
      this.scene.player.setVelocityX(180);
      this.scene.player.flipX = false;
    } else if (this.scene.cursors.left.isDown) {
      this.scene.player.setVelocityX(-180);
      this.scene.player.flipX = true;
    } else {
      this.scene.player.setVelocityX(0);
    }

    // Movimiento lateral
    if (this.scene.keys.D.isDown && this.isPlayerMovable) {
      this.scene.player.setVelocityX(125);
      this.scene.player.flipX = false;
    } else if (this.scene.keys.A.isDown && this.isPlayerMovable) {
      this.scene.player.setVelocityX(-180);
      this.scene.player.flipX = true;
    } else {
      this.scene.player.setVelocityX(0);
    }

    //*SALTO Y DOBLE SALTO: No debería funcionar pero aquí estamos
    if (
      (Phaser.Input.Keyboard.JustDown(this.scene.keys.W) || Phaser.Input.Keyboard.JustDown(this.scene.cursors.space)) &&
      this.isPlayerMovable && (this.jumpCount === 0 /*|| this.jumpCount === 1*/)
    ) {
      this.jumpCount += 1;
      
      this.scene.player.setVelocityY(-450);
      this.anims.play("jump")
    }
     if (!this.body.touching.down && !this.isAttacking) {
      this.anims.play("jump", true); //efecto caida
      //this.canDoubleJump=true;
    } else {
      if (!this.isAttacking) {
        this.anims.play("run", true);
      }
      
    }
    if (this.body.touching.down && this.jumpCount!==0) {
      //this.isJumping = false;
      this.jumpCount = 0;
    }

    //*attack
    if (
      (Phaser.Input.Keyboard.JustDown(this.scene.keys.Z) || Phaser.Input.Keyboard.JustDown(this.scene.keys.E)) &&
      !this.isAttacking
    ) {
      this.isAttacking = true;
      this.x -= 35;
      this.anims.play("attack", true).on("animationcomplete", () => {
        this.isAttacking = false;
      });

      const direction = this.flipX ? "left" : "right";
      const offsetX = this.flipX ? -90 : 90; // ajusta la posición de salida del disparo según la dirección

      this.scene.createBeam(this.x + offsetX, this.y - 22, direction);

      if (direction === "left") {
        this.x += 70;
      }
    }
  }
}

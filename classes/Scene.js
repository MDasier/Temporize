class Scene extends Phaser.Scene {
  constructor() {
    super("level1"); //siempre se mantiene la estructura

    this.isPaused = false;
    this.player = null;
    this.platforms = null;
    this.cursors = null
  }
  //phaser tiene siempre 3 funciones

  //*********************** ASSETS-SPRITES/IMAGES ***********************
  preload() {
    //donde cargamos los assets
    this.load.image("background", "../img/background/mountain.png");
    this.load.image("platforms", ".//assets/grass.png"); //plataforma //TODO NO CARGA IMAGEN PORQUE NO EXISTE(REVISAR RUTA)
    this.load.spritesheet("player", "../img/mage/Run.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    }); //para añadir al jugador se t oman las medidas del sprite el ancho se divide por la cantidad de imagenes del personaje
  }

  //*********************** ELEMENTOS ***********************
  create() {
    //crea 1 sola vez

    this.createAnimations();

    //fondo siempre primero
    this.background = this.add.tileSprite(500, 200, 0, 350, "background");
    this.background.setScale(3.8);

    //plataformas
    this.createPlatforms();

    //jugador
    this.createPlayer();
    

    //teclas
    this.cursors = this.input.keyboard.createCursorKeys();

    //colisiones
    this.physics.add.collider(this.platforms, this.player); // detecta las colisiones

    //PAUSA
    this.createPauseButton();
  }

  //*********************** MOVIMIENTOS Y ACCIONES ***********************
  update() {
    //--------------------------------movimiento perpetuo del fondo-------descomentar-----

    // aqui va el timer
    // this.player.body.checkCollision.down = false;

    if (this.isPaused) {
      return; //--------controla el pause de las fisicas
    }

    this.background.tilePositionX += 0.5; //velocidad de fondo

    //le da movimientos y acciones
    this.playerActions();
    this.backgroundAnimationY();

    //limitar el movimiento para evitar salir de la pantalla
    //TODO por algun motivo el PJ spawnea fuera del background y claro, ya no puede moverse
    /* if (player.x<0){
        player.x = 0;
      }else if (player.x + player.width > this.background.width){
        player.x = this.background.width - player.width;
      } */
  }

  //*********************** FUNCCIONES DEL JUEGO ***********************
  playerActions() {
    if (this.cursors.right.isDown) {
      //teclas y velocidades
      this.player.setVelocityX(180);
      this.player.anims.play("caminar", true); //para los sprites
      this.player.flipX = false; //regula el giro del personaje
      //this.background.tilePositionX += 0.1 //---------------------------movimiento del fondo con las flechas
    } //console.log("presionando");
    else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-180);
      this.player.anims.play("caminar", true); //para los sprites
      this.player.flipX = true; //gira el personaje, hay que modificar hitbox
      //this.background.tilePositionX -= 0.1  //-------------movimiento del fondo con las flechas
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("detenido", true);
    }
    if (this.cursors.space.isDown && this.player.body.touching.down) {
      //salto
      this.player.setVelocityY(-450);
    }
  }

  backgroundAnimationY() {
    //Efecto 'PARALLAX' cuando nos movemos en vertical (Saltos)
    if (this.player.body.velocity.y > 0) {
      this.background.tilePositionY += 0.07;
    } else if (this.player.body.velocity.y < 0) {
      this.background.tilePositionY -= 0.07;
    }
  }

  createAnimations() {
    this.anims.create({
      key: "detenido",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 8 }), //------------animaciones detenido
      frameRate: 10,
      repeat: -1, // -1 significa que se repite para siempre
    });
    this.anims.create({
      key: "caminar",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 8 }), //animaciones caminando
      frameRate: 5,
      repeat: -1, // -1 significa que se repite para siempre
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup(); //hijos de platformas

    this.platforms
      .create(500, 400, "platforms")
      .setScale(1.5, 0.3)
      .setSize(150, 15)
      .setOffset(-25, 75); //escaladoo de plataformas
    this.platforms
      .create(700, 280, "platforms")
      .setScale(1.5, 0.3)
      .setSize(150, 15)
      .setOffset(-25, 75); //setsize y setoffset para modificar el hitbox
    this.platforms
      .create(500, 480, "platforms")
      .setScale(7.6, 0.3)
      .setSize(1000, 15)
      .setOffset(-480, 75);
    // this.platforms.setSize(20,20)
  }

  createPlayer() {
    this.player = this.physics.add.sprite(180, 450, "player");
    this.player.setScale(1); //escalar el jugador
    this.player.setSize(30, 80); //hitbox, modificando el debug de false a true en game para visualizarlo
    this.player.setOffset(100, 60); //para cuadrar dentro del hitbox
    this.player.setCollideWorldBounds(true); //colision con el borde

    //para remover las colisiones del jugador desde la derecha/izquierda y arriba
    //todo cambiar el remover colision del jugador a la plataforma
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
  }

  createPauseButton() {
    let pauseButton = this.add.text(this.cameras.main.centerX, 20, "Pause", {
      fontFamily: "comic-sans",
      fontSize: 20,
      fill: "white",
    });
    pauseButton.setInteractive({ useHandCursor: true }); //agrega evento onclick
    pauseButton.on("pointerdown", () => {
      if (this.isPaused) {
        this.resume(); //reanudar
      } else {
        this.pause(); //pausar
      }
    });
    this.pause = function () {
      //funcion para pausar
      this.physics.pause();
      this.anims.pauseAll();
      pauseButton.setText("Resume");
      this.isPaused = true;
    };
    this.resume = function () {
      //función reanudar
      this.physics.resume();
      this.anims.resumeAll();
      pauseButton.setText("Pause");
      this.isPaused = false;
    };
  }
}

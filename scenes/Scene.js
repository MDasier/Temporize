//variables timer
let warningAppeared = false;

class Scene extends Phaser.Scene {
  constructor() {
    super("level1"); //siempre se mantiene la estructura

    this.isPaused = false;
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.timer = 60;
    this.timerText = null;
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
  create(data) {
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
    //*TIMER
    //iniciar timer
    if (data.initialTimerValue) {
      this.initialTimerValue = data.initialTimerValue; //esto es para la logica de tiempo del boss.
      console.log(data.initialTimerValue);
      this.timer = this.initialTimerValue;
    }
    //texto del timer
    this.timerText = this.add.text(10, 10, "", {
      fontSize: "20px",
      fill: "#ffffff",
    });
    //inicia timer
    this.decrementTimer();
    this.time.addEvent({
      delay: 1000,
      callback: () => this.decrementTimer(),
      loop: true,
    });
  }

  decrementTimer() {
    if (this.timer > 0) {
      let minutes = Math.floor(this.timer / 60);
      let seconds = this.timer % 60;
      if (minutes > 59) {
        minutes = 59;
        seconds = 59;
      }
      this.timer -= 1;
      this.timerText.text = "Time:" + this.minutesTime(minutes, seconds);

      //calcular el tiempo restante para el boss
      let warningTime = this.initialTimerValue * 0.2;

      //tiempo restante para el aviso del boss.
      if (this.timer <= warningTime && !warningAppeared) {
        this.showBossWarning();
        warningAppeared = true;
        console.log("se te van a quemar las lentejas como sigas así");
      }
    } else {
      console.log("Se acabó el tiempo");
      this.time.removeAllEvents();
    }
  }

  showBossWarning() {
    let warningBossText = this.add.text(
      this.cameras.main.centerX,
      70,
      "Boss Approaching!",
      { fontSize: "40px", fill: "#ff0000", textAlign: "center" }
    );
    warningBossText.setOrigin(0.5, 0.5);
    this.time.addEvent({
      delay: 5000,
      callback: () => warningBossText.destroy(),
    });
  }
  minutesTime(minutes, seconds) {
    let minuteString = minutes.toString().padStart(2, "0");
    let secondString = seconds.toString().padStart(2, "0");
    return minuteString + ":" + secondString;
  }

  //*********************** MOVIMIENTOS Y ACCIONES ***********************
  update() {
    //--------------------------------movimiento perpetuo del fondo-------descomentar-----

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

      //oscuridad en la pantalla cuando se pause.
      this.pauseOverlay = this.add.rectangle(2, 2, 2, 2, 0x000000, 0.5);
      this.pauseOverlay.setScale(
        this.cameras.main.width,
        this.cameras.main.height
      );
      this.pauseOverlay.setDepth(1000);

      const pauseAnimation = {
        targets: pauseButton,
        alpha: { from: 1, to: 0.5 },
        duration: 800,
        yoyo: true, //hace que la animacions e repita en sentido inverso, le da mas fluidez
        repeat: -1,
      };

      //animación para que Resume parpadee
      this.tweens.add(pauseAnimation);

      //*PRUEBAS PARA EL MENU EN PAUSA
      //menu = new Menu(this.scene)
      this.menuOpciones = this.add.sprite(500, 350, "background");
      this.menuLabel = this.add.text(370, 200, "OPCIONES MENU", {
        font: "30px Arial",
        fill: "#fff",
      });
      this.menu1 = this.add.text(390, 250, "MENU 1", {
        font: "30px Arial",
        fill: "#fff",
      });
      this.menu2 = this.add.text(390, 300, "MENU 2", {
        font: "30px Arial",
        fill: "#fff",
      });
      this.menu3 = this.add.text(390, 350, "EXIT", {
        font: "30px Arial",
        fill: "#fff",
      });
      this.menu1.setInteractive({ useHandCursor: true });
      this.menu1.on("pointerdown", () => {
        console.log("MENU 1 CLICK");
      });
      this.menu2.setInteractive({ useHandCursor: true });
      this.menu2.on("pointerdown", () => {
        console.log("MENU 2 CLICK");
      });
      this.menu3.setInteractive({ useHandCursor: true });
      this.menu3.on("pointerdown", () => {
        console.log("EXIT CLICK");
        this.resume()
        this.scene.start("initialScene");
      });
    };

    this.resume = function () {
      //función reanudar
      this.physics.resume();
      this.anims.resumeAll();
      pauseButton.setText("Pause");
      this.isPaused = false;

      //quitar elementos de pausa.
      this.pauseOverlay.destroy();
      this.pauseAnimation = null;
      //con destroy da fallo y se queda en gris la "pausa"

      //*PRUEBAS PARA EL MENU EN PAUSA
      //eliminamos el menu y el label
      this.menuOpciones.destroy();
      this.menu1.destroy();
      this.menu2.destroy();
      this.menu3.destroy();
      this.menuLabel.destroy();
    };
  }
}

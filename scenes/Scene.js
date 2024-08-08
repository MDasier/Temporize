import PlatformGroup from "../components/PlatformGroup.js";
import Platform from "../components/PlatformGroup.js";
import Player from "../components/Player.js";
import FlyingEnemy from "../components/FlyingEnemy.js";
import Beam from "../components/beam.js";
//variables timer
let warningAppeared = false;

export default class Scene extends Phaser.Scene {
  constructor() {
    super("level1"); //siempre se mantiene la estructura

    this.isPaused = false;
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.timer = 60;
    this.timerText = null;
    this.floor = null;
   
  }

  //*********************** ASSETS-SPRITES/IMAGES ***********************
  preload() {
    //donde cargamos los assets
    this.load.image("background", "../img/background/mountain.png");
    this.load.image("platform", ".//assets/grass.png"); //plataforma //TODO NO CARGA IMAGEN PORQUE NO EXISTE(REVISAR RUTA)
    this.load.spritesheet("player", "../img/mage/Run.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    }); //para añadir al jugador se t oman las medidas del sprite el ancho se divide por la cantidad de imagenes del personaje
    this.load.spritesheet("jump", "../img/mage/Jump.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    });
    this.load.spritesheet("attack", "../img/mage/Attack2.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    });
    this.load.image("beam", "../img/mage/beam.png", {
      frameWidth: 127,
      frameHeight: 123,
    });
    this.load.spritesheet("flyingEnemy", "../img/enemies/reaperbot.png", {
      frameWidth: 384 / 9,
      frameHeight: 43,
    });
    /* this.load.image("flyingEnemy", "../img/enemies/beholder.png");*/
    this.load.image("fire","../img/enemies/ball.png",{
      frameWidth: 92,
      frameHeight: 211
    })
  } 

  //*********************** ELEMENTOS ***********************
  create(data) {

    //fondo siempre primero
    this.background = this.add.tileSprite(500, 200, 0, 350, "background");
    this.background.setScale(3.8);

    //plataformas
    this.createPlatforms();

    //jugador
    this.player = new Player(this, 450, 250, "player");

    //flying enemy
    this.createFlyingEnemy();

    //console.log("Enemigo agregado correctamente");

    //colisiones
    this.physics.add.collider(this.platforms, this.player); // detecta las colisiones
    

    //disparos!!
    this.beamGroup = this.physics.add.group();

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
    //********ground *///****************************************** */
  this.ground=this.physics.add.staticGroup()
  this.ground.create(500,550,"ground")
  .setScale(50,1)
  .setSize(1100)
  .setOffset(-500,0)
  this.physics.add.collider(  this.ground,this.player)
  }
  

  // //crear disparos reutilizables
  // createBeam(x, y, gravity, speed) {
  //   const beam = new Beam(this, x, y, "beam", 0, gravity, speed);
  //   console.log(gravity);
  //   console.log(speed);

  //   this.beamGroup.add(beam);
  //   //this.physics.add.existing(this.beamGroup)
  // }
//------------------------------------parametros del beam funcionales-------
  createBeam(x, y, direction) {
    // crea un nuevo beam en la escena usando los parametros establecidos en la clase 
    const beam = new Beam(this, x, y, 'beam', direction === 'left',1000,1,1000,25,20);
    this.beamGroup.add(beam);
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
  update(time, delta) {

    const camera = this.cameras.main;
    const cameraBounds = camera.worldView;
    const enemyPosition = this.flyingEnemy.getCenter();

    this.player.update();

    if (this.isPaused) {
      return; //--------controla el pause de las fisicas
    }
//------------------------actualiza los diferentes beams---------
    this.beamGroup.getChildren().forEach(beam => {
      beam.update();
  });

    //le da movimientos y acciones AL FONDO
    this.background.tilePositionX += 0.5; //velocidad de fondo
    this.backgroundAnimationY();

    this.platforms.movePlatforms();
    if (this.flyingEnemy) {
      this.flyingEnemy.update(time, delta);
    }


  }//cierre update

  backgroundAnimationY() {
    //Efecto 'PARALLAX' cuando nos movemos en vertical (Saltos/Gravedad)
    if (this.player.body.velocity.y > 0) {
      this.background.tilePositionY += 0.07;
    } else if (this.player.body.velocity.y < 0) {
      this.background.tilePositionY -= 0.07;
    }
  }

  createPlatforms() {
    //this.platforms = this.physics.add.staticGroup(); //hijos de platformas
    this.platforms = new PlatformGroup(this);
    // this.platforms.createPlatform(
    //   -1,
    //   this.game.config.height - 10,
    //   "ground",
    //   this.game.config.width,
    //   1
    // );
    this.platforms.createPlatform(110, 250, "platform", 5, 0.5);
    this.platforms.createPlatform(680, 320, "platform", 6, 0.5);
    this.platforms.createPlatform(380, 420, "platform", 6, 0.5);

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.platforms.createPlatform(
          this.game.config.width,
          450,
          "platform",
          5,
          0.5
        );
        console.log("plataforma creada")
        console.log(this.keys)
      },
      loop: true,
    });
  }

  createFlyingEnemy() {
    const camera = this.cameras.main;
    const x = camera.worldView.right;
    /* const minX = camera.worldView.x + 100; //dejar margen de 100 pixeles borde izq.
    const maxX = camera.worldView.right - 100; */
    const minY = camera.worldView.y + 100; //lo mismo borde superior
    const maxY = camera.worldView.bottom - camera.worldView.height /2; //mitad pantalla

    let y;
    do {
     /*  x = Phaser.Math.Between(minX, maxX); */
      y = Phaser.Math.Between(minY, maxY);
    } while (!this.isWithinCameraBounds(x, y, camera));

    this.flyingEnemy = new FlyingEnemy(this, x, y, this.player);
    this.add.existing(this.flyingEnemy);

    this.flyingEnemy.setVisible(true);

    this.flyingEnemy.alpha = 1;

    //TODO destruir el enemigo y crear otro en otra parte aleatoria

    //TODO limitar la creación aleatoria a mitad de pantalla hacia arriba
  }
  isWithinCameraBounds(x, y, camera) {
    return (
      x >= camera.worldView.x &&
      x <= camera.worldView.right &&
      y >= camera.worldView.y &&
      y <= camera.worldView.bottom
    );
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
        this.resume();
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

import PlatformGroup from "../components/PlatformGroup.js";
import Platform from "../components/PlatformGroup.js";
import Player from "../components/Player.js";
import FlyingEnemy from "../components/FlyingEnemy.js";
import Beam from "../components/beam.js";
import Boss from "../components/Boss.js";
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
    this.fogOfWar=false;
  }

  //*********************** ASSETS-SPRITES/IMAGES ***********************
  preload() {

    this.load.image("background", "../img/background/mountain.png");
    this.load.image("platform", ".//assets/grass.png"); //plataforma //TODO Necesitamos imagen para las plataformas

    //JUGADOR
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

    //DISPARO
    this.load.image("beam", "../img/mage/beam.png", {
      frameWidth: 127,
      frameHeight: 123,
    });

    //ENEMIGO RANGO
    this.load.spritesheet("flyingEnemy", "../img/enemies/reaperbot.png", {
      frameWidth: 384 / 9,
      frameHeight: 43,
    });
    this.load.image("fire","../img/enemies/ball.png",{
      frameWidth: 92,
      frameHeight: 211
    })

    //BOSS
    this.load.spritesheet("bossIdleSprite", "../img/bossOne/Idle.png", {
      frameWidth: 1999 /8,
      frameHeight: 105,
    });
    this.load.spritesheet("bossDeathSprite", "../img/bossOne/Death.png", {
      frameWidth: 1999 /8,
      frameHeight: 105,
    });
    this.load.spritesheet("bossRunSprite", "../img/bossOne/Run.png", {
      frameWidth: 2000 /8,
      frameHeight: 73,
    });    
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

    //boss
    this.boss = new Boss(this,this.cameras.main.worldView.right-150,200,this.player,1);
    this.add.existing(this.boss);
    //this.boss.setVisible(true);

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
      //console.log(data.initialTimerValue);
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


    //!RENDER-TEXTURE
    //const width = this.scale.width
    //const height = this.scale.height
    const width = this.cameras.main.worldView.right*2//TODO hay que conseguir el tamaño exacto de la pantalla de juego, no sé por que no lo pilla
    const height = this.cameras.main.worldView.bottom*2

    // make a RenderTexture that is the size of the screen
    this.rt = this.make.renderTexture({
      width,
      height
    }, !this.fogOfWar)

    // fill it with black
    this.rt.fill(0x000000, 0.95)//0=transparente, 1=oscuro
    //TODO hay que añadir plataformas, enemigos, boss etc al RenderTexture
    this.rt.draw(this.ground)
    this.rt.draw(this.menuOpciones)
    this.rt.draw(this.platformGroup)
    this.rt.draw(this.boss)

    // set a dark blue tint
    this.rt.setTint(0x0a2948)

   // Crear un gráfico circular para usar como textura
    this.circleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    this.circleGraphics.fillStyle(0xffffff, 1);//color y opacidad
    this.circleGraphics.fillCircle(50, 50, 50); // Radio del círculo (x,y,%radius)
    // Convertir el gráfico en una textura
    this.circleGraphics.generateTexture('vision', 100, 100);

    this.vision = this.make.image({
      x: this.player.x,
      y: this.player.y,
      key: 'vision',
      add: false
    })
    this.vision.scale = 3

    this.rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision)
    this.rt.mask.invertAlpha = true
  }
  
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
    this.vision.x = this.player.x;
    this.vision.y = this.player.y;

    if (this.isPaused) {
      return; //--------controla el pause de las fisicas
    }
//------------------------actualiza los diferentes beams---------
    this.beamGroup.getChildren().forEach(beam => {
      beam.update();
  });

    //MOVIMIENTO Y 'ACCION' DEL FONDO
    this.background.tilePositionX += 0.5; //velocidad de fondo
    this.backgroundAnimationY();

    //MOVIMIENTO DE PLATAFORMAS
    this.platforms.movePlatforms();

    //ACCION DEL ENEMIGO VOLADOR
    if (this.flyingEnemy) {
      this.flyingEnemy.update(time, delta);
    }
    //ACCION DEL BOSS
    if(this.boss){
      this.boss.update(time, delta);
    }

    //ACTIVAR Y DESACTIVAR EL 'FOG OF WAR'
    if(this.fogOfWar){
      this.rt.setVisible(true)
      this.rt.setDepth(1000);
      this.rt.fill(0x000000, 0.95)
    }else{
      this.rt.setVisible(false)
      //this.rt.clear()
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
      this.menu2 = this.add.text(390, 300, "FOG OF WAR TEST", {
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
        this.boss.fogOfWar();
        this.resume();
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

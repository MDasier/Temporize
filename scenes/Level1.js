import PlatformGroup from "../components/PlatformGroup.js";
import Platform from "../components/PlatformGroup.js";
import Player from "../components/Player.js";
import FlyingEnemy from "../components/FlyingEnemy.js";
import Beam from "../components/Beam.js";
import Boss from "../components/Boss.js";
import GroundEnemy from "../components/GroundEnemy.js";
import MageBeam from "../components/MageBeam.js";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super({key: "level1"}); //siempre se mantiene la estructura

    this.isPaused = false;//para control de puntos en 'pausa'
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.timer = 60;//Tiempo total de juego fijo para pruebas
    this.timerText = null;
    this.scoreText = null;
    this.floor = null;

    this.flyingEnemy;
    this.groundEnemy;
  }

  //*********************** ASSETS-SPRITES/IMAGES ***********************
  preload() {

    this.load.image("background", "../img/background/mountain.png");
    this.load.image("platform", "../img/platforms/platform4.png",{
      frameHeight: 60,
      frameWidth: 120
    }); 

    //JUGADOR
    this.load.spritesheet("player", "../img/mage/Run.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    }); //para añadir al jugador se toman las medidas del sprite el ancho se divide por la cantidad de imagenes del personaje
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

    //DISPARO BOSS
    this.load.image("bossBeam", "../img/bossOne/bossBeam.png", {
      frameWidth: 56,
      frameHeight: 71,
    });

    //ENEMIGO RANGO
    this.load.spritesheet("flyingEnemy", "../img/enemies/0-beholder.png", {
      frameWidth: 100 / 1,
      frameHeight: 86,
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
    this.load.spritesheet("bossAttack1Sprite", "../img/bossOne/Attack1.png", {
      frameWidth: 1874 /8,
      frameHeight: 149,
    });
    this.load.spritesheet("bossAttack2Sprite", "../img/bossOne/Attack2.png", {
      frameWidth: 1820 /8,
      frameHeight: 154,
    });
    this.load.spritesheet("bossDeathSprite", "../img/bossOne/Death.png", {
      frameWidth: 1999 /8,
      frameHeight: 105,
    });
    this.load.spritesheet("bossRunSprite", "../img/bossOne/Run.png", {
      frameWidth: 2000 /8,
      frameHeight: 73,
    });
    
    // GROUND ENEMY
    this.load.spritesheet("groundEnemyIdle", "../img/enemies/ground-enemy-idle.png", {
      frameWidth: 720 / 9,
      frameHeight: 80,
    });
    this.load.spritesheet("groundEnemyRun", "../img/enemies/ground-enemy-run.png", {
      frameWidth: 480 / 6,
      frameHeight: 80,
    });
    this.load.spritesheet("groundEnemyAttack", "../img/enemies/ground-enemy-attack.png", {
      frameWidth: 960 / 12,
      frameHeight: 80,
    });
    this.load.spritesheet("groundEnemyHit", "../img/enemies/ground-enemy-hit.png", {
      frameWidth: 400 / 5,
      frameHeight: 80,
    });
    this.load.spritesheet("groundEnemyDeath", "../img/enemies/ground-enemy-death.png", {
      frameWidth: 1840 / 23,
      frameHeight: 80,
    });
  } 

  //*********************** ELEMENTOS ***********************
  create(data) {
    window.addEventListener('contextmenu', function (e) {
      e.preventDefault(); // Esto evita que aparezca el menú contextual
    });
    
    //fondo siempre primero
    this.background = this.add.tileSprite(500, 200, 0, 350, "background");
    this.background.setScale(3.8);
    
    //********ground *///****************************************** */
    this.ground=this.physics.add.staticGroup()
    this.ground.create(500,550,"ground")
    .setScale(50,1)
    .setSize(1100)
    .setOffset(-500,0)
    
    //plataformas
    this.createPlatforms();
    
    //jugador
    //this.player = new Player(this, 450, 250, "player");//Así iniciabamos el player antes
    this.player = new Player(this, -50, 250, "player");//Ahora creamos el player "fuera de la pantalla" para que aparezca corriendo
    //!Hay que añadir control de invulnerabilidad etc
    this.player.playerInitialMove()//Animacion inicial para que el player aparezca corriendo desde fuera

    //?refix-asier: creo que he solucionado el error que salia en consola.
    //!FALTA PROBARLO
    //flying enemy
    this.createFlyingEnemy();
   

    //ground enemy
    this.createGroundEnemy();
    
    //disparos!!
    this.beamGroup = this.physics.add.group();
    
    //PAUSA
    this.createPauseButton();    
    
    this.addColliders()
    this.initializateScore()
    this.initializateTimer(data)
    
    //*Eventos del raton
    this.input.on('pointerdown', function (pointer) {
      if (pointer.leftButtonDown()) {
        //Guardamos la posicion donde hemos clicado.
          //this.scene.player.shotX=pointer.x 
          //this.scene.player.shotY=pointer.y
          if(this.scene.player.playerType==0 && this.scene.player.isPlayerMovable){
            //CREAR DISPARO DEL MAGO
            const offsetX = this.scene.player.flipX ? -90 : 90; // ajusta la posición de salida del disparo según la dirección
            this.scene.createMageBeam(this.scene.player.x + offsetX, this.scene.player.y - 22, this.scene.player.flipX ? "left" : "right",pointer.x,pointer.y);
            /*const mageBeam=new MageBeam(this,this.scene.player.x,this.scene.player.y,"beam",10,0.8,1000,50,50)
            mageBeam.fire(this.scene.player.x,this.scene.player.y,pointer.x,pointer.y)*/
          }
          

      } else if (pointer.rightButtonDown()) {
        if(this.scene.player.isPlayerMovable){
          this.scene.player.blockOrBlink()
        }
      }
    });

  }//create

  bossAppear(){
    this.boss = new Boss(this,this.cameras.main.worldView.right-150,200,this.player,1);
    //this.boss.METODOATAQUE()//PARA PROBAR ATAQUES DIRECTAMENTE
  }

  initializateTimer(data){
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
  }

  initializateScore(){
    this.scoreText = this.add.text(this.game.config.width-150, 10, "Score:0", {
      fontSize: "20px",
      fill: "#ffffff",
    });
  }

  addColliders() {
    // colisiones estaticas
    this.physics.add.collider(this.ground, this.player)
    this.physics.add.collider(this.platforms, this.player); // detecta las colisiones

    //TODO mejorar grupo de beams y enemigos para hacer el collider aqui.
  }

  createBeam(x, y, direction) {
    const beam = new Beam(this, x, y, 'beam', direction === 'left',1000,1,1000,25,20);
    this.beamGroup.add(beam);
  }
  createMageBeam(x, y, direction,pointerX,pointerY) {
    const mageBeam = new MageBeam(this, x, y, 'beam', direction === 'left',1500,1,500,25,20,pointerX,pointerY);
    this.beamGroup.add(mageBeam);
  }

  decrementTimer() {
    if (this.timer > 0) {
      let minutes = Math.floor(this.timer / 60);
      let seconds = this.timer % 60;

      //! CONTROL DE LA IA DEL BOSS - ATAQUES     
      if(this.timer>6&&seconds%3==0&&this.boss){//Probando cada 3 segundos
        
        this.bossSkillsArr = [
          this.boss.shootBeam,
          this.boss.clonePlayer,
          this.boss.root,
          this.boss.mirror,
          this.boss.charge,
          this.boss.fogOfWar,
          this.boss.debuffCoin,
          this.boss.debuffDPS
        ];
        let rngBossSkill = Phaser.Math.Between(0, this.bossSkillsArr.length - 1);
        //! PARA HACER PRUEBAS this.bossSkillsArr[x].call(this.boss)
        //this.bossSkillsArr[0].call(this.boss)

        if(rngBossSkill==0){
          this.boss.body.setSize(this.boss.w+50, this.boss.h+5, true);
          this.boss.body.setOffset(150, 50);

          this.bossSkillsArr[rngBossSkill].call(this.boss)
          //!ME GUSTARIA HACER UNA SEGUNDA LLAMADA PARA QUE PAREZCA QUE SUELTA FANTASMAS QUE TE SIGUEN
          //*QUIERO COPIAR/MODIFICAR EL CODIGO DEL ENEMYBEAM PARA QUE EN ESTE CASO PAREZCA UN FANTASMA QUE TE SIGUE Y EXPLOTA
          this.boss.anims.play("bossAttack2Anim").on("animationcomplete", () => {
            this.boss.anims.play("bossIdleAnim");
            this.boss.body.setSize(this.boss.w, this.boss.h, true);
            this.boss.body.setOffset(100, 45);
          });
        }else if(rngBossSkill==6||rngBossSkill==7){

          this.boss.body.setSize(this.boss.w+50, this.boss.h+5, true);
          this.boss.body.setOffset(150, 50);
          this.bossSkillsArr[rngBossSkill].call(this.boss)
          this.boss.anims.play("bossAttack1Anim").on("animationcomplete", () => {
            this.boss.anims.play("bossIdleAnim");
            this.boss.body.setSize(this.boss.w, this.boss.h, true);
            this.boss.body.setOffset(100, 45);
          });
        }else{this.bossSkillsArr[rngBossSkill].call(this.boss)}
      }
      

      if(seconds%5==0){
        this.player.coins+=10
        this.scoreText.text = `Score: ${this.player.coins}`
      }
      if(minutes===0 && seconds === 50){//! Modificarlo a 2
        this.bossAppear()
      }
      if(minutes===0 && seconds === 9){
        this.boss.checkIfDied()

      }
      if (minutes > 59) {
        minutes = 59;
        seconds = 59;
      }
      this.timer -= 1;
      this.timerText.text = "Time:" + this.minutesTime(minutes, seconds);

     

      //tiempo restante para el aviso del boss.
      if (minutes===2 && seconds ===10) {
        this.showBossWarning();
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
    //const cameraBounds = camera.worldView;
    //const enemyPosition = this.flyingEnemy.getCenter();

    this.player.update();
    
    if (this.boss && this.boss.FOWvision) {
      this.boss.FOWvision.x = this.player.x;
      this.boss.FOWvision.y = this.player.y;
    }

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

    //ACCION DEL ENEMIGO GROUND
    if (this.groundEnemy) {
      this.groundEnemy.update(time, delta)

    }
    //ACCION DEL BOSS
    if(this.boss){
      this.boss.update(time, delta);
    }

  }//cierre update

  backgroundAnimationY() {
    this.initialBackgroundPositionY = this.initialBackgroundPositionY || this.background.tilePositionY
    const upperLimit = this.initialBackgroundPositionY - 5
    const lowerLimit = this.initialBackgroundPositionY + 5
    //Efecto 'PARALLAX' cuando nos movemos en vertical (Saltos/Gravedad)
    if (this.player.body.velocity.y > 0) {
      this.background.tilePositionY = Math.min(this.background.tilePositionY + 0.07, lowerLimit)
    } else if (this.player.body.velocity.y < 0) {
      this.background.tilePositionY = Math.max(this.background.tilePositionY - 0.07, upperLimit)
    }else if(this.player===this.player.body.velocity.y){ this.background.tilePositionY += (this.initialBackgroundPositionY - this.background.tilePositionY) * 0.1}
  }

  createPlatforms() {
    
    this.platforms = new PlatformGroup(this);
    this.platforms.createPlatform(110, 250, "platform", 0.8, 0.3);
    this.platforms.createPlatform(680, 320, "platform", 0.8, 0.3);
    this.platforms.createPlatform(380, 420, "platform", 0.8, 0.3);

    this.platformEvent = this.time.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: () => {
        this.platforms.createPlatform(
          this.game.config.width,
          Phaser.Math.Between(this.game.config.height/2, this.game.config.height - 50),
          "platform",
          0.8,
          0.3,
        );
      },
      loop: true,
    });
  }

  createFlyingEnemy() {
    //console.log("enemy appear")
    const camera = this.cameras.main;
    const x = camera.worldView.right;
    /* const minX = camera.worldView.x + 100; //dejar margen de 100 pixeles borde izq.
    const maxX = camera.worldView.right - 100; */
    const minY = camera.worldView.y + 100; //lo mismo borde superior
    const maxY = camera.worldView.bottom - camera.worldView.height /2; //mitad pantalla

    let y = Phaser.Math.Between(minY, maxY);

    this.flyingEnemy = new FlyingEnemy(this, x, y, this.player);
    this.add.existing(this.flyingEnemy);

    // this.flyingEnemy.setVisible(true);

    // this.flyingEnemy.alpha = 1;
  }

  createGroundEnemy() {
    const x = this.cameras.main.worldView.right;

    this.groundEnemy = new GroundEnemy(this, x, 450, this.player);
    this.physics.add.collider(this.ground, this.groundEnemy)
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
          //this.pause(); //pausar
          this.cameras.main.fadeOut(500, 0, 0, 0)
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            //? Todas las escenas están creadas, switch solo las intercambia de posicion. Muestra la escena a la que se le hace referencia.
            this.scene.switch('menu')
            this.cameras.main.fadeIn(500, 0, 0, 0)
          //!hay que controlar en que momento estamos clicando en 'START GAME'. Si es la primera vez deberia llevarnos a 'initialScene' y si no a 'level1'  
          })
          
        }
      });

      this.pause = function () {
        //DESACTIVAR TECLADO
        //PLAYER INMUNE
        //PARAR ANIMACIONES DE ENEMIGOS Y BOSS


        //funcion para pausar
        this.physics.pause();
      
        this.anims.pauseAll();
  
        this.platformEvent.paused = true;

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


      this.resume = function () {
        //función reanudar
        this.physics.resume();
        this.anims.resumeAll();

        this.platformEvent.paused = false;

        pauseButton.setText("Pause");
        this.isPaused = false;

        //quitar elementos de pausa.
        this.pauseOverlay.destroy();
        this.pauseAnimation = null;
        //con destroy da fallo y se queda en gris la "pausa"
      };
    }
  }
}
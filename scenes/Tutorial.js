import PlatformGroup from "../components/PlatformGroup.js";
import Player from "../components/Player.js";
import FlyingEnemy from "../components/FlyingEnemy.js";
import Beam from "../components/Beam.js";
import Boss from "../components/Boss.js";
import GroundEnemy from "../components/GroundEnemy.js";
import MageBeam from "../components/MageBeam.js";

export default class Store extends Phaser.Scene {
  constructor(scene) {
    super({ key: "tutorial" });

    this.isPaused = false;//para control de puntos en 'pausa'
    this.player = null;
    this.platforms = null;
    this.cursors = null;
    this.timer = 60;//Tiempo total de juego fijo para pruebas
    this.timerText = null;
    this.scoreText = null;
    this.floor = null;
    this.playerH=75

    this.flyingEnemy;
    this.endPoint;
    this.currentSongTime;
    this.canCreateFlyingEnemy=true;
  }

  preload() {
    //FONDO
    this.load.image("background", "./src/img/background/mountain.png");
    this.load.image("platform", "./src/img/platforms/platform4.png",{
      frameHeight: 60,
      frameWidth: 120
    });

    //PRUEBA ENDPOINT
    this.load.image("arrowTemp", "./src/img/arrowTemp.png");
    this.load.image("arrowGreen", "./src/img/arrowGreen.png");

    //JUGADOR
    this.load.spritesheet("runPlayer", "./src/img/mage/Run.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    }); 
    this.load.spritesheet("jumpPlayer", "./src/img/mage/Jump.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    });
    this.load.spritesheet("attackPlayer", "./src/img/mage/Attack2.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    });
    this.load.spritesheet("idlePlayer", "./src/img/mage/Idle.png", {
      frameWidth: 1386 / 6,
      frameHeight: 190,
    });
    this.load.spritesheet("hitPlayer", "./src/img/mage/Hit.png", {
      frameWidth: 924 / 4,
      frameHeight: 190,
    });
    this.load.spritesheet("deathPlayer", "./src/img/mage/Death.png", {
      frameWidth: 1617 / 7,
      frameHeight: 190,
    }); 

    //DISPARO
    this.load.image("beamPlayer", "./src/img/mage/beam.png", {
      frameWidth: 127,
      frameHeight: 123,
    });

  
    //SKILL COOLDOWN
    this.load.image("skillCd", "./src/img/skillCd.png", {
      frameWidth: 130,
      frameHeight: 130,
    });

    //BOSS (HACE FALTA POR NO CONDICIONARLO EN CLASE BOSS)    
    this.load.spritesheet("idleBoss", "./src/img/bossOne/Idle.png", {
      frameWidth: 1999 /8,
      frameHeight: 105,
    });
    this.load.spritesheet("attack1Boss", "./src/img/bossOne/Attack1.png", {
      frameWidth: 1874 /8,
      frameHeight: 149,
    });
    this.load.spritesheet("attack2Boss", "./src/img/bossOne/Attack2.png", {
      frameWidth: 1820 /8,
      frameHeight: 154,
    });
    this.load.spritesheet("deathBoss", "./src/img/bossOne/Death.png", {
      frameWidth: 1999 /8,
      frameHeight: 105,
    });
    this.load.spritesheet("runBoss", "./src/img/bossOne/Run.png", {
      frameWidth: 2000 /8,
      frameHeight: 73,
    });
    this.load.spritesheet("fallBoss", "./src/img/bossOne/Fall.png", {
      frameWidth: 500 /2,
      frameHeight: 250,
    });
    this.load.spritesheet("hitBoss", "./src/img/bossOne/Hit.png", {
      frameWidth: 750 /3,
      frameHeight: 250,
    });

    //ENEMIGO VOLADOR
    this.load.spritesheet("flyingEnemy", "./src/img/enemies/0-beholder.png", {
      frameWidth: 100 / 1,
      frameHeight: 86,
    });
    this.load.image("beamEnemy","./src/img/enemies/ball.png",{
      frameWidth: 92,
      frameHeight: 211
    })

  }

  create(data) {
    window.addEventListener('contextmenu', function (e) {
      e.preventDefault(); // Esto evita que aparezca el menú contextual
    });

    //FONDO
    this.background = this.add.tileSprite(500, 200, 0, 350, "background");
    this.background.setScale(3.8);
    
    //SUELO
    this.ground=this.physics.add.staticGroup()
    this.ground.create(500,550,"ground")
    .setScale(50,1)
    .setSize(1100)
    .setOffset(-500,0)
    
    //PLATAFORMAS
    this.createPlatforms();
    
    //PLAYER
    this.player = new Player(this, -50, 250, "runPlayer");
    this.player.playerInitialMove()

    //SKILLS
    this.skillCd = this.add.tileSprite(20, 450, 130, 130, "skillCd");
    this.skillCd.setScale(0.5)

    //DISPAROS
    this.beamGroup = this.physics.add.group();

    //BOSS
    this.boss = new Boss(this,this.cameras.main.worldView.right-150,200,this.player,0);
    this.boss.setVisible(false);

 
    //BOTON PAUSA
    this.createPauseButton();    
    
    //COLISIONES
    this.addColliders()
    
    //*Eventos del raton
    this.input.on('pointerdown', function (pointer) {
      if(pointer.leftButtonDown() && !this.scene.player.isAttacking){   

          if(this.scene.player.x<pointer.x){
            this.scene.player.setFlipX(false)
          }else{
            this.scene.player.setFlipX(true)
          }

          if(this.scene.player.playerType==0 && this.scene.player.isPlayerMovable && !this.scene.player.isAttacking){
            this.scene.createMageBeam(this.scene.player.x, this.scene.player.y-15, this.scene.player.flipX ? "left" : "right",pointer.x,pointer.y);
            this.scene.player.isAttacking = true;
            this.scene.player.isPlayerMovable=false;            
            this.scene.player.anims.play("attack", true).on("animationcomplete", () => {              
              this.scene.player.isAttacking = false;
              this.scene.player.isPlayerMovable=true;
            });            
          }
      }else if(this.scene.keys.A.isDown && pointer.rightButtonDown() && !this.scene.player.isSpecialAttacking){
        this.scene.player.setFlipX(true)
        this.scene.player.blockOrBlink()
        this.scene.skillCooldown()
      }else if(this.scene.keys.D.isDown && pointer.rightButtonDown() && !this.scene.player.isSpecialAttacking){
        this.scene.player.setFlipX(false)
        this.scene.player.blockOrBlink()
        this.scene.skillCooldown()
      }else if(pointer.rightButtonDown() && !this.scene.player.isSpecialAttacking){ 
        if(this.scene.player.isPlayerMovable){
          const playerDirection=this.scene.player.x>pointer.x//guardo la diferencia entre la posicion y el click en forma de booleano
          this.scene.player.setFlipX(playerDirection)
          this.scene.player.blockOrBlink()
          this.scene.skillCooldown()
        }
      }
    });

    this.infoRect = this.add.rectangle(100, 120, 1500, 45, 0xDCDCDC)
    this.infoText = this.add.text(80, 100, 'MUÉVETE LATERALMENTE CON "A" y "D"', { fill: '#000',
      fontSize: '32px',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    })
    
  }//create

  createFlyingEnemy() {
    const camera = this.cameras.main;
    const x = camera.worldView.right-100;
    const minY = camera.worldView.y + 100; 
    const maxY = camera.worldView.bottom - camera.worldView.height /2; 

    let y = Phaser.Math.Between(minY, maxY);

    this.flyingEnemy = new FlyingEnemy(this, x, y, "flyingEnemy", 0);
    this.add.existing(this.flyingEnemy);

  }

  addColliders() {
    // colisiones estaticas
    this.physics.add.collider(this.ground, this.player)
    this.physics.add.collider(this.platforms, this.player); // detecta las colisiones

    //TODO mejorar grupo de beams y enemigos para hacer el collider aqui.
  }

  createMageBeam(x, y, direction,pointerX,pointerY) {
    const mageBeam = new MageBeam(this, x, y, 'beamPlayer', direction === 'left',1500,1,500,25,20,pointerX,pointerY);

    const angle = Phaser.Math.Angle.Between(x, y, pointerX, pointerY);
    // Establece el ángulo del sprite según el ángulo calculado
    mageBeam.angle = Phaser.Math.RadToDeg(angle);

    this.beamGroup.add(mageBeam);
  }

  //*********************** MOVIMIENTOS Y ACCIONES ***********************
  update(time, delta) {
    const camera = this.cameras.main;
    this.player.update();    

    if (this.isPaused) {
      return; //--------controla el pause de las fisicas
    }
    //------------------------actualiza los diferentes beams---------
      this.beamGroup.getChildren().forEach(beam => {
        beam.update();
    });

    //MOVIMIENTO Y 'ACCION' DEL FONDO
    this.backgroundAnimationY();


    //SI EL USUARIO CUMPLE EL MOVIMIENTO PASAMOS A CREAR ENEMIGO
    if(this.player.variablePruebaD && this.player.variablePruebaA && this.canCreateFlyingEnemy){
      this.canCreateFlyingEnemy=false
      this.player.variablePruebaD=false
      this.player.variablePruebaA=false

      this.infoText.text='DISPARA CON CLICK IZQUIERDO! -->'
      this.infoText.setColor('#000')
      this.createFlyingEnemy();
      this.time.delayedCall(2000, () => {
        //ENEMIGO VOLADOR
        
      })
    }

    this.flyingEnemyKill()
    this.playerJumping()
    this.tutorialComplete()
  }//cierre update


  flyingEnemyKill(){
    if(this.flyingEnemy && !this.flyingEnemy.visible){
      this.infoText.text='SALTO/DOBLE SALTO CON "W" o "ESPACIO"'

      if(!this.arrowTemp){
        this.arrowTemp = this.add.tileSprite(700, 260, 205, 243, "arrowTemp");
        this.arrowTemp.setScale(0.32);

        this.tweens.add({
          targets: this.arrowTemp,
          y: 220,
          duration: 900,
          ease: 'Sine.easeInOut',
          yoyo: true, 
          repeat: -1 
        });
      }
      
    }
  }

  playerJumping(){
    if( (this.player.y+this.playerH)<=330
        && (this.player.x+25)>=690 
        && (this.player.x+25)<=710
        && this.player.body.touching.down){
          this.arrowTemp.setVisible(false)
      this.infoText.text='CLICK DERECHO PARA HABILIDAD ESPECIAL'
      if(!this.arrowGreen){
        this.arrowGreen = this.add.tileSprite(110, 190, 205, 243, "arrowGreen");
        this.arrowGreen.setScale(0.32);

        this.tweens.add({
          targets: this.arrowGreen,
          y: 160,
          duration: 900,
          ease: 'Sine.easeInOut',
          yoyo: true, 
          repeat: -1 
        });
      }
    }
  }

  tutorialComplete(){
    if( (this.player.y+this.playerH)<=260 
        && (this.player.x+25)>=100 
        && (this.player.x+25)<=140 
        && this.player.body.touching.down){
      this.infoText.text='TUTORIAL COMPLETADO - PULSA PARA IR AL MENU'
      this.infoText.setColor('#fff')
      this.arrowGreen.setVisible(false)
      this.infoText.setInteractive()
      this.infoText.on('pointerdown', () => {
        // fade to black
        this.cameras.main.fadeOut(500, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
          //? Todas las escenas están creadas, switch solo las intercambia de posicion. Muestra la escena a la que se le hace referencia.
        this.scene.switch('menu')
        this.cameras.main.fadeIn(1500, 0, 0, 0)
        })
      });
    }
  }

  backgroundAnimationY() {

    if(this.player.flipX && this.player.body.velocity.x!=0){
      this.background.tilePositionX += 0.1
    }else if(!this.player.flipX && this.player.body.velocity.x!=0){
      this.background.tilePositionX -= 0.1
    }    

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
    this.platforms.createPlatform(700, 320, "platform", 0.8, 0.3);
  }

  createPauseButton() {
      let pauseButton = this.add.text(this.cameras.main.centerX, 20, "Pause", {
        fontFamily: "comic-sans",
        fontSize: 20,
        fill: "white",
      });
      pauseButton.setInteractive({ useHandCursor: true });
      pauseButton.on("pointerdown", () => {
        if (this.isPaused) {
          this.resume();
        } else {
          if (this.sound.get('endlessSong').isPlaying) {           
            this.sound.get('endlessSong').pause()
          }
          this.cameras.main.fadeOut(500, 0, 0, 0)
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.switch('menu')
            this.cameras.main.fadeIn(500, 0, 0, 0)
          })
          
        }
      });

      this.pause = function () {
        this.physics.pause();    
        this.anims.pauseAll();
        this.platformEvent.paused = true;
        pauseButton.setText("Resume");
        this.isPaused = true;
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
          yoyo: true,
          repeat: -1,
        };
        this.tweens.add(pauseAnimation);
      this.resume = function () {
        this.physics.resume();
        this.anims.resumeAll();
        this.platformEvent.paused = false;
        pauseButton.setText("Pause");
        this.isPaused = false;
        this.pauseOverlay.destroy();
        this.pauseAnimation = null;
      };
    }
  }

  skillCooldown(){
    this.skillFrame = this.make.graphics({ x: 5, y: 435, add: true });
    this.skillFrame.fillStyle(0x151515, 0.8); //color y opacidad
    this.skillFrame.fillCircle(15, 15, 30); // Radio del círculo (x,y,%radius)

    this.time.delayedCall(8000, () => {
      this.skillFrame.destroy()
    })  
  }

}

import PlatformGroup from "../components/PlatformGroup.js";
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
    this.currentSongTime;

    //*LOGROS
    this.achivements={
      "firstJump": { unlocked: false, progress: 0 },
      "firstAttack": { unlocked: false, progress: 0 }
    };
  }

  //*********************** ASSETS-SPRITES/IMAGES ***********************
  preload() {

    this.load.image("background", "./src/img/background/mountain.png");
    this.load.image("platform", "./src/img/platforms/platform4.png",{
      frameHeight: 60,
      frameWidth: 120
    });

    //*CAGAR LOGROS SI HAY
    this.loadAchivements;

    //JUGADOR
    this.load.spritesheet("runPlayer", "./src/img/mage/Run.png", {
      frameWidth: 1848 / 8,
      frameHeight: 190,
    }); //para añadir al jugador se toman las medidas del sprite el ancho se divide por la cantidad de imagenes del personaje
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

    //DISPARO BOSS
    this.load.image("beamBoss", "./src/img/bossOne/bossBeam.png", {
      frameWidth: 56,
      frameHeight: 71,
    });

    //ENEMIGO RANGO
    this.load.spritesheet("flyingEnemy", "./src/img/enemies/0-beholder.png", {
      frameWidth: 100 / 1,
      frameHeight: 86,
    });
    this.load.image("beamEnemy","./src/img/enemies/ball.png",{
      frameWidth: 92,
      frameHeight: 211
    })

    //BOSS
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
    
    // GROUND ENEMY
    this.load.spritesheet("idleEnemy", "./src/img/enemies/ground-enemy-idle.png", {
      frameWidth: 720 / 9,
      frameHeight: 80,
    });
    this.load.spritesheet("runEnemy", "./src/img/enemies/ground-enemy-run.png", {
      frameWidth: 480 / 6,
      frameHeight: 80,
    });
    this.load.spritesheet("attackEnemy", "./src/img/enemies/ground-enemy-attack.png", {
      frameWidth: 960 / 12,
      frameHeight: 80,
    });
    this.load.spritesheet("hitEnemy", "./src/img/enemies/ground-enemy-hit.png", {
      frameWidth: 400 / 5,
      frameHeight: 80,
    });
    this.load.spritesheet("deathEnemy", "./src/img/enemies/ground-enemy-death.png", {
      frameWidth: 1840 / 23,
      frameHeight: 80,
    });

    //SKILL COOLDOWN
    this.load.image("skillCd", "./src/img/skillCd.png", {
      frameWidth: 130,
      frameHeight: 130,
    });
  } 

  //*********************** ELEMENTOS ***********************
  create(data) {
    window.addEventListener('contextmenu', function (e) {
      e.preventDefault(); // Esto evita que aparezca el menú contextual
    });

    //*logros
    this.loadAchivements()

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
    this.player = new Player(this, -50, 250, "runPlayer");//Ahora creamos el player "fuera de la pantalla" para que aparezca corriendo
    this.player.playerInitialMove()//Animacion inicial para que el player aparezca corriendo desde fuera

    //SKILLS
    this.skillCd = this.add.tileSprite(20, 450, 130, 130, "skillCd");
    this.skillCd.setScale(0.5)

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
      if(pointer.leftButtonDown() && !this.scene.player.isAttacking){
        //Posicion donde hemos clicado.
          //pointer.x ---- pointer.y

          this.scene.verifyAchivements('attack');//Registramos el evento en logros
          console.log(this.scene.achivements["firstAttack"].progress)//comprobamos el progreso
          if(!this.scene.contenedor && this.scene.achivements["firstAttack"].progress % 5 === 0){
            this.scene.createToast("¡Logro Desbloqueado: Sigue disparando! "+this.scene.achivements["firstAttack"].progress,1,2000)//cambiar por numero de logro
            //this.scene.createToast("¡Logro Desbloqueado: Sigue disparando!",2)//cambiar por numero de logro
          }       

          if(this.scene.player.x<pointer.x){
            this.scene.player.setFlipX(false)
          }else{
            this.scene.player.setFlipX(true)
          }

          if(this.scene.player.playerType==0 && this.scene.player.isPlayerMovable && !this.scene.player.isAttacking){
            //CREAR DISPARO DEL MAGO
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
        //this.scene.createToast("BLINK EN CD",1,7000)
      }else if(this.scene.keys.D.isDown && pointer.rightButtonDown() && !this.scene.player.isSpecialAttacking){
        this.scene.player.setFlipX(false)
        this.scene.player.blockOrBlink()
        this.scene.skillCooldown()
        //this.scene.createToast("BLINK EN CD",1,7000)
      }else if(pointer.rightButtonDown() && !this.scene.player.isSpecialAttacking){ 
        if(this.scene.player.isPlayerMovable){
          const playerDirection=this.scene.player.x>pointer.x//guardo la diferencia entre la posicion y el click en forma de booleano
          this.scene.player.setFlipX(playerDirection)
          this.scene.player.blockOrBlink()
          this.scene.skillCooldown()
          //this.scene.createToast("BLINK EN CD",1,7000)
        }
      }
    });

  }//create

  bossAppear(){
    this.boss = new Boss(this,this.cameras.main.worldView.right-150,200,this.player,1);
    //this.boss.METODOATAQUE()//PARA PROBAR ATAQUES DIRECTAMENTE
    this.boss.clonePlayer();
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
    const beam = new Beam(this, x, y, 'beamEnemy', direction === 'left',1000,1,1000,25,20);
    this.beamGroup.add(beam);
  }

  createMageBeam(x, y, direction,pointerX,pointerY) {
    const mageBeam = new MageBeam(this, x, y, 'beamPlayer', direction === 'left',1500,1,500,25,20,pointerX,pointerY);

    const angle = Phaser.Math.Angle.Between(x, y, pointerX, pointerY);
    // Establece el ángulo del sprite según el ángulo calculado
    mageBeam.angle = Phaser.Math.RadToDeg(angle);

    this.beamGroup.add(mageBeam);
  }

  decrementTimer() {
    if (this.timer > 0) {
      let minutes = Math.floor(this.timer / 60);
      let seconds = this.timer % 60;

      //! CONTROL DE LA IA DEL BOSS - ATAQUES     
      if(this.timer>6&&seconds%3==0&&this.boss){//Probando ataques del boss cada 3 segundos (aleatorios)
        
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
        //this.bossSkillsArr[1].call(this.boss)
        
        if(rngBossSkill==0){
          this.boss.body.setSize(this.boss.w+50, this.boss.h+5, true);
          this.boss.body.setOffset(150, 50);

          this.bossSkillsArr[rngBossSkill].call(this.boss)
          //!COPIAR/MODIFICAR EL CODIGO DEL MAGEBEAM PARA QUE EN ESTE CASO PAREZCA UN FANTASMA QUE TE SIGUE Y EXPLOTA
          this.boss.anims.play("bossAttack1Anim").on("animationcomplete", () => {
            this.boss.anims.play("bossIdleAnim");
            this.boss.body.setSize(this.boss.w, this.boss.h, true);
            this.boss.body.setOffset(100, 45);
          });
        }else if(rngBossSkill==6||rngBossSkill==7){

          this.boss.body.setSize(this.boss.w+50, this.boss.h+5, true);
          this.boss.body.setOffset(150, 50);
          this.bossSkillsArr[rngBossSkill].call(this.boss)
          this.boss.anims.play("bossAttack2Anim").on("animationcomplete", () => {
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
      if(minutes===0 && seconds === 50){//! Modificarlo a % del total de tiempo
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
    if(!this.boss){
      this.background.tilePositionX += 0.5;//velocidad de fondo
    }else{
      if(this.player.flipX && this.player.body.velocity.x!=0){
        this.background.tilePositionX += 0.1
      }else if(!this.player.flipX && this.player.body.velocity.x!=0){
        this.background.tilePositionX -= 0.1
      }else{
        
      }      
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
    this.platforms.createPlatform(680, 320, "platform", 0.8, 0.3);
    this.platforms.createPlatform(380, 420, "platform", 0.8, 0.3);

    this.platformEvent = this.time.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: () => {
        if(!this.boss){
          this.platforms.createPlatform(this.game.config.width,Phaser.Math.Between(this.game.config.height/2, this.game.config.height - 50),"platform",0.8,0.3,);
        }
      }, loop: true,
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

  createGroundEnemy(clone) {
    const x = this.cameras.main.worldView.right;

    this.groundEnemy = new GroundEnemy(this, x, 350, this.player,clone);
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
          //this.sound.stopByKey('endlessSong');
          if (this.sound.get('endlessSong').isPlaying) {
            //this.sound.stopByKey('endlessSong'); // Detiene el sonido
            //this.currentSongTime = this.sound.get('endlessSong').seek(); // Guarda el tiempo actual            
            this.sound.get('endlessSong').pause()
          }
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
        //PARAR SONIDO

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


  loadAchivements() {
    this.storedAchivements = localStorage.getItem('achivements');
    if (this.storedAchivements) {
        Object.assign(this.achivements, JSON.parse(this.storedAchivements));
        console.log(this.storedAchivements)
    }
  }
  saveAchivements() {
    //!localStorage.setItem('achivements', JSON.stringify(this.achivements));
  }

  verifyAchivements(event) {//EL EVENTO LO MARCAMOS NOSOTROS CUANDO HAGAMOS EL CALL A 'VERIFICARLOGROS'
    switch (event) {
        case 'jump':
            this.achivements["firstJump"].progress++;
            if (this.achivements["firstJump"].progress === 1 && !this.achivements["firstJump"].unlocked) {
              this.achivements["firstJump"].unlocked = true;
              //mostrarMensaje("¡Logro Desbloqueado: Primer Salto!");
                this.saveAchivements();
            }            
          break;
        case 'attack':
            this.achivements["firstAttack"].progress++;
            if (this.achivements["firstAttack"].progress === 5 && !this.achivements["firstAttack"].unlocked) {
              this.achivements["firstAttack"].unlocked = true;
                //mostrarMensaje("¡Logro Desbloqueado: Sigue disparando!");
                this.saveAchivements();
                console.log("¡Logro Desbloqueado: Sigue disparando!")
                //this.scene.showToast.call(this, "¡Logro Desbloqueado: Sigue disparando!")
            }
            if (this.achivements["firstAttack"].progress % 5 === 0 && this.achivements["firstAttack"].unlocked) {
              //mostrarMensaje("¡Logro Desbloqueado: Primer Salto!");
              this.saveAchivements();
            }
          break;/*
        case 'score':
            logros["Puntos"].progreso += score// Asumiendo que score es la cantidad de puntos obtenidos
            if (logros["Puntos"].progreso >= 100 && !logros["Puntos"].desbloqueado) {
              logros["Puntos"].desbloqueado = true;
              logros["Puntos"].progreso += score;
            }*/
    }
  }

  createToast(message,index,delay){          

    if(delay>2000){
      this.toast1 = this.add.container()
      this.toastBg1 = this.add.rectangle(5,450,250,45,{ fill: '#fff' })
      this.toastText1 = this.add.text(10, 450, message, { fill: '#fff' })
      this.toastBg1.setScale(1.3)
      this.toast1.add(this.toastBg1)
      this.toast1.add(this.toastText1)

      this.time.delayedCall(8000, () => {
        //this.toastBg.setVisible(false)
        //this.toastText.setVisible(false)
        this.toast1.setVisible(false)
        this.toast1.destroy()
      })
    }else{
      this.toast2 = this.add.container()
      this.toastBg2 = this.add.rectangle(5,50+(index*50),700,45,{ fill: '#fff' })
      this.toastText2 = this.add.text(10,50+(index*50), message, { fill: '#fff' })
      this.toastBg2.setScale(1.3)
      this.toast2.add(this.toastBg2)
      this.toast2.add(this.toastText2)

      this.time.delayedCall(2000, () => {
        //this.toastBg.setVisible(false)
        //this.toastText.setVisible(false)
        this.toast2.setVisible(false)
        this.toast2.destroy()
      })
    }
    
    //this.scene.createToast.call(this.scene,"¡Logro Desbloqueado: Sigue disparando!",1/*cambiar por numero de logro*/)
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
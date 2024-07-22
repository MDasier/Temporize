class Scene extends Phaser.Scene {
    constructor() {
      super("level1"); //siempre se mantiene la estructura
    }
    //phaser tiene siempre 3 funciones
  
    //------------------------------------assets-sprites/imamges----------------------------------
    preload() {
      //donde cargamos los assets
      this.load.image("background", "../img/background/mountain.png");
      this.load.image("platforms", ".//assets/grass.png"); //plataforma //TODO NO CARGA IMAGEN PORQUE NO EXISTE(REVISAR RUTA)
      this.load.spritesheet("player", "../img/mage/Run.png", {
        frameWidth: 1848/8,
        frameHeight: 190
      }); //para añadir al jugador se t oman las medidas del sprite el ancho se divide por la cantidad de imagenes del personaje
    }
  
    //---------------------------------------elementos---------------------
    create() {
      //crea 1 sola vez
  
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
  
      //fondo siempre primero
      this.background = this.add.tileSprite(500, 200, 0, 350, "background");
      this.background.setScale(3.8);
     
  
      //plataformas
     
      platforms = this.physics.add.staticGroup(); //hijos de platafprmas
  
      
      platforms
        .create(500, 380, "platforms")
        .setScale(1.5, 0.3)
        .setSize(150, 15)
        .setOffset(-25, 75); //escaladoo de plataformas
        platforms
        .create(700, 280, "platforms")
        .setScale(1.5, 0.3)
        .setSize(150, 15)
        .setOffset(-25, 75); //setsize y setoffset para modificar el hitbox
        platforms
        .create(500, 480, "platforms")
        .setScale(7.6, 0.3)
        .setSize(1000, 15)
        .setOffset(-480, 75);
      //plataformas.setSize(20,20)
      
  
      //jugador
      player = this.physics.add.sprite(180, 450, "player");
      player.setScale(0.9); //escalar el jugador
      player.setSize(30, 90); //hitbox, modificando el debug de false a true en game para visualizarlo
      player.setOffset(100,65) //para cuadrar dentro del hitbox
      player.setCollideWorldBounds(true); //colision con el borde
  
      //teclas
      cursors = this.input.keyboard.createCursorKeys();
  
      //colisiones
      this.physics.add.collider(platforms, player); // detecta las colisiones

      //PAUSA
      let pauseButton = this.add.text(this.cameras.main.centerX, 20, 'Pause', {
        fontFamily:"comic-sans",
        fontSize: 20,
        fill: 'white'
      });
      pauseButton.setInteractive({useHandCursor: true}); //agrega evento onclick
      pauseButton.on('pointerdown', ()=>{
        if(this.isPaused){
          this.resume(); //reanudar
          
          
        }else {
          this.pause(); //pausar
        }
      })
      this.pause = function() { //funcion para pausar
        this.physics.pause();
        this.anims.pauseAll()
        pauseButton.setText("Resume")
        this.isPaused = true;
      }
      this.resume = function(){ //función reanudar
        this.physics.resume();
        this.anims.resumeAll()
        pauseButton.setText("Pause")
        this.isPaused = false;
      };
      
    }
  
    //----------------------movimientos----------------------------
    update() {
       //--------------------------------movimiento perpetuo del fondo-------descomentar-----
      if(!this.isPaused){//--------controla el pause de las fisicas 
       
        this.background.tilePositionX += 0.5;  //velocidad de fondo

      //le da movimientos y acciones
  
      if (cursors.right.isDown) {
        //teclas y velocidades
        player.setVelocityX(180);
        player.anims.play("caminar", true); //para los sprites
        player.flipX = false; //regula el giro del personaje
        player.setOffset(100, 50); //para regular el hitbox se copia el anterior
        //this.background.tilePositionX += 0.01 //---------------------------movimiento del fondo con las flechas
      } //console.log("presionando");
      else if (cursors.left.isDown) {
        player.setVelocityX(-180);
        player.anims.play("caminar", true); //para los sprites
        player.flipX = true; //gira el personaje, hay que modificar hitbox
        player.setOffset(100,50);
        //this.background.tilePositionX -= 0.01  //-------------movimiento del fondo con las flechas
      } else {
        player.setVelocityX(0);
        player.anims.play("detenido", true);
      }
      if (cursors.space.isDown && player.body.touching.down) {
        //salto
        player.setVelocityY(-450);
      }

      //Efecto 'PARALLAX' cuando nos movemos en vertical (Saltos)
      if (cursors.space.isDown /*&& this.background.tilePositionY<300*/){
        this.background.tilePositionY -= 0.09
      }else if(!cursors.space.isDown && !player.body.touching.down){
        this.background.tilePositionY += 0.05
      }


      //limitar el movimiento para evitar salir de la pantalla 
      //TODO por algun motivo el PJ spawnea fuera del background y claro, ya no puede moverse
      /* if (player.x<0){
        player.x = 0;
      }else if (player.x + player.width > this.background.width){
        player.x = this.background.width - player.width;
      } */
    }} 
  }
  
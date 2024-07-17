class Scene extends Phaser.Scene {
    constructor() {
      super("level1"); //siempre se mantiene la estructura
    }
    //phaser tiene siempre 3 funciones
  
    //------------------------------------assets-sprites/imamges----------------------------------
    preload() {
      //donde cargamos los assets
      this.load.image("background", "../img/background/mountain.png");
      this.load.image("plataformas", ".//assets/grass.png"); //plataforma
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
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }), //------------animaciones detenido
        frameRate: 2,
        repeat: -1, // -1 significa que se repite para siempre
      });
      this.anims.create({
        key: "caminar",
        frames: this.anims.generateFrameNumbers("player", { start: 2, end: 4 }), //animaciones caminando
        frameRate: 0.5,
        repeat: -1, // -1 significa que se repite para siempre
      });
  
      //fondo siempre primero
      let fondo = this.add.image(500, 200, "background"); //se añade el fondo
      fondo.setScale(3); //para escalar el background
  
      //plataformas
      platforms = this.physics.add.staticGroup(); //hijos de platafprmas
  
      /* 
      platforms
        .create(500, 450, "platforms")
        .setScale(1.5, 0.3)
        .setSize(150, 35)
        .setOffset(-25, 75); //escaladoo de plataformas
        platforms
        .create(700, 350, "platforms")
        .setScale(1.5, 0.3)
        .setSize(150, 35)
        .setOffset(-25, 75); //setsize y setoffset para modificar el hitbox
        platforms
        .create(500, 540, "platforms")
        .setScale(7.6, 0.3)
        .setSize(760, 35)
        .setOffset(-330, 75);
      //plataformas.setSize(20,20)
      */
  
      //jugador
      player = this.physics.add.sprite(200, 400, "player");
      player.setScale(1); //escalar el jugador
      player.setSize(40, 60); //hitbox, modificando el debug de false a true en gamne para visualizarlo
      //jugador.setOffset()para cuadrar dentro del hitbox
      player.setCollideWorldBounds(true); //colision con el borde
  
      //teclas
      cursors = this.input.keyboard.createCursorKeys();
  
      //colisiones
      this.physics.add.collider(platforms, player); // detecta las colisiones
    }
  
    //----------------------movimientos----------------------------
    update() {
      //le da movimientos y acciones
  
      if (cursors.right.isDown) {
        //teclas y velocidades
        player.setVelocityX(180);
        player.anims.play("caminar", true); //para los sprites
        player.flipX = false; //regula el giro del personaje
        player.setOffset(2, 2); //para regular el hitbox se copia el anterior
      } //console.log("presionando");
      else if (cursors.left.isDown) {
        player.setVelocityX(-180);
        player.anims.play("caminar", true); //para los sprites
        player.flipX = true; //gira el personaje, hay que modificar hitbox
        player.setOffset(2, 2);
      } else {
        player.setVelocityX(0);
        player.anims.play("detenido", true);
      }
      if (cursors.up.isDown && player.body.touching.down) {
        //salto
        player.setVelocityY(-450);
      }
    }
  }
  
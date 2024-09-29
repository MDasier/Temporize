export default class Menu extends Phaser.Scene {
  constructor(scene) {
    super({ key: "menu" });
    this.currentSongTime;
  }

  preload() {
    //console.log("PRELOAD DE MENU");
    this.load.audio('endlessSong', [ './sounds/Boadrius-thanks_musicaEndless.mp3' ]);
    this.load.audio('storeMusic', [ './sounds/HarumachiMusic-thnks_shop.mp3' ]);
    this.load.audio('rodoom', [ './sounds/Pixabay-thanks_rayOfDoom.mp3' ]);
    this.load.audio('magicSpell', [ './sounds/magicSpell.mp3' ]);
  }

  init(data){
  }

  create(){

    this.endlessSong = this.sound.add('endlessSong');
    this.storeMusic = this.sound.add('storeMusic');
    this.rodoom = this.sound.add('rodoom');
    this.magicSpell = this.sound.add('magicSpell');
    this.magicSpell.setVolume(0.01);//no funciona

    this.startButton = this.add.text(100, 100, 'START GAME', { fill: '#0f0' })
     .setInteractive()
     .on('pointerover', () => this.startButtonOver() )
     .on('pointerout', () => this.startButtonOut() )
     .on('pointerdown', () => this.startButtonDown())

     this.storeButton = this.add.text(100, 150, 'STORE', { fill: '#0f0' })
     .setInteractive()
     .on('pointerover', () => this.storeButtonOver() )
     .on('pointerout', () => this.storeButtonOut() )
     .on('pointerdown', () => this.storeButtonDown() )

     this.htpButton = this.add.text(100, 200, 'HOW TO PLAY', { fill: '#0f0' })
     .setInteractive()
     .on('pointerover', () => this.htpButtonOver() )
     .on('pointerout', () => this.htpButtonOut() )
     .on('pointerdown', () => this.htpButtonDown() )

  }

  startButtonOver() {
    this.startButton.setStyle({ fill: '#ff0'});
  }

  startButtonOut() {
    this.startButton.setStyle({ fill: '#0f0' });
  }

  startButtonDown(){
    this.startButton.disableInteractive()
    this.startButton.text="GAME RUNNING"
    this.startButton.setColor('#f49')
    //this.startButton = this.add.text(100, 100, 'GAME RUNNING', { fill: '#DCDCDC' })

    this.resumeButton = this.add.text(100, 250, `RESUME`, { fill: '#0f0' })
    .setInteractive()
    .on('pointerover', () => this.resumeButtonOver() )
    .on('pointerout', () => this.resumeButtonOut() )
    .on('pointerdown', () => this.resumeButtonDown() )

    this.endlessSong.play();
    //this.endlessSong.setLoop(true);
    this.endlessSong.setVolume(0.1);//!cambiar 0.1 por variable para poder modificar el volumen en configuracion
    // fade to black
		this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      //? Todas las escenas están creadas, switch solo las intercambia de posicion. Muestra la escena a la que se le hace referencia.
    this.scene.switch('level1')
    this.cameras.main.fadeIn(1500, 0, 0, 0)
    //!hay que controlar en que momento estamos clicando en 'START GAME'. Si es la primera vez deberia llevarnos a 'initialScene' y si no a 'level1'  
    })
    
  }

  storeButtonOver() {
    this.storeButton.setStyle({ fill: '#ff0'});
  }

  storeButtonOut() {
    this.storeButton.setStyle({ fill: '#0f0' });
  }

  storeButtonDown(){/*
    this.storeButton.setText(`BOTON 'STORE' PULSADO`);
    this.time.delayedCall(1000,()=>{this.storeButton.setText(`STORE`);})*/
    this.storeMusic.play();
    this.storeMusic.setLoop(true);
    this.storeMusic.setVolume(0.01);
    this.scene.start("store")
  }

  resumeButtonOver() {
    this.resumeButton.setStyle({ fill: '#ff0'});
  }

  resumeButtonOut() {
    this.resumeButton.setStyle({ fill: '#0f0' });
  }
  
  resumeButtonDown() {
    this.sound.get('endlessSong').resume();
    //this.sound.get('nombreDelSonido').seek(10); // Reproduce desde el segundo 10
    
    // fade to black
		this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      //? Todas las escenas están creadas, switch solo las intercambia de posicion. Muestra la escena a la que se le hace referencia.
    this.scene.switch('level1')
    this.cameras.main.fadeIn(500, 0, 0, 0)
    //!hay que controlar en que momento estamos clicando en 'START GAME'. Si es la primera vez deberia llevarnos a 'initialScene' y si no a 'level1'  
    })
  }


  htpButtonOver() {
    this.htpButton.setStyle({ fill: '#ff0'});
  }

  htpButtonOut() {
    this.htpButton.setStyle({ fill: '#0f0' });
  }

  htpButtonDown(){
    // fade to black
		this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      //? Todas las escenas están creadas, switch solo las intercambia de posicion. Muestra la escena a la que se le hace referencia.
    this.scene.switch('howToPlay')
    this.cameras.main.fadeIn(1500, 0, 0, 0)
    })
    
  }

}

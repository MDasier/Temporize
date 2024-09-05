export default class Menu extends Phaser.Scene {
  constructor(scene) {
    super({ key: "menu" });
  }

  preload() {
    //console.log("PRELOAD DE MENU");
  }

  init(data){
    /*this.scorem=data.score
    this.timem=data.time
    this.ended=data.ended*/
    this.test=data.test
  }

  create() {

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

    this.resumeButton = this.add.text(100, 200, `RESUME`, { fill: '#0f0' })
    .setInteractive()
    .on('pointerover', () => this.resumeButtonOver() )
    .on('pointerout', () => this.resumeButtonOut() )
    .on('pointerdown', () => this.resumeButtonDown() )
    //? Todas las escenas están creadas, switch solo las intercambia de posicion. Muestra la escena a la que se le hace referencia.
    this.scene.switch('level1')
    //!hay que controlar en que momento estamos clicando en 'START GAME'. Si es la primera vez deberia llevarnos a 'initialScene' y si no a 'level1'  
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
    this.scene.start("store")
  }

  resumeButtonOver() {
    this.resumeButton.setStyle({ fill: '#ff0'});
  }

  resumeButtonOut() {
    this.resumeButton.setStyle({ fill: '#0f0' });
  }
  
  resumeButtonDown() {
    this.scene.switch('level1')
  }

}

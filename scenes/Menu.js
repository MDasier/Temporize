export default class Menu extends Phaser.Scene {
  constructor(scene) {
    super({ key: "menu" });
  }

  preload() {
    //console.log("PRELOAD DE MENU");
  }

  init(data){
    this.scorem=data.score
    this.timem=data.time
    this.ended=data.ended
  }

  create() {
    //console.log("CREATE DE MENU");

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

     this.resumeButton = this.add.text(100, 200, `RESUME - points: ${this.scorem} - ${this.timem}`, { fill: '#0f0' })
     .setInteractive()
     .on('pointerover', () => this.resumeButtonOver() )
     .on('pointerout', () => this.resumeButtonOut() )
     .on('pointerdown', () => this.resumeButtonDown() )
  }

  startButtonOver() {
    this.startButton.setStyle({ fill: '#ff0'});
  }

  startButtonOut() {
    this.startButton.setStyle({ fill: '#0f0' });
  }

  startButtonDown(){
    if(this.scorem!==undefined){
      this.scene.start("level1",{score:this.scorem,time:this.timem,ended:this.ended})
      //this.scene.resume()//AUN SE VUELVE EN PAUSA
    }else{
      this.scene.start("initialScene")
    }
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

}

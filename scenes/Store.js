export default class Store extends Phaser.Scene {
  constructor(scene) {
    super({ key: "store" });
  }

  preload() {
    
  }

  create() {
    this.menuButton = this.add.text(100, 100, 'MENU', { fill: '#0f0' })
     .setInteractive()
     .on('pointerover', () => this.menuButtonOver() )
     .on('pointerout', () => this.menuButtonOut() )
     .on('pointerdown', () => this.scene.start("menu"))

    this.lbl = this.add.text(100, 150, 'GASTA TUS PUNTOS Y DEJA DE ACUMULAR!', { fill: '#0f0' })
    .setInteractive()
    .on('pointerover', () => this.lblOver() )
    .on('pointerout', () => this.lblOut() )
    .on('pointerdown', () => this.lblDown())
  }

  menuButtonOver() {
    this.menuButton.setStyle({ fill: '#ff0'});
  }

  menuButtonOut() {
    this.menuButton.setStyle({ fill: '#0f0' });
  }

  lblOver() {
    this.lbl.setStyle({ fill: '#ff0'});
  }

  lblOut() {
    this.lbl.setStyle({ fill: '#0f0' });
  }

  lblDown() {
    this.scene.stop("store","test")
    this.scene.start("menu")
    console.log("JAJAJAJA NO TIENES PUNTOS ERES MALISIMO!")
    console.log("store - stop")
    console.log("menu - start")
  }

}

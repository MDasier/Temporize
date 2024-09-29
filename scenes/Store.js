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
     .on('pointerdown', () => this.menuButtonDown())

    this.lbl = this.add.text(100, 150, 'GASTA TUS PUNTOS', { fill: '#0f0' })
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

  menuButtonDown(){
    this.sound.stopByKey('storeMusic');
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.switch('menu')
      this.cameras.main.fadeIn(500, 0, 0, 0)
    })
  }

  lblOver() {
    this.lbl.setStyle({ fill: '#ff0'});
  }

  lblOut() {
    this.lbl.setStyle({ fill: '#0f0' });
  }

  lblDown() {
    this.lbl.text='JAJAJAJA NO TIENES PUNTOS ERES MALISIMO!'
  }

}

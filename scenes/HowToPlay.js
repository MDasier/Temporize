export default class Store extends Phaser.Scene {
  constructor(scene) {
    super({ key: "howToPlay" });
  }

  preload() {
    this.load.image("htp", "../img/background/htp.png");
    this.load.image("background", "../img/background/background.png");
  }

  create() {
    
    this.background = this.add.tileSprite(500, 280, 0, 150, "htp");
    this.background.setScale(1.1);

    this.menuButton = this.add.text(10, 500, 'VOLVER AL MENU', { fill: '#000' })
     .setInteractive()
     .on('pointerover', () => this.menuButtonOver() )
     .on('pointerout', () => this.menuButtonOut() )
     .on('pointerdown', () => this.menuButtonDown())
     this.menuButton.setScale(2);
  }

  menuButtonOver() {
    this.menuButton.setStyle({ fill: '#ff0'});
  }

  menuButtonOut() {
    this.menuButton.setStyle({ fill: '#000' });
  }

  menuButtonDown(){
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.switch('menu')
      this.cameras.main.fadeIn(500, 0, 0, 0)
    })
  }
}

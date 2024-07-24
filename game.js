import Scene from './scenes/Scene.js'
import InitialScene from './scenes/InitialScene.js'

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // este es escalado automatico revisarlo para la ventana completa
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,//1920,
    height: 550,//1080,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: true, //visualizar el debug hitbox....
    },
  },
  scene:[InitialScene ,Scene]

};
const game = new Phaser.Game(config)
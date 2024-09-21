import Level1 from './scenes/Level1.js'
import InitialScene from './scenes/InitialScene.js'
import Menu from './scenes/Menu.js';
import Store from './scenes/Store.js';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // este es escalado automatico revisarlo para la ventana completa
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width:  1000, //1920,
    height:  550, //1080,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: true, //visualizar el debug hitbox....
      fps: 60,
    },
  },
  fps:{
    target:120,
    forceSetTimeOut: true,
  },
  scene:[ Menu, Store, InitialScene, Level1 ]

};
const game = new Phaser.Game(config)
/*
class Obstacles{
    constructor(scene){
        this.relatedScene = scene;
        this.platforms = null;
    }
    preload(){
        this.load.image("platforms", ".//assets/grass.png");
    }
    create(){
        console.log(this.relatedScene)
        this.platforms = this.relatedScene.scene.physics.add.staticGroup(); //hijos de platformas

        this.platforms
          .create(500, 400, "platforms")
          .setScale(1.5, 0.3)
          .setSize(150, 15)
          .setOffset(-25, 75); //escaladoo de plataformas
        this.platforms
          .create(700, 280, "platforms")
          .setScale(1.5, 0.3)
          .setSize(150, 15)
          .setOffset(-25, 75); //setsize y setoffset para modificar el hitbox
        this.platforms
          .create(500, 480, "platforms")
          .setScale(7.6, 0.3)
          .setSize(1000, 15)
          .setOffset(-480, 75);
        // this.platforms.setSize(20,20)
    }
    update(){

    }
}*/
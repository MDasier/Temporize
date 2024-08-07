export default class PlatformGroup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.scene = scene;
    this.scene.add.existing(this);
  }

  createPlatform(x, y, texture, scaleX , scaleY ) {
    const platform = this.create(x, y, texture);
    platform.setScale(scaleX, scaleY);
    platform.refreshBody();

    //Para poder saltar desde abajo a las plataformas
    platform.body.checkCollision.down = false;
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;
  }
  removeCollisionUp(){
    console.log("removeCollisionUp");
    this.children.iterate((eachPlatform)=>{
      eachPlatform.body.checkCollision.up=false
    })
    
  }

  movePlatforms(){
    this.children.iterate((eachPlatform)=>{
      eachPlatform.x-=1
      eachPlatform.refreshBody()
    })
  }
}

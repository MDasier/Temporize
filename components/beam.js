export default class Beam extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        this.scene=scene;
        this.x=x;
        this.y=y;

      
         
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.body.setGravityY(-800);
        
       
      
        
        
        this.setCollideWorldBounds(true);
        this.setScale(1)
        this.body.setSize(25,20,true)
        //this.setVelocityX(flipX ? -300 : 300); // Move left if flipX is true, otherwise move right

        //this.flipX = flipX;
        
        this.setVelocityX(800)
       
    }
  
 }
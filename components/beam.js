export default class Beam extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y, texture, frame, gravity, speed ){
        super(scene,x,y, texture, frame);
        this.scene=scene;
        this.x=x;
        this.y=y;
        this.gravity= gravity;
        this.speed = speed;
        console.log(this.gravity+`class Beam`);
        console.log(this.speed+`class Beam`);

      
         
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.body.setGravityY(gravity);
        this.body.setVelocityX(speed)
       
       
      
        
        
        this.setCollideWorldBounds(true);
        this.setScale(1)
        this.body.setSize(25,20,true)
        //this.setVelocityX(flipX ? -300 : 300); // Move left if flipX is true, otherwise move right

        //this.flipX = flipX;
        
        
       
    }
  
 }
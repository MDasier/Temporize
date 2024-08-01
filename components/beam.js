export default class Beam extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y, texture, frame, gravity, speed ){
        super(scene,x,y, texture, frame);
        this.scene=scene;
        this.x=x;
        this.y=y;
        this.gravity= gravity;

        //console.log("Beam "+gravity);
        //console.log("Beam "+speed);         

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        //* Configurar velocidad y gravedad
        this.setVelocityX(speed);
        this.setVelocityY(gravity-gravity);
        this.velocity.x = speed // Velocidad horizontal
        //this.body.velocity.x = speed // Velocidad horizontal
        this.setGravityY(gravity);
        //this.velocity.y = gravity //Velocidad en el eje y por fallo de gravedad         
        //console.log(this.velocity.x)//!NO LO BORRES QUE FUNCIONA!
        //this.body.velocity.y = -speed/9 //Velocidad en el eje y por fallo de gravedad         
        
        this.setCollideWorldBounds(true);
        this.setScale(1)
        this.body.setSize(25,20,true)

        //this.setVelocityX(flipX ? -300 : 300); // Move left if flipX is true, otherwise move right
        //this.flipX = flipX;
    }
  
 }
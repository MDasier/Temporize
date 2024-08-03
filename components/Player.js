export default class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture){
        super(scene,x,y,texture)

        this.scene=scene
        this.x=x
        this.y=y
        this.texture=texture

        this.scene.physics.add.existing(this)//cargar el jugador a la scene
        this.scene.add.existing(this)//hitbox del jugador
        this.setCollideWorldBounds(true)//limites para el jugador
        this.body.setSize(25,75,true)
        this.body.setOffset(100,70)//tamaño del hitbox

        this.createAnimation()
        this.anims.play("run")

        this.scene.keys=this.scene.input.keyboard.addKeys("z")
        this.scene.cursors=this.scene.input.keyboard.createCursorKeys()

        this.isAttacking=false
        //this.scene.beamGroup = this.scene.physics.add.group()
    }

    createAnimation(){
        this.anims.create({
            key:"run",
            frames:this.anims.generateFrameNumbers(this.texture,{start:0,end:7}),
            frameRate:10,
            repeat:-1
        })
        this.anims.create({
            key:"jump",
            frames:this.anims.generateFrameNumbers("jump",{start:0,end:1}),
            frameRate:10,
            repeat:0
        })
        this.anims.create({
            key:"attack",
            frames:this.scene.anims.generateFrameNumbers("attack",{start:4,end:7}),
            frameRate:15,
            repeat:0
          })
          this.anims.create({
            key:"jumpAttack",
            frames:this.scene.anims.generateFrameNumbers
            ("attack",{start:5,end:7}),
            frameRate:15,
            repeat:0
          })
    }
    //cambiamos el create por shoot ya que debe crearse en scene, aquí solo lo llamamos.
    // shootBeam(){
    //     this.scene.createBeam(this.x + 80, this.y -22, -800, 1500)
    // }

    update(){

        if(this.scene.isPaused){
            this.anims.pause()
        }

        if(this.scene.cursors.right.isDown){
            this.scene.player.setVelocityX(180)
            this.scene.player.flipX=false
        }else if(this.scene.cursors.left.isDown){
            this.scene.player.setVelocityX(-180)
            this.scene.player.flipX=true
        }else{
            this.scene.player.setVelocityX(0)
        }

        //*SALTO
        if (this.scene.cursors.space.isDown && this.scene.player.body.touching.down) {
            this.scene.player.setVelocityY(-450);
             this.anims.play("jump")
        }else if(!this.body.touching.down&&Phaser.Input.Keyboard.JustDown(this.scene.keys.z)){
            this.isAttacking=true
            this.x -= 35;
            this.anims.play("jumpAttack",true).on("animationcomplete",()=>{
                this.isAttacking=false 
          
            })  
            // this.shootBeam() ;


            const direction = this.flipX ? 'left' : 'right';
            const offsetX = this.flipX ? -90 : 90; // ajusta la posición de salida del disparo según la dirección

            this.scene.createBeam(this.x + offsetX, this.y - 22,direction);
            if(direction==="left"){
                this.x+=70
            }

        }else if(!this.body.touching.down&&!this.isAttacking){
         this.anims.play("jump",true)
        }
        else{
            if(!this.isAttacking){
            this.anims.play("run",true)
       }
        }
        //*attack
        if(Phaser.Input.Keyboard.JustDown(this.scene.keys.z)&&!this.isAttacking){
            this.isAttacking=true
            this.x -= 35;
            this.anims.play("attack",true).on("animationcomplete",()=>{
                this.isAttacking=false 
          
            })  

            const direction = this.flipX ? 'left' : 'right';
            const offsetX = this.flipX ? -90 : 90; // ajusta la posición de salida del disparo según la dirección

            this.scene.createBeam(this.x + offsetX, this.y - 22,direction);
          
        if(direction==="left"){
            this.x+=70
        }

            
        }
    }
}
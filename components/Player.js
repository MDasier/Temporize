export default class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture){
        super(scene)

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
            frames:this.anims.generateFrameNumbers("jump",{start:0,end:7}),
            frameRate:10,
            repeat:-1
        })
    }

    update(){
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
        }else if(!this.body.touching.down){
            this.anims.play("jump",true)
        }else{
            this.anims.play("run",true)
        }
    }
}
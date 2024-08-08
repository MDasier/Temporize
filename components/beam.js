export default class Beam extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, flipX, velocity , scale, lifetime , width , height ) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.flipX = flipX;
        this.velocity = velocity;
        this.lifetime = lifetime;
       

        // agrega el objeto Beam al sistema de físicas y a la escena
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        // configura el tamaño del cuerpo y que no se quede en la pantalla estancada
        this.setCollideWorldBounds(false);
        this.setScale(scale);
        this.body.setSize(width, height, true);

        // destruye el beam después del tiempo especificado
        this.scene.time.delayedCall(this.lifetime, () => {
            this.destroy(); 
        });
    }

    update() {
        this.setVelocityY(0); // establece la velocidad en "y" a 0 para anular la gravedad
        this.setVelocityX(this.flipX ? -this.velocity : this.velocity); // establece la velocidad en X según flipX
    }
}
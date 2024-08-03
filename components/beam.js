export default class Beam extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, flipX, velocity , scale, lifetime , width , height ) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.flipX = flipX;
        this.velocity = velocity;
        this.lifetime = lifetime;

        // Agrega el objeto Beam al sistema de físicas y a la escena
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        // Configura el tamaño del cuerpo y otras propiedades
        this.setCollideWorldBounds(false);
        this.setScale(scale);
        this.body.setSize(width, height, true);

        // Destruye el objeto Beam después del tiempo especificado
        this.scene.time.delayedCall(this.lifetime, () => {
            this.destroy(); 
        });
    }

    update() {
        this.setVelocityY(0); // Establece la velocidad en Y a 0 para anular la gravedad
        this.setVelocityX(this.flipX ? -this.velocity : this.velocity); // Establece la velocidad en X según flipX
    }
}
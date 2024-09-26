export default class EnemyBeam extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    velocity,
    scale,
    lifetime,
    width,
    height
  ) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.velocity = velocity;
    this.lifetime = lifetime;
    this.enemyBeamCollider=null;
    this.velocityX = this.scene.player.x-this.x//Si lo queremos más fácil multiplicamos los valores por 0.5
    this.velocityY = this.scene.player.y-this.y
    
    // agrega el objeto Beam al sistema de físicas y a la escena
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    // configura el tamaño del cuerpo y que no se quede en la pantalla estancada
    this.setCollideWorldBounds(false);
    this.setScale(scale);
    this.body.setSize(width, height, true);
    this.setVelocityY(this.velocityY); // establece la velocidad en "y" a 0 para anular la gravedad
    this.setVelocityX(this.velocityX);
    // destruye el beam después del tiempo especificado
    this.scene.time.delayedCall(this.lifetime, () => {
      this.destroy();
    });
    this.checkCollisionWithPlayer()
  }

  checkCollisionWithPlayer(){
    this.enemyBeamCollider = this.scene.physics.add.overlap(this, this.scene.player,(enemyBeam,player)=>{

      if(!player.isInvencible){
        player.isInvencible = true;

        player.preFX.setPadding(32);
        const damageGlow = player.preFX.addGlow(0xff0000,6,1,false); 
        player.coins -= 5
        if(player.coins<0){
          player.coins=0
        }
        this.scene.scoreText.text = `Score: ${player.coins}`

        this.scene.time.delayedCall(300, () => {
          player.isInvencible = false;
          player.preFX.remove(damageGlow)
        });
      }

    })
  }

  update() {
  }
}
let shootTimer = 0
export default class FlyingEnemy extends Phaser.GameObjects.Sprite {
  
  constructor(scene, x, y, player) {
    super(scene, x, y, "flyingEnemy");
    this.sceneRef = scene; //esto me gustaria mirarlo mejor, se guarda una copia de la escena y así siempre hay un "backup" para cuando se destruye

    //* LOG DE ENEMIGO
    //console.log(`El enemigo volador se creó en x=${x}, y=${y}`)
    

    this.scene = scene;
    this.player = player;
    this.speed = 0.1; //velocidad de movimiento, probando
   /*  this.floatTime = 0; //para controlar el tiempo que el enemigo está flotando en pantalla antes de irse
    this.shootInterval = 5000; //5 segundos para disparar
    this.lastShootTime = 0; //contador de tiempo para el disparo
    this.isFloating = false; //empieza moviendose */
    this.setVisible(true);
    this.setDepth(1);
    this.setTexture("flyingEnemy");
    this.setPosition(x, y);
    this.setScale(2);

    //! asegurarse de que se crea dentro de los limites de la camara
    const camera = this.scene.cameras.main;
    const minX = camera.worldView.x + 100;
    const maxX = camera.worldView.right - 100;
    const minY = camera.worldView.y + 100;
    const maxY = camera.worldView.bottom - 100;

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    //para moverlo
    this.velocityX = -2; //mov horizontal, negativa izquierda
    this.velocityY = 0.015; //mov vertical
    this.amplitude = 3;
    this.frequency = 10;

    this.createAnimation = this.createAnimation.bind(this);
    this.createAnimation()
    this.anims.play("fly");
    }
    createAnimation() {
      this.anims.create({
        key: "fly",
        frames: this.anims.generateFrameNumbers(this.texture.key, {
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
  }
  
  shootBeam() {
    const beam = this.scene.add.sprite(this.x, this.y, 'fire'); 
    beam.setScale(0.8); 
   
    
   const player = this.scene.player; 
    const beamSpeed = 800; //  velocidad del bea,m
  
    this.scene.tweens.add({
      targets: beam,
      x: player.x,
      y: player.y,
      duration: beamSpeed,
      onComplete: () => {
        beam.destroy(); 
      }
    });
    //efecto visual pulsación 
    this.scene.tweens.add({
      targets: beam,
      scaleX: 0.6,
      scaleY: 0.6,
      duration: 100,
      yoyo: true,
      repeat: -1
    });

  }
  update(time, delta) {
    //movimiento horizontgital
    this.x += this.velocityX;

    //efecto flotar
    //todo no sale, hay que revisar
    //this.y += Math.sin(this.frequency * time) * this.amplitude;
    //this.y += Math.sin(this.frequency * time + Math.cos(this.frequency * time * 0.5)) * this.amplitude;
    //this.y += Math.sin(this.frequency * time) * this.amplitude * Math.cos(this.frequency * time * 0.5);
    this.y += this.velocityY;
    this.velocityY += Math.sin(this.frequency * time) * this.amplitude * 0.05;
    //this.velocityY *= 0.99; // Desaceleración

    //rebotar en los bordes superiores y mitad de pantalla

    if (this.y <= 0 || this.y - this.scene.game.config.height >= this.scene.game.config.height) {
      this.velocityY *= -1
    }
    if (this.y >= this.scene.game.config.height/2 ) {
      this.velocityY *= -1
    }
     

    //Destruir enemigo cuando sale de la pantalla y crear uno nuevo.

    if (this.x < 0 || this.x > this.scene.game.config.width) {
      this.destroy();
      //console.log("destruido enemigo");
      this.sceneRef.createFlyingEnemy();
    }

    //disparo enemigo
    if (shootTimer <= 0) {
      shootTimer = Phaser.Math.Between(1000, 1000); // 2-5 segundos en milisegundos
      this.shootBeam();
    } else {
      shootTimer -= delta;
    }
  }

}

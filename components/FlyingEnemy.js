export default class FlyingEnemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, player){

        super(scene, x, y, "flyingEnemy");
        console.log(`El enemigo volador se creó en x=${x}, y=${y}`)

        this.scene = scene;
        this.player = player;
        this.speed = 200; //velocidad de movimiento, probando
        this.floatTime = 0; //para controlar el tiempo que el enemigo está flotando en pantalla antes de irse
        this.shootInterval = 5000; //5 segundos para disparar
        this.lastShootTime = 0; //contador de tiempo para el disparo
        this.isFloating = false; //empieza moviendose
    }
    update(time, delta){
        
        //delta tiempo transcurrido desde el ultimo frame en milisec
        if (this.isFloating){ //si el enemigo está flotando incrementa el tiempo de flotacion en milisecs
            this.floatTime += delta;
            if (this.floatTime  >= 3000){ //cuando alcanza los 3 segundos la flotacion acaba y se va hacia la izquierda
                this.isFloating = false;
                this.floatTime = 0;
            }
        } else{
            this.x -= this.speed * delta;
            if (this.x < -this.width){
                this.destroy();
            }
        }
        if (time - this.lastShootTime >= this.shootInterval){
            this.lastShootTime = time;
            this.shoot();
        }
    }
    createFlyingEnemy(){
        const enemy = new FlyingEnemy(this, x, y, this.Player)
;       this.add.existing(enemy);
        enemy.body.velocity.x = 100; //100px sec
        this.setVisible(true); //para ver si aparece
        this.setDepth(1);
        this.setTexture('flyingEnemy');
        this.setScale(1);
    }

}

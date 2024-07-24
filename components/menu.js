 class Menu {

    constructor(scene){
        this.relatedScene = scene;
    }

    preload(){
        console.log("PRELOAD DE MENU")

        //*Si queremos cargar imagenes para los botones de opciones
        //this.relatedScene.load.spritesheet('spriteBoton','../img/Run.png',{frameWidth:100,frameHeight:100});
    }

    create(){
        console.log("CREATE DE MENU")

        //*Creamos el elemento del menu, le añadimos el sprite del preload y lo hacemos interactivo para el usuario.
        //this.menu1 = this.relatedScene.scene.add.sprite(posicionEnX,posicionEnY,'spriteBoton').setInteractive()


        //*Al 'menu1' le añadimos los eventos de raton. Over/Out y click.
        // this.menu1.on('pointerover',()=>{
        //     this.menu1.setFrame(1);
        // })
        // this.menu1.on('pointerout',()=>{
        //     this.menu1.setFrame(0);
        // })
        // this.menu1.on('pointerdown',()=>{
        //    this.relatedScene.scene.start('level1')
        //! PARA ESTO EN EL CONSTRUCTOR DE LA 'SCENE' NUEVA HACE FALTA DARLE UN NOMBRE CON: super({ key: 'nombre' })         
        // })
    }
}
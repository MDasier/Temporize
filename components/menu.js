export class Menu {

    //? Hola chicos, soy Asier. He pensado que como el menú de opciones lo podemos reutilizar en la pagina de inicio y en el modo 'pausa' del juego, lo nejor era separarlo en un componente a parte y llamarlo pasando la escena en la que queramos usarlo.

    constructor(scene){
        this.relatedScene = scene;
    }

    preload(){
        //*Si queremos cargar imagenes para los botones de opciones
        //this.relatedScene.load.spritesheet('nombreDelSprite','rutaDeLaImagen',{frameWidth:0,frameHeight:0});
    }

    create(){

        //*Creamos el elemento del menu, le añadimos el sprite del preload y lo hacemos interactivo para el usuario.
        //this.elemento1 = this.relatedScene.add.sprite(posicionEnX,posicionEnY,'nombreDelSprite').setInteractive()


        //*Al 'elemento1' le añadimos los eventos de raton. Over/Out y click.
        // this.elemento1.on('pointerover',()=>{
        //     this.elemento1.setFrame(1);
        // })
        // this.elemento1.on('pointerout',()=>{
        //     this.elemento1.setFrame(0);
        // })
        // this.elemento1.on('pointerdown',()=>{
        //     this.relatedScene.scene.start('keyDeLaEscenaNueva')
        //! PARA ESTO EN EL CONSTRUCTOR DE LA 'SCENE' NUEVA HACE FALTA DARLE UN NOMBRE CON: super({ key: 'nombre' })         
        // })
    }
}
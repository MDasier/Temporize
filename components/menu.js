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

        //campo texto en HTML
            const inputMinutes = document.createElement('input');
            inputMinutes.type = 'text';
            inputMinutes.style.fontSize = '30px';
            inputMinutes.style.color = '#ffffff';
            inputMinutes.style.textAlign = 'center';
            inputMinutes.style.position = 'absolute';
            inputMinutes.style.top = (this.cameras.main.centerY - 100 + timePlayingText.height) + 'px'; //hay que toquetear para centrar
            inputMinutes.style.left = this.cameras.main.centerX + 'px';
            inputMinutes.style.width = '200px';
            inputMinutes.style.height = '30px';
            inputMinutes.style.zIndex = '1000';
            inputMinutes.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            document.body.appendChild(inputMinutes);
            
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
 class Menu extends Phaser.Scene {

    constructor(scene){
        super("menu")
        this.relatedScene = scene;
    }

    preload(){
        console.log("PRELOAD DE MENU")


    }

    create(){
        console.log("CREATE DE MENU")
        this.add.text(20,20,"Opciones menu...")
    }
}
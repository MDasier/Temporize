
class InitialScene extends Phaser.Scene{
constructor(){
    super({key: "initialScene"});
}
create(){
    const timePlayingText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        'How many minutes do you want to play?',
        {fontSize: '30px',
            fill: '#ffffff',
            align: 'center'
        }
    );
    timePlayingText.setOrigin(0.5);

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


    //al pulsar enter el juego empieza y el tiempo es el input añadido
    inputMinutes.addEventListener("keydown", (event)=>{
        if (event.key === "Enter"){
            const inputValue = parseInt(inputMinutes.value, 10);
            if (!isNaN(inputValue)){
                this.scene.start("level1", {initialTimerValue: inputValue * 60})
            }
        }
    })
    
    this.menuOpciones = new Menu();
    this.menuOpciones.preload();
    this.menuOpciones.create();
    
}
}
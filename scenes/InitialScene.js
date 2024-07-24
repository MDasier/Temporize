

export default class InitialScene extends Phaser.Scene{
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

   //campo texto
   const inputMinutes = document.createElement('input');
   inputMinutes.type = 'number'; //solo acepta números
   inputMinutes.max = 59; //cap de tiempo en las flechitas
   inputMinutes.min = 1; //no se puede poner menos de 1 minuto(jamás cero)
   inputMinutes.addEventListener('change', ()=>{
    if (inputMinutes.value > inputMinutes.max){
        inputMinutes.value = inputMinutes.max;
    }
   }) //condicional para que no se añada por teclado más de 59 min.
   inputMinutes.style.fontSize = '30px';
   inputMinutes.style.color = '#ffffff';
   

   inputMinutes.style.textAlign = 'center';
   inputMinutes.style.display = 'flex';
   inputMinutes.style.justifyContent = 'center';
   inputMinutes.style.alignItems = 'center';
   inputMinutes.style.position = 'absolute';
   inputMinutes.style.top = '50%';
   inputMinutes.style.left = '50%';
   inputMinutes.style.transform = `translate(-50%, -50%)`;
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
                inputMinutes.remove();
            }
        }
    })
}
}
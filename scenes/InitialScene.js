
export default class InitialScene extends Phaser.Scene {
  constructor() {
    super({ key: "initialScene" });
  }

  create() {

    this.backButton = this.add.text(100, 100, 'BACK', { fill: '#0f0' })
     .setInteractive()
     .on('pointerdown', () => this.backButtonDown() )
     .on('pointerover', () => this.backButtonOver() )
     .on('pointerout', () => this.backButtonOut() )

    const timePlayingText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      "How many minutes do you want to play?",
      { fontSize: "30px", fill: "#ffffff", align: "center" }
    );
    timePlayingText.setOrigin(0.5);

    //campo texto
    this.inputMinutes = document.createElement("input");
    this.inputMinutes.type = "number"; //solo acepta números
    this.inputMinutes.max = 59; //cap de tiempo en las flechitas
    this.inputMinutes.min = 3; //el mínimo siempre será cero para que el boss dure almenos 2 minutos.
    this.inputMinutes.value = 3//!if VARIABLE LOCAL == 0 => 3 else VALOR DE LA VARIABLE LOCAL
    this.inputMinutes.addEventListener("keyup", () => {
      console.log("keydown en campo");
      if (Number(this.inputMinutes.value) > 59) {
        this.inputMinutes.value = 59;
      }
      if (Number(this.inputMinutes.value) <= 3) {
        this.inputMinutes.value = 3;
      }

    });
    this.inputMinutes.style.fontSize = "30px";
    this.inputMinutes.style.color = "#ffffff";

    this.inputMinutes.style.textAlign = "center";
    this.inputMinutes.style.display = "flex";
    this.inputMinutes.style.justifyContent = "center";
    this.inputMinutes.style.alignItems = "center";
    this.inputMinutes.style.position = "absolute";
    this.inputMinutes.style.top = "50%";
    this.inputMinutes.style.left = "50%";
    this.inputMinutes.style.transform = `translate(-50%, -50%)`;
    this.inputMinutes.style.width = "200px";
    this.inputMinutes.style.height = "30px";
    this.inputMinutes.style.zIndex = "1000";
    this.inputMinutes.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    document.body.appendChild(this.inputMinutes);

    //al pulsar enter el juego empieza y el tiempo es el input añadido
    this.inputMinutes.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const inputValue = parseInt(this.inputMinutes.value, 10);
        if (!isNaN(inputValue)) {
          /* this.scene.get("level1") */

          //this.scene.restart("level1")
          //this.scene.remove("level1")
          //this.scene.add("level1",  new Scene())

          this.scene.start("level1", { initialTimerValue: inputValue * 60 });
         /*  if(this.scene.isPaused == true){
            this.scene.resume()
          } */
          this.inputMinutes.remove();
          
        }
      }
    });
  }
  backButtonDown(){
    this.inputMinutes.remove();
    this.scene.start("menu")
  }

  backButtonOver() {
    this.backButton.setStyle({ fill: '#ff0'});
  }

  backButtonOut() {
    this.backButton.setStyle({ fill: '#0f0' });
  }
}

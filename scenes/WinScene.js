// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class WinScene extends Phaser.Scene {
  constructor() {
    super("win");
  }

  init(data) {
    this.score = data.score || 0;
  }

  preload() {
    this.load.image("sky", "./public/assets/FondoMenu.jpg");
    this.load.image("winner", "./public/assets/Ganador.png");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

    this.add.image(400, 200, "winner").setScale(0.19).setOrigin(0.5, 0.3);

    this.add.text(400, 50, "¡GANASTE!", {
      fontSize: "64px",
      fill: "#00ff00",
    }).setOrigin(0.5);

    this.add.text(400, 500, `Puntos: ${this.score}`, {
      fontSize: "32px",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(400, 550, "Presiona R para reiniciar", {
      fontSize: "24px",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.start("game");
    }
  }
}

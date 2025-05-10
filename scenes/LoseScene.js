// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class LoseScene extends Phaser.Scene {
  constructor() {
    super("lose");
  }

  init(data) {
    this.score = data.score || 0;
  }

  preload() {
    this.load.image("sky", "./public/assets/FondoMenu.jpg");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

    this.add.text(400, 200, "¡PERDISTE!", {
      fontSize: "64px",
      fill: "#ff0000",
    }).setOrigin(0.5);

    this.add.text(400, 300, `Puntos: ${this.score}`, {
      fontSize: "32px",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(400, 400, "Presiona R para reiniciar", {
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
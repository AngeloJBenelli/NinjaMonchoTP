// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/FondoMenu.jpg");
    this.load.image("logo", "./public/assets/Ninja.png");
  }

  create() {
    // this is called after the scene is created
    this.add.image(400, 300, "sky");

    this.add.text(400, 200, "Ninja Moncho", {
      fontSize: "64px",
      fill: "#ffff00",
    }).setOrigin(0.5);

    this.add.text(400, 400, "Presiona al Ninja para empezar", {
      fontSize: "32px",
      fill: "#000000",
    }).setOrigin(0.5)

    const logo = this.physics.add.image(400, 100, "logo");
    logo.setScale(0.10);
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
    logo.setInteractive();

    logo.on("pointerdown", () => {
     this.scene.start("game");
    });


  }

}

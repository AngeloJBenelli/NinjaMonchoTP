// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {
    this.load.image("fondo", "./public/assets/Cielo.webp");
    this.load.image("ground", "./public/assets/platform.png");
    this.load.image("triangulo", "./public/assets/triangle.png");
    this.load.image("cuadrado", "./public/assets/square.png");
    this.load.image("rombo", "./public/assets/diamond.png");
    this.load.image("rayo", "./public/assets/Bolt.png");
    this.load.image("ninja", "./public/assets/Ninja.png");
  }

  create() {
    this.add.image(400, 300, "fondo").setDisplaySize(800, 600);

    // Plataformas en la parte inferior
    this.platforms = this.physics.add.staticGroup();
    const platformScale = 0.4; // Ancho reducido

    const platform1 = this.platforms.create(150, 350, "ground");
    platform1.setScale(platformScale, 1).refreshBody();

    const platform2 = this.platforms.create(400, 500, "ground");
    platform2.setScale(platformScale, 1).refreshBody();

    const platform3 = this.platforms.create(650, 250, "ground");
    platform3.setScale(platformScale, 1).refreshBody();

    // Jugador
    this.player = this.physics.add.sprite(400, 450, "ninja");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.physics.add.collider(this.player, this.platforms);

    // Figuras geométricas
    this.figureTypes = ["triangulo", "cuadrado", "rombo"];
    this.figurePoints = { triangulo: 10, cuadrado: 15, rombo: 20 }; // valores base
    this.currentInterval = 4000; // 4 segundos en ms

    //Rayo
    this.time.addEvent({
      delay: 3000, // cada 3 segundos
      callback: this.spawnRayo,
      callbackScope: this,
      loop: true,
    });

    this.figures = this.physics.add.group();
    this.rayos = this.physics.add.group();
    this.spawnNextFigure(); // inicia la primera figura

    // Registrar figuras recolectadas
    this.recolectadas = []; // <- guardará strings como 'triangulo', 'cuadrado', etc.

    // Score y UI
    this.score = 0;
    this.win = false;
    this.scoreText = this.add.text(16, 16, "Puntos: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.timerText = this.add.text(784, 16, "", {
      fontSize: "32px",
      fill: "#000",
    }).setOrigin(1, 0);

    // Timer
    this.timeLeft = 31;
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
  if (this.win) return;

  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
  } else {
    this.player.setVelocityX(0);
  }

  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }

  if (this.restartKey.isDown) {
    this.scene.restart();
  }

  if (this.player.y > 570 && !this.gameOver) {
    this.scene.start("lose", { score: this.score });
  }

  // Destruir rayos que caen más allá del fondo
  this.rayos.getChildren().forEach((rayo) => {
    if (rayo.y > 560) {
      rayo.destroy();
    }
  });
}

  updateTimer() {
    if (this.win) return;

    this.timeLeft -= 1;
    this.timerText.setText(`Tiempo: ${this.timeLeft}`);

    if (this.timeLeft <= 0) {
      if (this.timeLeft <= 0) {
        this.scene.start("lose", {score: this.score}); // Cambia a la escena de derrota
      }
    }
  }

  collectFigure(player, figura) {
    const tipo = figura.texture.key;
    let puntos = 0;

    switch (tipo) {
      case "triangulo":
        break;
      case "cuadrado":
        break;
      case "rombo":
        break;
    }

    figura.disableBody(true, true);
    this.score += puntos;
    this.scoreText.setText(`Puntos: ${this.score}`);

    if (this.figuras.countActive(true) === 0 && !this.win) {
      this.spawnFigures();
      this.timeLeft = 30;
      this.timerText.setText(`Tiempo: ${this.timeLeft}`);
    }
  }

  spawnNextFigure() {
    if (this.gameOver) return;
  
    // Elegir tipo aleatorio
    const type = Phaser.Utils.Array.GetRandom(this.figureTypes);
    const x = Phaser.Math.Between(100, 700);
    const figure = this.figures.create(x, 0, type);
  
    figure.setBounce(1);
    figure.setCollideWorldBounds(true);
    figure.setVelocity(Phaser.Math.Between(-100, 100), 100);
    figure.setScale(0.5); // Escala del sprite
    figure.allowGravity = true;
    figure.points = this.figurePoints[type];
  
    // Colisión con plataformas
    this.physics.add.collider(figure, this.platforms, () => {
      if (!figure.active) return;
  
      figure.points -= 5;
      if (figure.points <= 0) {
        figure.destroy();
      }
    });
  
    // Colisión con jugador
    this.physics.add.overlap(this.player, figure, () => {
     if (!figure.active) return;

     this.score += figure.points;
     this.scoreText.setText(`Puntos: ${this.score}`);
  
     // Guardar tipo en array
     this.recolectadas.push(figure.texture.key);

     figure.destroy();

     // Verificar condición de victoria
     if (this.score >= 100 && this.RecolectadorDeCadaTipo() && !this.win) {
       this.win = true;
       this.scene.start("win", { score: this.score });
      }
    });
  
    // Programar próxima figura
    this.currentInterval = Math.max(500, this.currentInterval - 500); // mínimo 0.5 segundos
    this.time.delayedCall(this.currentInterval, this.spawnNextFigure, [], this);
  }

  RecolectadorDeCadaTipo() {
    const contador = {
      triangulo: 0,
      cuadrado: 0,
      rombo: 0,
    };
  
    for (const tipo of this.recolectadas) {
      if (contador.hasOwnProperty(tipo)) {
        contador[tipo]++;
      }
    }
  
    return (
      contador.triangulo >= 2 &&
      contador.cuadrado >= 2 &&
      contador.rombo >= 2
    );
  }

  spawnRayo() {
    const x = Phaser.Math.Between(100, 700);
    const rayo = this.rayos.create(x, 0, "rayo");
  
    rayo.setScale(64 / 1080); // Escalar de 1080px a aprox. 64px
    rayo.setVelocityY(200); // Caída recta hacia abajo
    rayo.setCollideWorldBounds(true);
    rayo.setBounce(0); // Sin rebote
    rayo.body.allowGravity = true;
    rayo.setGravityY(500); // fuerza de caída personalizada
  
    // Desaparecer al tocar una plataforma
    this.physics.add.collider(rayo, this.platforms, () => {
      rayo.destroy();
    });
  
    // Desaparecer si toca el suelo (parte inferior)
    rayo.checkWorldBounds = true;
    rayo.outOfBoundsKill = true;
  
    // Colisión con jugador
    this.physics.add.overlap(this.player, rayo, () => {
      if (!rayo.active) return;
  
      this.score -= 20;
      if (this.score < 0) this.score = 0;
      this.scoreText.setText(`Puntos: ${this.score}`);
      rayo.destroy();
    });
  }
}

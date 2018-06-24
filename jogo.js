var x = 0;
var y = 400; //Coordenadas da nave
var posX = [];
var posY = []; //Coordenadas de alienigena
var xd = [];
var yd = []; //coordenas do satelete
var Tam = 100; //tamanho do satelete
var diametroObj = 90; //tamanho do alienigena
var xdis, ydis; //Variavel disparo
var vx = [];
var vy = []; // Vetores velocidade do alienigena
var vsx = [];
var vsy = []; // Vetores velocidade do satelite
var disparo = false;
var vidas = 4;
var pontos = 0;
var nivel = 1;
var barreiraDePontos = 10;
var img, terra, sat, meteoro;
var mudar = 0;
var cont = 5;
var astronauta;
var telaInicial = true;
var gameOver = false;
var marteY = -600;
var marteX; //random(50, 700);
var animacao = [];
var temp = 1;
var movendo = false;
var marte;
var posicaoSateliteX = 0;
var posicaoSateliteY = 0;
var para = false;
var qauntidadeAlienigena = 2;
var boss;
var bossY = -200;
var bossX = -200;
var target;
var tempX;
var tempY;
var introSound;
var movimentacaoSom;
var play = true;
var playBoss = false;

function preload() {
  img = loadImage("imagens/telafundo.jpg");
  terra = loadImage("imagens/tundra.png");
  meteoro = loadImage("imagens/meteoro.png");
  sat = loadImage("imagens/satelite.png");
  astronauta = loadImage("imagens/astronauta.png");
  marte = loadImage("imagens/marte.png");
  boss = loadImage("imagens/ufo.png");
  target = loadImage("imagens/target.png");
  
  introSound = loadSound('/sounds/intro.wav');
  movimentacaoSom = loadSound('/sounds/movimentacao.wav');

  for (var i = 1; i <= 2; i++) {
    animacao[i] = loadImage('imagens/nave(' + i + ').png');
  }
}

function setup() {
  createCanvas(1260, 635);

  iniciaQuantidadeAlienigenas();

  marteX = random(50, 1000);
  tempX = random(-50, 230);
  tempY = random(-100, 260);
  bossX = random(300, 1000);
}

function draw() {
  frameRate(30);
  if (temp > 2) {
    temp = 1;
  }



  if (telaInicial) {
    mostraTelaInicial();
  } else {
    play = false;
    introSound.stop();


    marteY += 0.5;

    background(img);
    push();
    imageMode(CENTER);
    image(marte, marteX, marteY + 100, 655, 655);
    image(target, (marteX + tempX), (marteY + tempY), 250, 250);
    console.log((marteY + tempY));
    pop();
    noStroke();
    if (!movendo) {
      push();
      imageMode(CENTER);
      image(animacao[2], x, y, 60, 100);
      pop();
    }

    resetaPosicaoFoguete();

    if (nivel == 2) {
      if (!para) {

        para = true;
        posicaoSateliteX = random(40, 1000);
      }
      image(sat, posicaoSateliteX, posicaoSateliteY, Tam, Tam);
      posicaoSateliteY += 1
    }

    //colisao com boss
    if (dist(bossX, bossY, x, y) < 400 / 2 + 25) {
      terminouJogo();
    }

    // colisão do objeto
    for (i = 0; i < qauntidadeAlienigena; i++) {
      if (dist(posX[i], posY[i], x, y) < 90) {
        posX[i] = 1360;
        posY[i] = 100;
        vidas -= 1;
      }

      if (posY[i] < 635) {
        if (nivel == 2) {
          posY[i] = posY[i] + vy[i];
          posX[i] = posX[i] + vx[i];
        } else if (nivel == 1) {
          posY[i] += vy[i];
          posX[i] += vx[i];
        } else {
          posY[i] = posY[i] + vy[i];
          posX[i] = posX[i] + vx[i];
        }
      } else {
        posY[i] = random(0, 300);
        posX[i] = random(0, 1360);
      }

      // colisao do disparo com disco voador
      if (dist(xdis, ydis, posX[i], posY[i]) < (diametroObj / 2) + 4) {
        disparo = false;
        xdis = -10;
        ydis = -10;
        posX[i] = 1360;
        posY[i] = 635;
        pontos++;

        if (pontos == 4) {
          nivel = 2;
          qauntidadeAlienigena = 6;

          iniciaQuantidadeAlienigenas();
        }
        if (pontos == 10) {
          nivel = 3;
          qauntidadeAlienigena = 7;
          playBoss = true;
          iniciaQuantidadeAlienigenas();
        }
        if (pontos == 15) {
          nivel = 4;
          qauntidadeAlienigena = 10;
          playBoss = true;
          iniciaQuantidadeAlienigenas();
        }
      }

      if (keyIsDown('32') && (!disparo)) {
        disparo = true;
        xdis = x;
        ydis = y - 30;
      }
      if (disparo) {

        if (ydis < 0) {
          disparo = false;
        } else {
          ydis -= 15
        }
        ellipse(xdis, ydis, 8, 8);
      }

      // colisao com satelite
      if (dist(posicaoSateliteX, posicaoSateliteY + 50, x, y) < Tam / 2 + 25) {
        vidas++;
        posicaoSateliteY = -300;
        posicaoSateliteX = random(50, 900);
      }

      if (yd[i] < 635) {
        yd[i] = yd[i] + vsy[i];
        xd[i] = xd[i] + vsx[i];
      } else {
        yd[i] = 0;
        xd[i] = random(0, 1360);
      }

      push()
      imageMode(CENTER);
      image(meteoro, posX[i], posY[i], diametroObj + 40, diametroObj - 10);
      pop();
    }

    movimentacaoFoguete();
    mostraIndicadores();


    temp++;
    if (nivel == 4) {
      bossY = bossY + 0.8;
      push();
      imageMode(CENTER);
      image(boss, bossX, bossY, 800, 400);
      pop();
    }

    if (dist((marteX + tempX), (marteY + tempY), x, y) < 100 && nivel == 4) {
      background(0);
      //acaba o jogo. nenhuma tela eh mais renderizada
      push();
      imageMode(CENTER);
      image(astronauta, width / 2, 250, 450, 470);
      fill(255);
      textAlign(CENTER);
      text("parabens", width / 2, 550);
      pop();
      movimentacaoSom.stop();
      playBoss = false;
      noLoop();
    }

    if (vidas == 0) {
      terminouJogo();
    }
    playSounds();
  }
  playSounds();
}

function mostraTelaInicial() {
  background(0);
  push();
  imageMode(CENTER);
  image(astronauta, width / 2, 250, 350, 470);
  fill(255);
  textAlign(CENTER);
  text("Para Iniciar Tecle ENTER", width / 2, 500);
  pop();
}

function keyPressed() {
  //tela inicial
  if (keyCode === ENTER) {
    telaInicial = false;
  }
}

function keyReleased() {
  movendo = false;
}

function movimentacaoFoguete() {
  if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW)) {
    movendo = true;
    x -= 10;
    y -= 10;
    push();
    translate(x, y);
    rotate(-45);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 90);
    pop();
  } else if (keyIsDown(RIGHT_ARROW) && keyIsDown(UP_ARROW)) {
    movendo = true;
    x += 10;
    y -= 10;
    push();
    translate(x, y);
    rotate(45);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  } else if (keyIsDown(RIGHT_ARROW) && keyIsDown(DOWN_ARROW)) {
    movendo = true;
    x += 10;
    y += 10;
    push();
    translate(x, y);
    rotate(60);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  } else if (keyIsDown(DOWN_ARROW) && keyIsDown(LEFT_ARROW)) {
    movendo = true;
    x -= 10;
    y += 10;
    push();
    translate(x, y);
    rotate(60);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  } else if (keyIsDown(RIGHT_ARROW)) {
    movendo = true;
    x += 10;
    push();
    translate(x, y);
    rotate(45);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  } else if (keyIsDown(LEFT_ARROW)) {
    movendo = true;
    x -= 10;
    push();
    translate(x, y);
    rotate(-45);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  } else if (keyIsDown(DOWN_ARROW)) {
    movendo = true;
    y += 10;
    push();
    translate(x, y);
    rotate(60);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  } else if (keyIsDown(UP_ARROW)) {
    y -= 10;
    movendo = true;
    push();
    translate(x, y);
    rotate(0);
    imageMode(CENTER);
    image(animacao[2], 0, 0, 50, 100);
    pop();
  }
}

function resetaPosicaoFoguete() {

  if (x < 25)
    x = x + diametroObj;

  if (x > 1335)
    x = x - diametroObj;

  if (y < 25)
    y = y + diametroObj;

  if (y > 610)
    y = y - diametroObj;
}

function iniciaQuantidadeAlienigenas() {
  for (i = 0; i < qauntidadeAlienigena; i++) {
    yd[i] = 0;
    xd[i] = random(0, 1360);

    if (nivel == 1) {
      posY[i] = -60;
    } else if (nivel == 2) {
      posY[i] = -50;
    } else if (nivel == 3) {
      posY[i] = -100;
    }
    posX[i] = random(0, 1360);
    vx[i] = random(-5, 5);
    vy[i] = random(5, 10);
    vsx[i] = random(-6, 6);
    vsy[i] = random(6, 15);
  }
}

function mostraIndicadores() {
  textSize(32);
  fill(255);
  text("Vidas: " + vidas, 10, 60);
  text("Pontos: " + pontos, 10, 90);;
  text("Nível: " + nivel, 10, 120);
}

function playSounds() {
  if (play) {
    introSound.setVolume(0.1);
    introSound.play();
    introSound.loop();
    play = false;
    playBoss = true;
  }

  if (playBoss) {
    movimentacaoSom.setVolume(2);
    movimentacaoSom.play();
    movimentacaoSom.setLoop(playBoss);
    playBoss = false;
  }
}

function terminouJogo() {
  background(0);
  push();
  imageMode(CENTER);
  image(astronauta, width / 2, 250, 430, 470);
  fill(255);
  textAlign(CENTER);
  text("GAME OVER", width / 2, 550);
  pop();
  movimentacaoSom.stop();
  playBoss = false;
  noLoop();
}

var runner, runner_running, runner_death;
var jungleImage;
var emerald, emeraldImage, obstacle,obstacleImage, obstacleWall;
var diamond,diamondImage, arrow, arrowImage;
var emeraldGroup, diamondGroup, arrowGroup, obstacleGroup, obstacleWallGroup;
var ground,groundImage; 
var score = 0;
var PLAY = 1
var END = 0
var gameState = PLAY
var survivalTime = 0;
var restart, gameOver;


function preload(){
  jungleImage = loadImage("background.png");
  obstacleImage = loadImage("stone.png");
  emeraldImage = loadImage("emerald.png");
  diamondImage = loadImage("diamond.png")
  arrowImage = loadImage("arrow.png")
  
  
  runner_running = loadAnimation("bib1.png", "bib2.png", "bib3.png", "bib4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  runner_death = loadAnimation("RIP.png");
}

function setup() {
  createCanvas(600,400);
  
  runner = createSprite(80,315,20,20);
  runner.addAnimation("moving", runner_running);
  runner.scale = 0.8
  runner.setCollider("circle", -2, 2, 55)
  
  ground = createSprite(400,350,99999000,10)
  ground.velocityX = -4;
  ground.x = ground.width/2;
  ground.addImage = groundImage;
  ground.visible = true;
  
  emeraldGroup = new Group();
  obstacleGroup = new Group();
  obstacleWallGroup = new Group();
  diamondGroup = new Group();
  arrowGroup = new Group();
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  background("black");
  
  textSize(20);
  text("Survival Time ="+survivalTime,380,60);
  
  textSize(20);
  text("Score ="+score,80,60);
  
 if (gameState===PLAY){
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
   
  if(ground.x<0) {
   ground.x = ground.width/2
 }
  
 if(keyDown("space") && runner.y >= 240) {
  runner.velocityY = -12
 }
  
 runner.velocityY = runner.velocityY + 0.8; 
  
 runner.collide(ground);
 
 
  emeralds();
  obstacles();
  diamond();
  arrow();
  
 for(var i=0;i<emeraldGroup.length;i++){
   if(emeraldGroup.get(i).isTouching(runner)){
     emeraldGroup.get(i).destroy();
     score=score+1
   }
 }

 for(var i=0;i<diamondGroup.length;i++){
  if(diamondGroup.get(i).isTouching(runner)){
    diamondGroup.get(i).destroy();
    score=score+3
  }
}

for(var i=0;i<arrowGroup.length;i++){
  if(arrowGroup.get(i).isTouching(runner)){
    arrowGroup.get(i).destroy();
    score=score-2
  }
}

  //if(runner.isTouching(emeraldGroup)) {
   // score = score+1;
  //}
   if(runner.isTouching(obstacleGroup)){
     gameState = END
   } 
 }   
else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    runner.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    emeraldGroup.setVelocityXEach(0);
    diamondGroup.setVelocityXEach(0);
    arrowGroup.setVelocityXEach(0);
    
    obstacleGroup.setLifetimeEach(-1);
    emeraldGroup.setLifetimeEach(-1);
    diamondGroup.setLifetimeEach(-1);
    arrowGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }  
  
  drawSprites();
}

function emeralds() {
 if(frameCount % 80== 0) {
    var emerald = createSprite(600,165,10,40)
    emerald.addImage(emeraldImage);
    emerald.velocityX = -6
    emerald.scale = 0.4;
    emeraldGroup.add(emerald);
    emerald.lifetime = 200;
    emerald.y = Math.round(random(120,200));
    emerald.depth = runner.depth-1;
}
}

function obstacles() {
 if(frameCount % 300 === 0) {
    var obstacle = createSprite(600,310,20,20);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -6;
    obstacleGroup.add(obstacle);
    obstacle.scale = 0.1  ;
    obstacle.lifetime = 200;
    var obstacleWall = createSprite(600,310,5,20);
    obstacleWall.x = obstacle.x-15;
    obstacleWall.visible = false; 
    obstacleWallGroup.add(obstacleWall);
}
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  emeraldGroup.destroyEach();
  diamondGroup.destroyEach();
  
  score = 0;
  survivalTime = 0;
  runner.changeAnimation(runner_running)
}

function diamond() {
  if(frameCount % 90== 0 && survivalTime> 1000) {
    var diamond = createSprite(600,165,10,40)
    diamond.addImage(diamondImage);
    diamond.velocityX = -6
    diamond.scale = 0.2;
    diamondGroup.add(diamond);
    diamond.lifetime = 200;
    diamond.y = Math.round(random(120,200));
    diamond.depth = runner.depth-1;
  }
}

function arrow(){
  if(frameCount % 120== 0 && survivalTime> 2000) {
    var arrow = createSprite(600,165,10,40)
    arrow.addImage(arrowImage);
    arrow.velocityX = -6.5
    arrow.scale = 0.05;
    arrowGroup.add(arrow);
    arrow.lifetime = 200;
    arrow.y = Math.round(random(120,200));
    arrow.depth = runner.depth-1;
  }
}
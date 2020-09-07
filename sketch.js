//created the gameState
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//created the trex and gave animation
var trex, trex_running, trex_collided;
//created ground and invisibleGround and gave ground a animation
var ground, invisibleGround, groundImage;
//created the cloud group and Image
var cloudsGroup, cloudImage;
//created the obstacles and gave images
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//created score
var score;
//created "game over" & "restart" button
var gameOverImg,restartImg;
//declared the sounds
var jumpSound , checkPointSound, dieSound;

function preload(){
  // gave trex an animation
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
   //gave ground a image
  groundImage = loadImage("ground2.png");
  //gave cloud a image
  cloudImage = loadImage("cloud.png");
  //gave obstacles images
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //gave restart and gameOver Image
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  // loaded the sounds
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  
  //created the canvas
  createCanvas(600, 200);

  //created trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //scaled trex
  trex.scale = 0.5;
  
  //created ground and gave animation
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  //made the ground scroll
  ground.x = ground.width /2;
  
  //created the gameOver sprite and restart button
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 //scaled gameover
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //created the invisible ground
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //sett the collider of trex
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  //score's intial value
  score = 0;
  
}

function draw() {
  
  //clears the background
  background(180);
  //displaying score
  text("Score: "+ score, 450,50);
  
  
  if(gameState === PLAY){
    //made the gameover and restart invisible
    gameOver.visible = false;
    restart.visible = false;
    
    //move the ground and adapt to the score
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //plays checkPoint sound when the score is a multiple of 100;
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //reset the ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y > 161) {
        trex.velocityY = -12;
      //added the sound when it jumps
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //check for collision
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
      //added the sound when it dies
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
     
     //made the gameOver and restart visble
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
       
     //stops the ground & trex
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
     //if mouse presses restart then resets it
     if(mousePressedOver(restart)) {
      reset();
    }

   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  

  drawSprites();
}

function reset(){
  gameState = PLAY;
  score = 0;
  trex.changeAnimation("running" , trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(4 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   obstacle.depth = trex.depth;
   trex.depth = trex.depth + 1;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


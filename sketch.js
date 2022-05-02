let gameState, worldTimer, removal, renderItems, side, spawn, blood, blockShadows, randomTextures, entityShadows, fadeOpac, followZom, prevFollowZom, camPos, playerPos, player, gridSize, terrainTextures, noiseAmnt, showCoords, showHitboxes, showPath, terrainSize, updateFR, currentFR, zombies, pathCount, splats, deathParticles, particles, screenUi, deltaTime, timeMult, frameMult, pauseMult, itemVals;

let splashText, playTexture, gameOverText, hotbar, healthTexture;
let groundTexture, waterTexture, stoneTexture, woodTexture, leafTexture;
let rangeTexture;
let vignette;
let zombieTexture, playerTexture;
let stone, grass, water, diamond_block, dirt;
let rangeAnim;

let playButton, settingButton, titleButton;
let font;

//title screen, death screen; block pickups; inventory; rounds; expanding border; make zombies spawn smartly (no in your enclosed space or something, use dykstra to determine ?),

function preload(){
  groundTexture = loadImage('assets/grass.png');
  waterTexture = loadImage('assets/water.png');
  stoneTexture = loadImage('assets/stone.png')
  markerTexture = loadImage('assets/marker.png')
  woodTexture = loadImage('assets/wood.png')
  leafTexture = loadImage('assets/leaves.png')
  dirtTexture = loadImage('assets/dirt.png')

  placeholder = loadImage('assets/ph.png')

  rangeTexture = loadImage('assets/range.png')
  rangeAnimTexture = loadImage('assets/rangeAnim.png');
  meleeTexture = loadImage('assets/melee.png')
  meleeAnimTexture = loadImage('assets/meleeAnim.png');
  fistAnimTexture = loadImage('assets/fistAnim.png');

  vignette = loadImage('assets/vignette.png')
  splashText = loadImage('assets/splash.png')
  playTexture = loadImage('assets/play.png')
  settingTexture = loadImage('assets/gear.png')
  backTexture = loadImage('assets/back.png')
  gameOverText = loadImage('assets/gameover.png')
  hotbarDarkOG = loadImage('assets/hotbarDark.png')
  hotbarLightOG = loadImage('assets/hotbarLight.png')
  healthTextureOG = loadImage('assets/health.png')
  healthEmptyTextureOG = loadImage('assets/healthEmpty.png')

  shadow = loadImage('assets/shadow.png')
  blockShadow = loadImage('assets/blockShadow.png')
  blockShadowHigh = loadImage('assets/shadowHigh.png')
  zombieTexture = loadImage('assets/zombie.png')
  playerTexture = loadImage('assets/player.png')

  font = loadFont('assets/font.ttf');
}

function setup(){
  gameState = 0; // 0 = title screen, 1 = game, 2 = dead
  itemVals = 0;
  //
  pathCount = 0;
  updateFR = 0;

  deltaTime = 1;
  // general speed multiplier
  timeMult = 1;
  // speed multiplier that adjusts based on fr
  frameMult = 1;
  // sets speed to 0 based on if paused or not
  pauseMult = 1;

  worldTimer = 0;

  currentFR = frameRate();
  let zombieNum = 25//25;
  textAlign(CENTER, CENTER);
  textSize(20)
  createCanvas(windowWidth, windowHeight);
  gridSize = 48 ; //64
  vignette.resize(16, 9);

  angleMode(DEGREES)

  // change images
  hotbarDark  = transparentImage(hotbarDarkOG, 0.65)
  hotbarLight  = transparentImage(hotbarLightOG, 0.8)

  healthTexture = transparentImage(healthTextureOG, 0.5)
  healthEmptyTexture = transparentImage(healthEmptyTextureOG, 0.75)

  // Animations
  rangeAnim = new Animation(rangeAnimTexture, 360, 3, 3)
  meleeAnim = new Animation(meleeAnimTexture, 600, 5, 5)
  fistAnim = new Animation(fistAnimTexture, 600, 5, 5)

  // BLOCKS             hlth/shLv/axLv/pcLv/shEf/axEf/pcEf           col / vis / rot
  stone = new Block("stone", 250, 99, 99, 1, .5, 1, 3, stoneTexture, true, true, true, 1);
  dirt = new Block("dirt", 999, 99, 99, 99, 0, 0, 0, dirtTexture, false, true, true, -1);
  wood = new Block("wood", 100, 0, 0, 0, 1, 3, 1.2, woodTexture, true, true, true, 1);
  leaves = new Block("leaves", 25, 0, 0, 0, 2, 1, 1, leafTexture, true, true, true, 2);
  grass = new Block("grass", 250, 0, 0, 0, 3, .3, .3, groundTexture, true, true, true, 0);
  water = new Block("water", 100, 0, 0, 0, 0, 0, 0, waterTexture, false, true, true, 0);
  diamond_block = new Block("diamond block", 500, 10, 10, 1, .2, .4, 2, markerTexture, true, true, false, 1);
  air = new Block("air", 1, 0, 0, 0, 0, 0, 0, null, false, false, false);

  blockList = [stone, wood, grass, water, diamond_block, air, leaves, dirt];
  // set textures;
  let tempTexture;
  for(let i=0; i<blockList.length; i++){
    if(blockList[i].texture!=null)
      blockList[i].texture.resize(gridSize,gridSize)
    // set rotated textures
    tempTexture = blockList[i].texture
    blockList[i].texture=[[tempTexture]];

    if(blockList[i].randomRot==true){
      blockList[i].texture[0]=[];
      for(let k=0; k<4; k++){
        blockList[i].texture[0].push(rotateImage(tempTexture, k));
      }
    }
    if(blockList[i].level==2){
      for(let c=1; c<5; c++){
        blockList[i].texture[c]=[];
        for(let k=0; k<blockList[i].texture[0].length; k++){
          tempTexture = blockList[i].texture[0][k]
          blockList[i].texture[c].push(transparentImage(tempTexture, (1-(c/5))));
        }
      }
      blockList[i].texture[5]=[];
      for(let k=0; k<blockList[i].texture[0].length; k++){
        tempTexture = blockList[i].texture[0][k]
        blockList[i].texture[5].push(transparentImage(tempTexture, (1-(4/5))));
      }
    }
  }

  noiseAmnt = 30; //50

  // 0 = no coords; 1 = player coords; 2 = ground coords; 3 = allCoords;
  showCoords = 0;
  // 0 = no hitboxes, 1 = playerHitbox, 2 = player velocity, 3 = both
  showHitboxes = 0;
  // 0 = nothing, 1 = show path, 2 = show numbers, 3 = both
  showPath = 0;
  //
  terrainSize = createVector(1000, 1000); // 15000x15000

  //settings options
  deathParticles = true;
  blockShadows = true;
  entityShadows = true;
  randomTextures = true;
  blood = "off"

  zombies = [];
  splats = [];
  particles = [];
  renderItems = [];
  player = new Player((terrainSize.x-1)/2,( terrainSize.y-1)/2, .5, 5, .5); // accSpeed, maxVel, Friction --> 10, 10, 1.5
  camera = new Camera(7, 4); //7, 4
  terrain = new Terrain(terrainSize.x, terrainSize.y)
  screenUi = new Ui(10);
  fadeOpac = 0;

  //buttons
  let playButtWidth = width/2/1.6
  playButton = new Button(playTexture, width/2-playButtWidth/2, height/2+playButtWidth/5, playButtWidth, playButtWidth/2.5, startGame)
  settingButton = new Button(settingTexture, 25, height-playButtWidth/3.5-25, playButtWidth/3.5, playButtWidth/3.5, function(){ screenUi.menuState=1; backButton.validClick=false; })
  backButton = new Button(backTexture, 25, height-playButtWidth/3.5-25, playButtWidth/3.5, playButtWidth/3.5, function(){ screenUi.menuState=0; settingButton.validClick=false; })
    // settings buttons
    settingsButts = [
      // particles on / off
      new Button("on", width-200-gridSize*2, 100-gridSize*.75, gridSize*2, gridSize*1.5, function(){ deathParticles=true }, true),
      new Button("off", width-200, 100-gridSize*.75, gridSize*2, gridSize*1.5, function(){ deathParticles=false }, true),
      // block shadows on / off
      new Button("on", width-200-gridSize*2, 200-gridSize*.75, gridSize*2, gridSize*1.5, function(){ blockShadows=true }, true),
      new Button("off", width-200, 200-gridSize*.75, gridSize*2, gridSize*1.5, function(){ blockShadows=false }, true),
      // entity shadows on / off
      new Button("on", width-200-gridSize*2, 300-gridSize*.75, gridSize*2, gridSize*1.5, function(){ entityShadows=true }, true),
      new Button("off", width-200, 300-gridSize*.75, gridSize*2, gridSize*1.5, function(){ entityShadows=false }, true),
      // randomized textures on / off
      new Button("on", width-200-gridSize*2, 400-gridSize*.75, gridSize*2, gridSize*1.5, function(){ randomTextures=true }, true),
      new Button("off", width-200, 400-gridSize*.75, gridSize*2, gridSize*1.5, function(){ randomTextures=false }, true),
      // randomized textures on / off
      new Button("red", width-200-gridSize*6.5, 500-gridSize*.75, gridSize*2.5, gridSize*1.5, function(){ blood="red" }, true),
      new Button("green", width-200-gridSize*4, 500-gridSize*.75, gridSize*4, gridSize*1.5, function(){ blood="green" }, true),
      new Button("off", width-200, 500-gridSize*.75, gridSize*2, gridSize*1.5, function(){ blood="off" }, true)
    ]
  titleButton = new Button("Title Screen", width/2-width/4, height-width/6, width/2, width/12, restart, true)


  // zombies
  for(let i=0; i<zombieNum; i++){
    zombies.push(new Zombie(random(camera.pos.x/gridSize-width/gridSize/2, camera.pos.x/gridSize+width/gridSize/2), random(camera.pos.y/gridSize-height/gridSize/2, camera.pos.y/gridSize+height/gridSize/2), random(.25, .75), 5, random(.25, .75))) //  random(.25, .75), random(2.5, 7.5), random(.25, .75)
  }

  followZom = zombies[0];
  followZom.menuFollow = true;
  prevFollowZom = null;
}

function draw(){
  if(frameRate()>0)
  frameMult = 60/frameRate();
  if(frameMult>60){
    frameMult=60;
  }

  deltaTime = frameMult*timeMult*pauseMult;
  updateFR++;

  // UPDATE ALL OBJECTS \\
  background(100,200,150);

  if(keyIsDown(90)){
    spawnEdgeZombie();
  }
  if(keyIsDown(70)){
    frameRate(15);
  }
  else{
    frameRate(60)
  }


  camera.update();
  terrain.render(-2);
  terrain.render(-1);
  terrain.render(0);
  terrain.render(1);

  for(let i=0; i<splats.length; i++){
    splats[i].run();
  }
  for(let i=0; i<renderItems.length; i++){
    if(renderItems[i].pos.x*gridSize>camera.pos.x-gridSize/2 && renderItems[i].pos.x*gridSize<camera.pos.x+width+gridSize/2 && renderItems[i].pos.y*gridSize > camera.pos.y-gridSize/2 && renderItems[i].pos.y*gridSize < camera.pos.y+height+gridSize/2)
      renderItems[i].run();
  }
  // run player code
  if(gameState==1){
    player.run();
  }
  // run zombies
  for(let i=0; i<zombies.length; i++){
    zombies[i].run();
  }
  terrain.render(2);
  for(let i=0; i<splats.length; i++){
    splats[i].render(2);
  }
  if(splats.length>35){
    splats.splice(0, 1);
  }
  for(let i=0; i<particles.length; i++){
    particles[i].run();
  }

  terrain.render(3);
  terrain.render(4);

  screenUi.render();

  if(fadeOpac>=5 && gameState==1){
    fill(0, fadeOpac);
    rect(0, 0, width, height)
    fadeOpac = lerp(fadeOpac, 0, 0.035*deltaTime)
  }

  if(updateFR==20){
    currentFR = frameRate();
    updateFR=0;
  }

  worldTimer+=deltaTime;

  if(gameState==-1){
    noStroke();
    fill(0, fadeOpac);
    rect(0, 0, width, height)
    fadeOpac = lerp(fadeOpac, 255, 0.2*deltaTime)
    if(fadeOpac>=254.99){
      zombies = [];
      camera.pos = createVector(player.pos.x-width/2, player.pos.y-height/2);
      camera.currentPos = camera.pos;
      gameState = 1;
    }
  }

  fill(255)
  textSize(25)
  textStyle(NORMAL)
  noStroke();
  text(round(currentFR), gridSize/2,gridSize/2)
  text(round(deltaTime), gridSize/2,gridSize+gridSize/2)

}

function rotateImage(img, amnt){
  img.loadPixels();
  let returnImage = createImage(img.width, img.height);
  returnImage.loadPixels();
  for(let ix=0; ix< returnImage.width; ix++){
    for(let iy=0; iy<returnImage.height; iy++){
      let pix = img.get(ix, iy);
      if(amnt==0)
        returnImage.set(ix, iy, color(pix[0], pix[1], pix[2], pix[3]));
      else if(amnt==1)
        returnImage.set(iy, ix, color(pix[0], pix[1], pix[2], pix[3]));
      else if(amnt==2)
        returnImage.set(returnImage.width-ix-1, returnImage.height-iy-1, color(pix[0], pix[1], pix[2], pix[3]));
      else if(amnt==3)
        returnImage.set(returnImage.height-iy-1, returnImage.width-ix-1, color(pix[0], pix[1], pix[2], pix[3]));
    }
  }
  returnImage.updatePixels();
  return returnImage
}
function transparentImage(img, amnt){
  img.loadPixels();
  let returnImage = createImage(img.width, img.height);
  returnImage.loadPixels();
  for(let ix=0; ix< returnImage.width; ix++){
    for(let iy=0; iy<returnImage.height; iy++){
      let pix = img.get(ix, iy);
      returnImage.set(ix, iy, color(pix[0], pix[1], pix[2], pix[3]*amnt));
    }
  }
  returnImage.updatePixels();
  return returnImage
}

function startGame(){
  fadeOpac = 0;
  gameState=-1;
}

function restart(){
  setup();
}

function screenSpaceToWorldSpace(x, y){
  if(x!=null && y!=null){
    return(createVector((camera.pos.x+x)/gridSize, (camera.pos.y+y)/gridSize))
  }
  else if(x==null){
    return (camera.pos.y+y)/gridSize;
  }
  else if (y==null){
    return (camera.pos.x+x)/gridSize;
  }
}

function worldSpaceToScreenSpace(x, y){
  if(x!=null && y!=null){
    return(createVector((x*gridSize-camera.pos.x), (y*gridSize-camera.pos.y)))
  }
  else if(x==null){
    return (y*gridSize-camera.pos.y);
  }
  else if (y==null){
    return (x*gridSize-camera.pos.x);
  }
}
//takes coords in worldSpace
function toCell(x, y){
  if(x!=null && y!=null){
    return(createVector())
  }
  else if(x==null){
    return (y*gridSize-camera.pos.y);
  }
  else if (y==null){
    return (x*gridSize-camera.pos.x);
  }
}

function spawnEdgeZombie(){
  side = round(random(1, 4))
  spawn = createVector(0,0);
  if(side==1){
    spawn = createVector(random(camera.pos.x/gridSize, camera.pos.x/gridSize+(width/gridSize)), camera.pos.y/gridSize-1);
  }
  else if (side==2){
    spawn = createVector(camera.pos.x/gridSize+(width/gridSize)+1, random(camera.pos.y/gridSize, camera.pos.y/gridSize+(height/gridSize)));
  }
  else if(side==3){
    spawn = createVector(random(camera.pos.x/gridSize, camera.pos.x/gridSize+(width/gridSize)), camera.pos.y/gridSize+(height/gridSize)+1);
  }
  else if(side==4){
    spawn = createVector(camera.pos.x/gridSize-1, random(camera.pos.y/gridSize, camera.pos.y/gridSize+(height/gridSize)));
  }
  zombies.push(new Zombie(spawn.x, spawn.y, random(.25, .75), random(2.5, 7.5), random(.25, .75))) //  random(.25, .75), random(2.5, 7.5), random(.25, .75)
}

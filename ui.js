let noiseCount = 0;
let showText;

// UI CLASS \\
class Ui{
  constructor(hotbarLength){
    this.hotbarLength = hotbarLength
    this.invBoxSize = gridSize*(22/12);
    this.vigOffsetDef = 3500;
    this.vigOffset = 3500;

    this.fadeOpac;

    this.menuState = 0;
  }
  // draw hotbar
  hotbar(){
    textSize(20)
    textStyle(BOLD)
    noStroke()
    let boxSize = this.invBoxSize;
    for(let i=0; i<this.hotbarLength; i++){
      if(player.invSlot==9-i){
        boxSize = this.invBoxSize*1.0909;
        image(hotbarLight, width/2-boxSize/2-this.invBoxSize*1.04545*i+(this.hotbarLength/2-.5)*this.invBoxSize*1.04545, height-this.invBoxSize*.8-boxSize/2, boxSize, boxSize)
      }
      else{
        boxSize = this.invBoxSize;
        image(hotbarDark, width/2-boxSize/2-this.invBoxSize*1.04545*i+(this.hotbarLength/2-.5)*this.invBoxSize*1.04545, height-this.invBoxSize*.8-boxSize/2, boxSize, boxSize)
      }
      if(player.invSlot==9-i){
        fill(169,169,169)
        stroke(100, 125, 150, 200 )
      }
      else{
        strokeWeight(3)
        fill(69,69,69)
        stroke(10, 5, 1, 150)
      }
      if(player.hotbar[9-i]!=undefined){
        showText = "";
        if(player.hotbar[9-i].amnt>1){
          showText = "\n"+player.hotbar[9-i].amnt;
          image(player.hotbar[9-i].texture, width/2-boxSize/2-gridSize/2-this.invBoxSize*1.04545*i+(this.hotbarLength/2-.5)*this.invBoxSize*1.04545+boxSize/2-5, height-this.invBoxSize*.8-gridSize/2-5, gridSize, gridSize)
          text(showText, width/2-boxSize/2-this.invBoxSize*1.04545*i+(this.hotbarLength/2-.5)*this.invBoxSize*1.04545+boxSize/2+10, height-this.invBoxSize*.8+10)
        }
        else{
          image(player.hotbar[9-i].texture, width/2-boxSize/2-(gridSize*1.25)/2-this.invBoxSize*1.04545*i+(this.hotbarLength/2-.5)*this.invBoxSize*1.04545+boxSize/2, height-this.invBoxSize*.8-(gridSize*1.25)/2, gridSize*1.25, gridSize*1.25)
        }
      }
    }
    fill(255, 150);
    noStroke();
    textSize(50)
    textStyle(BOLD)
    textFont(font);
    text(player.item.name, width/2, height-this.invBoxSize*1.5-65)
  }
  crosshair(){

  }
  health(){
    strokeWeight(5)
    stroke(10, 200)
    fill(50, 200);
    strokeWeight(7)
    stroke(75, 12, 25, 150)
    fill(150, 25, 50, 200);
    // health bar back
    image(healthEmptyTexture, width/2-this.invBoxSize*1.04545*(this.hotbarLength/2), height-this.invBoxSize*1.15-65, gridSize/2, gridSize, 0, 0, healthTexture.width/4, healthTexture.height)
    image(healthEmptyTexture, width/2-this.invBoxSize*1.04545*(this.hotbarLength/2)+gridSize/2, height-this.invBoxSize*1.15-65, (this.hotbarLength*this.invBoxSize*1.04545-gridSize), gridSize, healthTexture.width/4, 0, healthTexture.width-healthTexture.width/2, healthTexture.height)
    image(healthEmptyTexture, width/2-this.invBoxSize*1.04545*(this.hotbarLength/2)+(this.hotbarLength*this.invBoxSize*1.04545-gridSize)+gridSize/2, height-this.invBoxSize*1.15-65, gridSize/2, gridSize, healthTexture.width-healthTexture.width/4, 0, healthTexture.width/4, healthTexture.height)
    // health bar front
    image(healthTexture, width/2-this.invBoxSize*1.04545*(this.hotbarLength/2), height-this.invBoxSize*1.15-65, gridSize/2, gridSize, 0, 0, healthTexture.width/4, healthTexture.height)
    image(healthTexture, width/2-this.invBoxSize*1.04545*(this.hotbarLength/2)+gridSize/2, height-this.invBoxSize*1.15-65, (this.hotbarLength*this.invBoxSize*1.04545-gridSize)*(player.health/100), gridSize, healthTexture.width/4, 0, healthTexture.width-healthTexture.width/2, healthTexture.height)
    image(healthTexture, width/2-this.invBoxSize*1.04545*(this.hotbarLength/2)+(this.hotbarLength*this.invBoxSize*1.04545-gridSize)*(player.health/100)+gridSize/2, height-this.invBoxSize*1.15-65, gridSize/2, gridSize, healthTexture.width-healthTexture.width/4, 0, healthTexture.width/4, healthTexture.height)
  }
  vignette(){
    if(this.vigOffsetDef-this.vigOffset>1000){
      this.vigOffset = lerp(this.vigOffset, this.vigOffsetDef, player.health/5000)
    }
    else if (this.vigOffset!=this.vigOffsetDef){
      this.vigOffset=this.vigOffsetDef;
    }
    image(vignette, -this.vigOffset , -this.vigOffset, width+this.vigOffset*2, height+this.vigOffset*2)
  }
  titleScreen(){
    noiseCount++;
    let logoWidth = width/2
    let playButtWidth = logoWidth/1.33
    image(splashText, width/2-logoWidth/2+noise(noiseCount/100, 0)*10-5 - (noise((noiseCount+999)/100, 0)*60-30)/2, height/2-logoWidth/2 + noise(noiseCount/100,0)*10-5 - (noise(0, (noiseCount+999)/100)*60-30)/2, logoWidth+noise((noiseCount+999)/100, 0)*60-30, logoWidth/2+noise(0, (noiseCount+999)/100)*60-30)
    playButton.run();
    playButton.modPos = createVector(noise(noiseCount/100, 0)*10-5 - (noise((noiseCount-999)/100, 0)*60-30)/2, noise(noiseCount/100,0)*10-5 - (noise(0, (noiseCount-999)/100)*60-30)/2);
    playButton.modSize = createVector(noise((noiseCount-999)/100, 0)*60-30, noise(0, (noiseCount-999)/100)*60-30)
  }
  settingScreen(){
    textFont(font);
    noStroke()
    fill(0, 200-pauseMult*200)
    rect(0,0, width, height);
    backButton.run();
    fill(220, 255-pauseMult*255);
    textSize(50)
    textAlign(LEFT, CENTER)
    text("Particles: "+ deathParticles, 100, 100);
    text("Block Shadows: "+ blockShadows, 100, 200);
    text("Entity Shadows: "+ entityShadows, 100, 300);
    text("Randomized Textures: "+ randomTextures, 100, 400);
    text("Blood: "+ blood, 100, 500);

    for(let i=0; i<settingsButts.length;i++){
      settingsButts[i].run();
    }
  }
  gameOverScreen(){
    noStroke();
    fill(0, 255-timeMult*255)
    rect(0,0, width, height);
    if(timeMult>0 && timeMult<.1){
      timeMult = 0;
      this.fadeOpac = 255;
    }
    if(timeMult==0){
      this.fadeOpac = lerp(this.fadeOpac, 0, 0.01*frameMult);
      image(gameOverText, width/2-width/3, width/25, width/1.5, width/3)
      titleButton.run();
      fill(0, this.fadeOpac)
      rect(0,0,width,height);
    }
  }

  render(){

    if(this.menuState!=1)
      settingButton.run();
    if(gameState<=0){
      if(this.menuState==0)
        this.titleScreen();
    }
    else if(gameState==1){
      this.hotbar();
      this.health();
      this.vignette();
      this.crosshair();
    }

    if(this.menuState==1){
      if(pauseMult>0.02){
        pauseMult = lerp(pauseMult, 0, 0.1*frameMult)
      }
      else if(pauseMult>0){
        pauseMult = 0;
      }
      this.settingScreen();
    }
    else{
      if(pauseMult<0.95){
        pauseMult = lerp(pauseMult, 1, 0.1*frameMult);
        noStroke();
        fill(0, 200-pauseMult*200)
        rect(0,0, width, height);
      }
      else if(pauseMult<1){
        pauseMult = 1;
      }
    }


    if(player.alive==false && gameState==1){
      this.gameOverScreen();
    }
  }
}

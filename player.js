// PLAYER CLASS \\
let keys = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]
let bar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
let fist, rangeWeapon, meleeWeapon, stoneItem, grassItem, diamond_blockItem, waterItem, woodItem, leavesItem, mouseCast, checkEntity, animSpeed;

class Player extends physOb{
  constructor(x, y, accSpeed, maxVel, friction){
    super(x, y, accSpeed, maxVel, friction);
    fist  = new Tool("fist", placeholder, fistAnim, 20, 1, 10, 1, 10, 1, 10, "ray", 20, 1.8, 0, 15, -10, 0, 0, 0, 25, .1)
    rangeWeapon = new Tool("range", rangeTexture, rangeAnim, 50, 1, 10, 1, 10, 1, 10, "ray",  34, 20, 0, 5, 10, 3, 0.5, 180, 1, 1)
    meleeWeapon = new Tool("melee", meleeTexture, meleeAnim, 20, 1, 10, 1, 10, 1, 20, "aoe", 50, 0.9, 1, 20, 2, 0, 0, 0, 100, .5)
    stoneItem = new BlockItem(stone, 64)
    woodItem = new BlockItem(wood, 64)
    grassItem = new BlockItem(grass, 64)
    diamond_blockItem = new BlockItem(diamond_block, 64)
    leavesItem = new BlockItem(leaves, 64)
    waterItem = new BlockItem(water, 64)

    // i frames
    this.iCount = 0;
    this.iCountMax = 10; //20

    this.regenCountMax = 120; // amount of time in frames to wait before regenning
    this.regenCount = this.regenCountMax;
    this.regenSpeed = .5; // health regen speed / amount of health added per frame

    this.color = color(255, 0, 0)
    this.defColor = this.color;
    this.overlayOpac = 0;
    this.inventory = [meleeWeapon, rangeWeapon, stoneItem, woodItem, diamond_blockItem, leavesItem, grassItem]
    this.hotbar = [this.inventory[0], this.inventory[1], this.inventory[2], this.inventory[3], this.inventory[4], this.inventory[5], this.inventory[6], this.inventory[7], this.inventory[8], this.inventory[9]]
    this.invSlot = 0;
    this.item = this.hotbar[this.invSlot];
    this.canAttack = true;
    this.health = 100;
    this.maxHealth = 100;
    this.alive=true;
  }
  update(){
    if(this.alive==true){
      // update hotbarLength
      this.hotbar = [this.inventory[0], this.inventory[1], this.inventory[2], this.inventory[3], this.inventory[4], this.inventory[5], this.inventory[6], this.inventory[7], this.inventory[8], this.inventory[9]]

      // regenerating health
      if(this.health<this.maxHealth){
        if(this.regenCount>0){
          this.regenCount-=deltaTime;
        }
        if(this.regenCount<=0){
          this.regenCount=0;
          this.health+=deltaTime*this.regenSpeed;
        }
      }
      if(this.health>this.maxHealth){
        this.maxHealth=this.maxHealth
      }

      // item use cooldown counter
      if(this.item.coolCount>0){
        this.item.coolCount-=deltaTime;
      }
      else{
        this.canAttack=true;
      }

      if(this.iCount>0){
        this.iCount-=deltaTime;
      }

      if(keyIsDown(87)){ // W
        this.acc.y=-this.accSpeed;
      }
      else if(keyIsDown(83)){ // S
        this.acc.y=this.accSpeed;
      }
      else {
        this.acc.y=0;
      }
      if(keyIsDown(65)){ // A
        this.acc.x=-this.accSpeed;
      }
      else if(keyIsDown(68)){ // D
        this.acc.x=this.accSpeed;
      }
      else {
        this.acc.x=0;
      }
      if(keyIsDown(16)){ // SHIFT
        this.maxVel = this.defMaxVel*2;
        this.accSpeed = this.defAccSpeed/2;
        this.friction = this.defFriction/2;
      }
      else{
        this.maxVel = this.defMaxVel;
        this.accSpeed = this.defAccSpeed;
        this.friction = this.defFriction;
      }

      for(let i=0; i<10; i++){
        if(keyIsDown(keys[i])&&this.invSlot!=(bar[i])){
          this.invSlot=bar[i];
        }
      }
      this.item = this.hotbar[this.invSlot];
      if(this.item==null){
        this.item = fist;
      }

      if(this.size-this.defSize>1){
        this.size = lerp(this.size, this.defSize, .1)
        this.overlayOpac = lerp(this.overlayOpac, 0, 0.1)
        //this.color = color(lerp(red(this.color), red(this.defColor), .1), lerp(green(this.color), green(this.defColor), .1), lerp(blue(this.color), blue(this.defColor), .1))
      }
      else if(this.size!=this.defSize){
        this.size = this.defSize;
        this.overlayOpac = 0;
      }
      // check attack
      if(screenUi.menuState!=1){
        if(mouseIsPressed && this.item.type=="tool" && this.canAttack==true){
          this.item.attack();
          animSpeed = this.item.animateSpeed;
          this.item.anim.count = 1;
        }
        else if (this.canAttack==true && this.item.type=="tool"){
          animSpeed = 0;
          this.item.anim.count = 0;
        }
        // check itemUse
        if(mouseIsPressed && this.item.type=="block"){
          checkEntity = false;
          for(let k=0; k<zombies.length; k++){
            if((zombies[k].worldPos.x+zombies[k].size/2/gridSize>screenSpaceToWorldSpace(mouseX, null)-0.5 && zombies[k].worldPos.x-zombies[k].size/2/gridSize<screenSpaceToWorldSpace(mouseX, null)+0.5) && (zombies[k].worldPos.y+zombies[k].size/2/gridSize>screenSpaceToWorldSpace(null, mouseY)-0.5 && zombies[k].worldPos.y-zombies[k].size/2/gridSize<screenSpaceToWorldSpace(null, mouseY)+0.5)){
              checkEntity = true;
            }
          }
          if((player.worldPos.x+player.size/2/gridSize>screenSpaceToWorldSpace(mouseX, null)-0.5 && player.worldPos.x-player.size/2/gridSize<screenSpaceToWorldSpace(mouseX, null)+0.5) && (player.worldPos.y+player.size/2/gridSize>screenSpaceToWorldSpace(null, mouseY)-0.5 && player.worldPos.y-player.size/2/gridSize<screenSpaceToWorldSpace(null, mouseY)+0.5)){
            checkEntity = true;
          }

          if(checkEntity==false)
            this.item.place();
        }
      }
    }
    else{
      timeMult = lerp(timeMult, 0, 0.01*frameMult)
    }
    this.updateAtt();
    if(this.pos.x<gridSize) this.pos.x = gridSize;
    if(this.pos.y<gridSize) this.pos.y = gridSize;
    if(this.pos.x>terrainSize.x*gridSize-gridSize*2) this.pos.x = terrainSize.x*gridSize-gridSize*2
    if(this.pos.y>terrainSize.y*gridSize-gridSize*2) this.pos.y = terrainSize.y*gridSize-gridSize*2

  }
  takeDamage(amnt, knockback, pos){
    this.size = this.defSize*1.2
    this.overlayOpac = 200;
    this.regenCount = this.regenCountMax;
    this.health-=amnt;
    if(this.health<0){
      this.health=0;
    }
    this.vel.sub(p5.Vector.sub(pos, this.pos).normalize().mult(knockback))
    if(this.health<=0){
      this.death(p5.Vector.sub(pos, this.pos).normalize());
    }
    this.iCount = this.iCountMax;
  }
  death(){
    this.alive=false;
  }
  render(){
    noStroke();
    if(entityShadows)
      image(shadow, this.pos.x-camera.pos.x-this.size*1, this.pos.y-camera.pos.y-this.size*1, this.size*2, this.size*2);
    if(this.item.type=="tool"){
      push();
      translate(this.pos.x-camera.pos.x, this.pos.y-camera.pos.y)
      rotate(p5.Vector.sub(createVector(mouseX, mouseY), worldSpaceToScreenSpace(this.worldPos.x, this.worldPos.y)).heading()+90)
      console.log()
      this.item.anim.draw(-this.item.anim.gridSize.x/2*gridSize, -this.item.anim.gridSize.y/2*gridSize, this.item.anim.gridSize.x*gridSize, this.item.anim.gridSize.y*gridSize, animSpeed);
      image(playerTexture, -this.size/2, -this.size/2, this.size, this.size);
      pop();
    }
    else
      image(playerTexture, this.pos.x-camera.pos.x-this.size/2, this.pos.y-camera.pos.y-this.size/2, this.size, this.size);
    fill(255, 0, 0, this.overlayOpac)
    //ellipse(this.pos.x-camera.pos.x, this.pos.y-camera.pos.y, this.size, this.size);
    textSize(20)
    fill(100,100,255, 150)
    if(showHitboxes == 1 || showHitboxes == 3) rect(this.pos.x-camera.pos.x-this.size/2, this.pos.y-camera.pos.y-this.size/2, this.size, this.size);
    if(showCoords==1||showCoords==3){
      fill(255)
      text((floor(this.worldPos.x*10)/10+", "+floor(this.worldPos.y*10)/10),this.pos.x-camera.pos.x, this.pos.y-camera.pos.y);
    }
    if(this.item.type=="block"){
      stroke(255, 150);
      fill(255, 50)
      strokeWeight(3);
      rect(worldSpaceToScreenSpace(round(screenSpaceToWorldSpace(mouseX, null)), null)-gridSize/2, worldSpaceToScreenSpace(null, round(screenSpaceToWorldSpace(null, mouseY)))-gridSize/2, gridSize, gridSize);
    }
  }
  run(){
    this.update();
    this.render();
  }
}

// TOOL CLASS \\
let dir, hitEnemy, hitBlock, hitDetect, hitRoofDetect, hitFloorDetect, aoeCenter, hitZom, testRay, targetBlock, breakAmnt, mouseWorldSpace, mouseDist
class Tool extends Item{
  // shovel level, shovel efficiency, axe level, axe efficiency, picaxe levl, pixaxe efficiency
  constructor(name, texture, anim, animateSpeed, shvLvl, shvEff, axeLvl, axeEff, picLvl, picEff, damageType, damage, range, width, cooldown, camRecoilAmnt, pierceNum, pierceMod, bloodDir, bloodWidth, bloodVel){
    super(name, 1, "tool", texture);
    this.anim = anim;
    this.animateSpeed = animateSpeed;

    this.shvLvl = shvLvl;
    this.shvEff = shvEff;
    this.axeLvl = axeLvl;
    this.axeEff = axeEff;
    this.picLvl = picLvl;
    this.picEff = picEff;

    this.damageType = damageType // "aoe" "ray"
    this.damage = damage;
    this.range = range;
    this.width = width; // N/A if ray weapon.
    this.cooldown = cooldown;
    this.coolCount = 0;
    this.camRecoilAmnt = camRecoilAmnt;
    this.pierceNum = pierceNum // number of enemies a ray weapon can pierce through
    this.pierceMod = pierceMod // damage multiplayer added after each pierce
    this.bloodDir = bloodDir;
    this.bloodWidth = bloodWidth;
    this.bloodVel = bloodVel;
  }
  attack(){
    let dir = screenSpaceToWorldSpace(mouseX, mouseY).sub(p5.Vector.div(player.pos, gridSize)).normalize();
    player.canAttack=false;
    this.coolCount = this.cooldown;
    camera.shake(0.4, 0.1/(this.cooldown/20)/(5/3), -dir.x*this.camRecoilAmnt*2+random(-this.camRecoilAmnt,this.camRecoilAmnt), -dir.y*this.camRecoilAmnt*2+random(-this.camRecoilAmnt,this.camRecoilAmnt))

    // if touching block before enemy and mouse on block, break
    if(this.damageType=="ray"){
      hitEnemy = player.raycastPhysOb(player.pos.x/gridSize+dir.x*this.range, player.pos.y/gridSize+dir.y*this.range, 4, zombies);
      hitBlock = player.raycast(player.pos.x/gridSize+dir.x*this.range, player.pos.y/gridSize+dir.y*this.range, 4, true);
      hitRoofDetect = false;
      hitFloorDetect = false;
      hitDetect = false;
      mouseWorldSpace = screenSpaceToWorldSpace(mouseX, mouseY)
      mouseWorldSpace.x = round(mouseWorldSpace.x)
      mouseWorldSpace.y = round(mouseWorldSpace.y)
      mouseDist = mouseWorldSpace.dist(player.worldPos)
      // if mouse is close enough to player, hit roof tile instead
      if (mouseDist<=1 && terrain.roofLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].visible){
        hitRoofDetect = true;
        hitBlock = createVector(round(mouseWorldSpace.x), round(mouseWorldSpace.y))

      }
      // check normal raycast to see if block is in the way from first enemy
      // if so, set block hit detect to true
      else if(hitBlock==false) hitDetect = false;
      else hitDetect = true;

      // if hit enemy is closer than the hit block, then block hit is set to false
      if(hitBlock!=false && hitEnemy.length>0 && hitEnemy[0].dead==false){
        if(player.pos.dist(hitEnemy[0].pos)<player.pos.dist(hitBlock)){
          hitDetect = false;
        }
        else{
          hitEnemy=false;
        }
      }

      if(mouseDist>1 && (hitDetect==false && hitRoofDetect==false && terrain.floorLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].visible==true && mouseDist<=this.range)
      || (hitDetect==true && terrain.floorLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].visible==true && mouseDist*gridSize<player.pos.dist(hitBlock))) {
        hitDetect = false;
        hitFloorDetect = true;
        hitBlock = createVector(round(mouseWorldSpace.x), round(mouseWorldSpace.y))
      }

      // if not detecting a block in the way
      if(hitDetect==false && hitEnemy.length>0 && hitEnemy[0].dead==false){
        hitEnemy[0].takeDamage(this.damage, hitEnemy[0].vel.mag()+hitEnemy[0].maxVel, player.pos)
        dir = p5.Vector.sub(player.pos, hitEnemy[0].pos).normalize()
        if (deathParticles==true  && blood!="off")
        hitEnemy[0].blood(dir, this.damage, this.bloodDir, this.bloodWidth, this.bloodVel)
      }
      else if (hitDetect==true){
        if(terrain.layout[round(hitBlock.y/gridSize)][round(hitBlock.x/gridSize)].collide==true){
          this.damageBlock(hitBlock);
        }
      }
      else if (hitFloorDetect==true){
        if(terrain.floorLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].collide==true){
          this.damageFloor(hitBlock);
        }
      }
      else if(hitRoofDetect==true){
        if(terrain.roofLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].collide==true){
          this.damageRoof(hitBlock);
        }
      }
    }
    else if(this.damageType=="aoe"){
       // if block in way, break block;
      noStroke();
      fill(200, 50, 50, 200)
      aoeCenter = createVector(player.worldPos.x+dir.x*this.range, player.worldPos.y+dir.y*this.range);
      //circle(worldSpaceToScreenSpace(aoeCenter.x, null), worldSpaceToScreenSpace(null, aoeCenter.y), this.width*gridSize*2);
      hitRoofDetect = false;
      // check if any zombies are hit successfully
      hitZom = false
      for(let i=0; i<zombies.length; i++){
        if(zombies[i].worldPos.dist(aoeCenter)-zombies[i].size/2/gridSize<=this.width && zombies[i].dead==false){
          testRay = player.raycast(zombies[i].pos.x/gridSize, zombies[i].pos.y/gridSize, 4, true);
          if(testRay==false){
            hitZom = true;
            zombies[i].takeDamage(this.damage, zombies[i].vel.mag()+zombies[i].maxVel, player.pos)
            dir = p5.Vector.sub(player.pos, zombies[i].pos).normalize()
            if (deathParticles==true && blood!="off")
            zombies[i].blood(dir, this.damage, this.bloodDir, this.bloodWidth, this.bloodVel)
          }
        }
      }
      if(hitZom == false){
        mouseWorldSpace = screenSpaceToWorldSpace(mouseX, mouseY)
        mouseWorldSpace.x = round(mouseWorldSpace.x)
        mouseWorldSpace.y = round(mouseWorldSpace.y)
        mouseDist = mouseWorldSpace.dist(player.worldPos)

        if(mouseWorldSpace.dist(player.worldPos)<=1 && terrain.roofLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].visible){
          hitBlock = createVector(mouseWorldSpace.x, mouseWorldSpace.y)
          this.damageRoof(hitBlock);
        }
        else{
          hitBlock = player.raycast(player.pos.x/gridSize+dir.x*(this.range+this.width), player.pos.y/gridSize+dir.y*(this.range+this.width), 4, true);
          if (mouseDist>1 && (hitBlock == false && mouseDist<=this.range+this.width)
            ||(hitBlock != false && mouseDist*gridSize<player.pos.dist(hitBlock))) {
            hitBlock = createVector(round(mouseWorldSpace.x), round(mouseWorldSpace.y))
            this.damageFloor(hitBlock)
          }
          else if(hitBlock!=false){
            this.damageBlock(hitBlock)
          }
        }
      }
    }
  }
  damageBlock(hitBlock){
    targetBlock = terrain.layout[round(hitBlock.y/gridSize)][round(hitBlock.x/gridSize)];
    breakAmnt = 0
    if(targetBlock.shvLvl<=this.shvLvl) breakAmnt+=this.shvEff*targetBlock.shvEff;
    if(targetBlock.axeLvl<=this.axeLvl) breakAmnt+=this.axeEff*targetBlock.axeEff;
    if(targetBlock.picLvl<=this.picLvl) breakAmnt+=this.picEff*targetBlock.picEff;
    terrain.layout[round(hitBlock.y/gridSize)][round(hitBlock.x/gridSize)].damage(breakAmnt);
  }
  damageRoof(hitBlock){
    targetBlock = terrain.roofLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)];
    breakAmnt = 0
    if(targetBlock.shvLvl<=this.shvLvl) breakAmnt+=this.shvEff*targetBlock.shvEff;
    if(targetBlock.axeLvl<=this.axeLvl) breakAmnt+=this.axeEff*targetBlock.axeEff;
    if(targetBlock.picLvl<=this.picLvl) breakAmnt+=this.picEff*targetBlock.picEff;
    terrain.roofLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].damage(breakAmnt);
  }
  damageFloor(hitBlock){
    targetBlock = terrain.floorLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)];
    breakAmnt = 0
    if(targetBlock.shvLvl<=this.shvLvl) breakAmnt+=this.shvEff*targetBlock.shvEff;
    if(targetBlock.axeLvl<=this.axeLvl) breakAmnt+=this.axeEff*targetBlock.axeEff;
    if(targetBlock.picLvl<=this.picLvl) breakAmnt+=this.picEff*targetBlock.picEff;
    terrain.floorLayout[round(mouseWorldSpace.y)][round(mouseWorldSpace.x)].damage(breakAmnt);
  }
}

// PLAYER CLASS \\
let circlePos, slope, destPosition, returnList, pos, n, tempVel, holdI, currentCol, diagonalSize, castAmnt, temp, maxI, shortest, ratio;

class physOb{
  constructor(x, y, accSpeed, maxVel, friction){
    this.accSpeed = accSpeed; //1
    this.defAccSpeed = accSpeed;
    this.maxVel = maxVel; //10
    this.defMaxVel = maxVel;
    this.friction = friction; //1.5
    this.defFriction = friction;
    this.size = gridSize/1.2 // /2
    this.defSize = this.size;
    this.acc = createVector(0,0);
    this.vel = createVector(0,0);
    this.pos = createVector(x*gridSize,y*gridSize);
    this.worldPos = createVector(x, y)
    this.color;
    this.defColor;
    this.health;

    this.topCol = false;
    this.bottomCol = false;
    this.leftCol = false;
    this.rightCol = false;
  }
  raycast(x, y, segments, givePos){
    stroke(255)
    strokeWeight(2)
    if(showPath==1||showPath==3) line(worldSpaceToScreenSpace(this.pos.x/gridSize, null), worldSpaceToScreenSpace(null, this.pos.y/gridSize), worldSpaceToScreenSpace(player.pos.x/gridSize, null), worldSpaceToScreenSpace(null, player.pos.y/gridSize))
    slope = (y*gridSize - this.pos.y)/(x*gridSize - this.pos.x)
    fill(255, 50, 50)
    destPosition = createVector(x*gridSize, y*gridSize)
    for(let i=0; i<this.pos.dist(destPosition)/(gridSize/segments); i++){
      circlePos = p5.Vector.lerp(this.pos, destPosition, i/(this.pos.dist(destPosition)/(gridSize/segments)));
      if(showPath==1||showPath==3) circle(worldSpaceToScreenSpace(circlePos.x/gridSize, null), worldSpaceToScreenSpace(null, circlePos.y/gridSize), 10)
      if(terrain.layout[round(circlePos.y/gridSize)][round(circlePos.x/gridSize)].collide == true){
        if(givePos==true){
          return createVector(circlePos.x, circlePos.y);
        }
        else{
          return true;
        }
      }
    }
    return false;
  }
  raycastPhysOb(x, y, segments, list){
    stroke(255)
    strokeWeight(2)
    //line(worldSpaceToScreenSpace(this.pos.x/gridSize, null), worldSpaceToScreenSpace(null, this.pos.y/gridSize), worldSpaceToScreenSpace(x, null), worldSpaceToScreenSpace(null, y))
    slope = (y*gridSize - this.pos.y)/(x*gridSize - this.pos.x)
    fill(255, 50, 50)
    destPosition = createVector(x*gridSize, y*gridSize)
    returnList = [];
    for(let i=0; i<this.pos.dist(destPosition)/(gridSize/segments); i++){
      circlePos = p5.Vector.lerp(this.pos, destPosition, i/(this.pos.dist(destPosition)/(gridSize/segments)));
      //circle(worldSpaceToScreenSpace(circlePos.x/gridSize, null), worldSpaceToScreenSpace(null, circlePos.y/gridSize), 10)
      for(let k=0; k<list.length; k++){
        if(circlePos.x>list[k].pos.x-list[k].size/2 && circlePos.x < list[k].pos.x+list[k].size/2 && circlePos.y< list[k].pos.y + list[k].size/2 && circlePos.y > list[k].pos.y-list[k].size/2 && returnList[returnList.length-1]!=list[k]){
          returnList.push(list[k])
        }
      }
    }
    return returnList;
  }
  updateAtt(){
    this.vel.add(p5.Vector.mult(this.acc, deltaTime));
    this.vel.limit(this.maxVel*deltaTime);

    if(this.acc.x===0){
      this.vel.x /= this.friction+1;
    }
    if(this.acc.y===0){
      this.vel.y /= this.friction+1;
    }
    this.collisionCheck();
    this.pos.add(p5.Vector.mult(this.vel, 1));

    this.worldPos=createVector(this.pos.x/gridSize, this.pos.y/gridSize);
  }
  collisionCheck(){
    //clips through everything but bottom right
    fill(100,50,200, 150)
    pos = createVector(this.pos.x-camera.pos.x-this.size/2, this.pos.y-camera.pos.y+this.size/2)
    n = this.size
    tempVel = createVector(this.vel.x, this.vel.y).limit(.001).mult(1000);
    // length of diagonal
    holdI = [null, null, null, null]
    currentCol = [false, false, false, false];

    if(this.checkHorizLine((this.pos.x-n/2+1)/gridSize, (this.pos.x+n/2-1)/gridSize, (this.pos.y-n/2)/gridSize)) currentCol[0] = true;
    if(this.checkHorizLine((this.pos.x-n/2+1)/gridSize, (this.pos.x+n/2-1)/gridSize, (this.pos.y+n/2)/gridSize)) currentCol[1] = true;
    if(this.checkVertLine((this.pos.x-n/2)/gridSize, (this.pos.y-n/2+1)/gridSize, (this.pos.y+n/2-1)/gridSize)) currentCol[2] = true;
    if(this.checkVertLine((this.pos.x+n/2)/gridSize, (this.pos.y-n/2+1)/gridSize, (this.pos.y+n/2-1)/gridSize)) currentCol[3] = true;



    diagonalSize = [this.vel.mag()*1, this.vel.mag()*1, this.vel.mag()*1, this.vel.mag()*1]
    castAmnt = [diagonalSize[0], diagonalSize[1], diagonalSize[2], diagonalSize[3]] //top, bottom, left, right
    // for example: dont count downwards angles if bottom side is colliding, dont factor in pos x to angle if right side is colliding

    // when casting to the right, for example, check if bottom or top side are colliding, then exempt those pixels from the raycast
    //top
    if(this.vel.y<0){
      temp = tempVel.x;
      if(currentCol[2]===true||currentCol[3]===true){
        tempVel.x = 0;
      }
       maxI = abs((pos.y-n+tempVel.y*castAmnt[0])-(pos.y-n))
       for(let i=0; i<maxI; i++){
         if(this.checkHorizLine(screenSpaceToWorldSpace(lerp(pos.x+1, pos.x+1+tempVel.x*castAmnt[0], i/maxI), null), screenSpaceToWorldSpace(lerp(pos.x+n-1, pos.x+n-1+tempVel.x*castAmnt[0], i/maxI), null), screenSpaceToWorldSpace(null, pos.y-n-i))){
           if(this.checkHorizLine(screenSpaceToWorldSpace(lerp(pos.x+1, pos.x+1+tempVel.x*castAmnt[0], i/maxI), null), screenSpaceToWorldSpace(lerp(pos.x+n-1, pos.x+n-1+tempVel.x*castAmnt[0], i/maxI), null), screenSpaceToWorldSpace(null, pos.y-n-i+1))==false){
              ratio = (maxI)/i;
              castAmnt[0]/=ratio;
              holdI[0]=i;
              break;
           }
         }
       }
       if(showHitboxes == 2 || showHitboxes == 3) quad(pos.x+1, pos.y-n, pos.x+n-1, pos.y-n, pos.x+n-1+tempVel.x*castAmnt[0], pos.y-n+tempVel.y*castAmnt[0], pos.x+1+tempVel.x*castAmnt[0], pos.y-n+tempVel.y*castAmnt[0]);
       tempVel.x=temp;
     }
    // bottom
    if(this.vel.y>0){
      temp = tempVel.x;
      if(currentCol[2]===true||currentCol[3]===true){
        tempVel.x = 0;
      }
       maxI = -abs((pos.y+tempVel.y*castAmnt[1])-(pos.y))
       for(let i=0; i>maxI; i--){
         if(this.checkHorizLine(screenSpaceToWorldSpace(lerp(pos.x+1, pos.x+1+tempVel.x*castAmnt[1], i/maxI), null), screenSpaceToWorldSpace(lerp(pos.x-1+n, pos.x-1+n+tempVel.x*castAmnt[0], i/maxI), null), screenSpaceToWorldSpace(null, pos.y-i))){
           if(this.checkHorizLine(screenSpaceToWorldSpace(lerp(pos.x+1, pos.x+1+tempVel.x*castAmnt[1], i/maxI), null), screenSpaceToWorldSpace(lerp(pos.x-1+n, pos.x-1+n+tempVel.x*castAmnt[0], i/maxI), null), screenSpaceToWorldSpace(null, pos.y-i-1))==false){
              ratio = (maxI)/i;
              castAmnt[1]/=ratio;
              holdI[1]=i;
              break;
           }
         }
       }
       if(showHitboxes == 2 || showHitboxes == 3) quad(pos.x+1, pos.y, pos.x+n-1, pos.y, pos.x-1+n+tempVel.x*castAmnt[1], pos.y+tempVel.y*castAmnt[1], pos.x+1+tempVel.x*castAmnt[1], pos.y+tempVel.y*castAmnt[1]);
       tempVel.x=temp;
     }
    // left
    if(this.vel.x<0){
      temp = tempVel.y;
      if(currentCol[0]===true||currentCol[1]===true){
        tempVel.y = 0;
      }
       maxI = abs((pos.x+tempVel.x*castAmnt[2])-(pos.x))
       for(let i=0; i<maxI; i++){
         if(this.checkVertLine(screenSpaceToWorldSpace(pos.x-i), screenSpaceToWorldSpace(null, lerp(pos.y-n+1, pos.y-n+1+tempVel.y*castAmnt[2], i/maxI)), screenSpaceToWorldSpace(null, lerp(pos.y-1, pos.y-1+tempVel.y*castAmnt[2], i/maxI)))){
           if(this.checkVertLine(screenSpaceToWorldSpace(pos.x-i+1), screenSpaceToWorldSpace(null, lerp(pos.y-n+1, pos.y+1-n+tempVel.y*castAmnt[2], i/maxI)), screenSpaceToWorldSpace(null, lerp(pos.y-1, pos.y-1+tempVel.y*castAmnt[2], i/maxI)))==false){
              ratio = (maxI)/i;
              castAmnt[2]/=ratio;
              holdI[2]=i;
              break;
           }
         }
       }
       if(showHitboxes == 2 || showHitboxes == 3) quad(pos.x, pos.y-n+1, pos.x, pos.y-1, pos.x+tempVel.x*castAmnt[2], pos.y-1+tempVel.y*castAmnt[2], pos.x+tempVel.x*castAmnt[2], pos.y-n+1+tempVel.y*castAmnt[2]);
       tempVel.y=temp;
     }
    // right
    if(this.vel.x>0){
      temp = tempVel.y;
      if(currentCol[0]===true||currentCol[1]===true){
        tempVel.y = 0;
      }
       maxI = - abs((pos.x+n+tempVel.x*castAmnt[3])-(pos.x+n))
       for(let i=0; i>maxI; i--){
         if(this.checkVertLine(screenSpaceToWorldSpace(pos.x+n-i), screenSpaceToWorldSpace(null, lerp(pos.y-n+1, pos.y-n+1+tempVel.y*castAmnt[3], i/maxI)), screenSpaceToWorldSpace(null, lerp(pos.y-1, pos.y-1+tempVel.y*castAmnt[3], i/maxI)))){
           if(this.checkVertLine(screenSpaceToWorldSpace(pos.x+n-i-1), screenSpaceToWorldSpace(null, lerp(pos.y-n+1, pos.y-n+1+tempVel.y*castAmnt[3], i/maxI)), screenSpaceToWorldSpace(null, lerp(pos.y-1, pos.y-1+tempVel.y*castAmnt[3], i/maxI)))==false){
              ratio = (maxI)/i;
              castAmnt[3]/=ratio;
              holdI[3]=i;
              break;
           }
         }
       }
       if(showHitboxes == 2 || showHitboxes == 3) quad(pos.x+n, pos.y-n+1, pos.x+n, pos.y-1, pos.x+n+tempVel.x*castAmnt[3], pos.y-1+tempVel.y*castAmnt[3], pos.x+n+tempVel.x*castAmnt[3], pos.y-n+1+tempVel.y*castAmnt[3]);
       tempVel.y=temp;
     }
     // find shortest length

     shortest = null;
     for(let i=0; i<4; i++){
       if(holdI[i]!=null&&holdI[i]!=0){
         if(shortest==null) shortest = i;
       else if(castAmnt[i]<castAmnt[shortest]&& holdI[i]!=0) shortest = i;
       }
     }
     if(shortest!=null){
       if(shortest<=1){
         this.acc.y=0;
         this.vel.y=0;
         this.pos.y-=holdI[shortest];
       }
       else if (shortest>1){
         this.acc.x=0;
         this.vel.x=0;
         this.pos.x-=holdI[shortest];
       }
     }
     if((currentCol[0]&&this.vel.y<0)||(currentCol[1]&&this.vel.y>0)){
       this.acc.y=0;
       this.vel.y=0;
     }
     if((currentCol[2]&&this.vel.x<0)||(currentCol[3]&&this.vel.x>0)){
       this.acc.x=0;
       this.vel.x=0;
     }
  }
  // take x and y in grid size coords
  checkHorizLine(x1, x2, y){
    for(let i=x1*gridSize; i<x2*gridSize; i++){
      if(terrain.layout[round(y)][round(i/gridSize)].collide==true){
        return true;
      }
    }
    return false
  }
  checkVertLine(x, y1, y2){
    for(let i=y1*gridSize; i<y2*gridSize; i++){
      if(terrain.layout[round(i/gridSize)][round(x)].collide==true){
        return true;
      }
    }
    return false
  }
  render(){
    noStroke();
    fill(250,90,50)
    ellipse(this.pos.x-camera.pos.x, this.pos.y-camera.pos.y, this.size, this.size);
    textSize(20)
    fill(100,100,255, 150)
    if(showHitboxes == 1 || showHitboxes == 3) rect(this.pos.x-camera.pos.x-this.size/2, this.pos.y-camera.pos.y-this.size/2, this.size, this.size);
    if(showCoords==1||showCoords==3){
      fill(255)
      text((floor(this.worldPos.x*10)/10+", "+floor(this.worldPos.y*10)/10),this.pos.x-camera.pos.x, this.pos.y-camera.pos.y);
    }
  }
  run(){
    this.update();
    this.render();
  }
}

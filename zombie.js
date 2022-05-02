// PLAYER CLASS \\
class Zombie extends physOb{
  constructor(x, y, accSpeed, maxVel, friction){
    super(x, y, accSpeed, maxVel, friction);
    this.color = color(13, 117, 41)
    this.defColor =color(13, 117, 41);
    this.overlayOpac = 0;
    this.path = [];
    this.foundPath = [];
    this.foundPathCount = -1;
    this.count = 0;
    this.currentPoint = 0;
    this.inSight = false;
    this.raySegments = 2;
    this.wander = false;
    this.seed = random(0, 100000)
    this.health = 100;
    this.dead = false;
    this.shakeLength = 30;
    this.deadCount=this.shakeLength;
    this.menuFollow = false;

    this.attackDamage = 10;
    this.attackCooldown = 10;
    this.coolCount = 0;
    this.range = 0;

    this.pathFind();
  }
  takeDamage(amnt, knockback, pos){
    this.size = this.defSize*1.2
    this.overlayOpac = 200;
    this.health-=amnt;
    this.vel.sub(p5.Vector.sub(pos, this.pos).normalize().mult(knockback))
    if(this.health<=0){
      this.death(p5.Vector.sub(pos, this.pos).normalize());
    }
  }
  blood(dirIn, amnt, rot, pwidth, pvel){
    let dir = p5.Vector.fromAngle(radians(dirIn.heading())+radians(rot)).normalize();
    if(blood=="red")
      splats.push(new Splat(this.pos.x/gridSize+dir.x*.3, this.pos.y/gridSize+dir.y*.3, 1, amnt, 15, .15, dir.x/3, dir.y/3, 0, color(125, 35, 35), this.size/3))
    else if (blood=="green")
      splats.push(new Splat(this.pos.x/gridSize+dir.x*-.3, this.pos.y/gridSize+dir.y*-.3, 1, amnt, 15, .15, dir.x/-3, dir.y/-3, 0, color(13-25, 117-25, 41-25), this.size/3))
    let maxI = splats[splats.length-1].particles.length
    for(let i=0; i<maxI; i++){
      let tempDir = p5.Vector.fromAngle(dir.heading()+radians((i/maxI*pwidth)-pwidth/2))
      splats[splats.length-1].particles[i].pos = createVector(this.pos.x/gridSize+tempDir.normalize().x, this.pos.y/gridSize+tempDir.normalize().y*.3, splats[splats.length-1].particles[i].pos.z);
      splats[splats.length-1].particles[i].vel = createVector(random(tempDir.x/3-this.size/3/gridSize, tempDir.x/3+this.size/3/gridSize)*pvel, random(tempDir.y/3-this.size/3/gridSize, tempDir.y/3+this.size/3/gridSize)*pvel, splats[splats.length-1].particles[i].vel.z);
    }
  }
  death(dir){
    this.dead=true;
    for(let i=0; i<zombies.length; i++){
      if(zombies[i].pos.equals(this.pos)){
        if (deathParticles==true)
        //splats.push(new Splat(this.pos.x/gridSize, this.pos.y/gridSize, 1, 50-splats.length/2, 20+splats.length/4, .25, dir.x/-10, dir.y/-10, random(1, 3), color(165, 50, 50), this.size, 0, 0, 0, 0, 0, 0))
        splats.push(new Splat(this.pos.x/gridSize, this.pos.y/gridSize, 1, 50-splats.length/2, 20+splats.length/4, .25, dir.x/-10, dir.y/-10, random(1, 3), color(13, 117, 41), this.size, 0, 0, 0, 0, 0, 0))
      }
    }
  }
  update(){
    this.count+=deltaTime
    if(this.count>100000){
      count = 0;
    }
    // death shake
    if(this.dead==true){
      this.deadCount-=round(deltaTime);
      let shakeAmnt = 3;
      if(this.deadCount%2==0){
        let shakeDir = createVector(random(-1, 1), random(-1, 1)).normalize().mult(this.deadCount*shakeAmnt)
        camera.shake(this.deadCount/(this.shakeLength*10)+0.1, 0, shakeDir.x, shakeDir.y);
      }
      if(this.deadCount<=0){
        camera.shake(0.1, 1, 0, 0);
        for(let i=0; i<zombies.length; i++){
          if(zombies[i].seed==this.seed){
            zombies.splice(i, 1);
          }
        }
      }
    }

    // when alive
    if(this.dead==false){
      this.coolCount-=deltaTime
      if(this.coolCount<0){
        this.coolCount=0;
      }
      this.raycastToPlayer(player.pos.x/gridSize, player.pos.y/gridSize, this.raySegments);

      if(this.wander==false && gameState==1){
        // if no line of sight:
        if(this.inSight==false && this.foundPath.length>0){
          this.pathFollow();
        }
        else{
          this.foundPath=[];
          this.acc=p5.Vector.sub(player.pos, this.pos).normalize().mult(deltaTime);
          // deal damage to player
          if(!keyIsDown(69) && this.pos.dist(player.pos)<=this.size/2+player.size/2 && this.coolCount <= 0){
            if(player.iCount<=0){
              player.takeDamage(this.attackDamage, player.vel.mag()+player.maxVel, this.pos);
              screenUi.vigOffset = 0;
            }
            else{
              player.size = player.defSize*1.2
              player.vel.sub(p5.Vector.sub(this.pos, player.pos).normalize().mult(player.vel.mag()+player.maxVel))
            }
            this.vel.sub(p5.Vector.sub(player.pos, this.pos).normalize().mult(100))
            camera.shake(.3, .2, (player.pos.x-this.pos.x)*.5, (player.pos.y-this.pos.y)*.5)
            this.coolCount = this.attackCooldown;
          }
        }
      }
      else{
        noiseSeed(this.seed);
        this.acc = createVector((noise(this.count/100)-0.5)*10, (noise(100+this.count/100)-0.5)*10)
        this.acc.limit(this.maxVel/10)
        if(gameState==0){
          if(this.pos.x<camera.pos.x-150){
            this.pos.x = camera.pos.x+width+50;
          }
          if(this.pos.x > camera.pos.x+width+150){
            this.pos.x = camera.pos.x-50;
          }
          if(this.pos.y < camera.pos.y-150){
            this.pos.y = camera.pos.y+height+50;
          }
          if(this.pos.y > camera.pos.y+height+150){
            this.pos.y = camera.pos.y-50;
          }
        }
      }
      for(let i=0; i<zombies.length; i++){
        if(this.pos.dist(zombies[i].pos)<=this.size && this.pos.dist(zombies[i].pos)>0){
          this.acc.add(p5.Vector.sub(this.pos, zombies[i].pos).div(25))
          zombies[i].acc.sub(p5.Vector.sub(this.pos, zombies[i].pos).div(25))
          // swap zombies shown on cam in menu
          if(gameState == 0 && this.menuFollow==true && prevFollowZom !=zombies[i]){
            this.menuFollow = false;
            zombies[i].menuFollow = true;
            prevFollowZom = followZom;
            followZom = zombies[i];
          }
        }
      }

      if(this.size-this.defSize>1){
        this.size = lerp(this.size, this.defSize, .1)
        this.overlayOpac = lerp(this.overlayOpac, 0, 0.1)
      }
      else if(this.size!=this.defSize){
        this.size = this.defSize;
        this.overlayOpac = 0;
      }

      this.updateAtt();
    }
  }

  // raycast from corners of body
  bodyCast(x, y, segments){
    let a = (this.size/2)/gridSize
    let xDir = (x-this.pos.x)/abs(x-this.pos.x);
    let yDir = (y-this.pos.y)/abs(y-this.pos.y);
    let check = false;

    if(showPath==1 || showPath==3){
      // top left
      line(worldSpaceToScreenSpace(this.pos.x/gridSize-a, null), worldSpaceToScreenSpace(null, this.pos.y/gridSize-a), worldSpaceToScreenSpace(x-a, null), worldSpaceToScreenSpace(null, y-a))
      // top right
      line(worldSpaceToScreenSpace(this.pos.x/gridSize+a, null), worldSpaceToScreenSpace(null, this.pos.y/gridSize-a), worldSpaceToScreenSpace(x+a, null), worldSpaceToScreenSpace(null, y-a))
      // bottom left
      line(worldSpaceToScreenSpace(this.pos.x/gridSize-a, null), worldSpaceToScreenSpace(null, this.pos.y/gridSize+a), worldSpaceToScreenSpace(x-a, null), worldSpaceToScreenSpace(null, y+a))
      // bottom right
      line(worldSpaceToScreenSpace(this.pos.x/gridSize+a, null), worldSpaceToScreenSpace(null, this.pos.y/gridSize+a), worldSpaceToScreenSpace(x+a, null), worldSpaceToScreenSpace(null, y+a))
    }
    if(xDir==-1 && yDir==-1){
      if(this.raycast(x-a, y-a, this.raySegments)==true
      || this.raycast(x-a, y+a, this.raySegments)==true
      || this.raycast(x+a, y-a, this.raySegments)==true){
        check=true;
      }
    }
    else if (xDir==1 && yDir==-1){
      if(this.raycast(x-a, y-a, this.raySegments)==true
      || this.raycast(x+a, y+a, this.raySegments)==true
      || this.raycast(x+a, y-a, this.raySegments)==true){
        check=true;
      }
    }
    else if (xDir==-1 && yDir==1){
      if(this.raycast(x-a, y-a, this.raySegments)==true
      || this.raycast(x-a, y+a, this.raySegments)==true
      || this.raycast(x+a, y+a, this.raySegments)==true){
        check=true;
      }
    }
    else if (xDir==1 && yDir==1){
      if(this.raycast(x-a, y+a, this.raySegments)==true
      || this.raycast(x-a, y+a, this.raySegments)==true
      || this.raycast(x+a, y-a, this.raySegments)==true){
        check=true;
      }
    }
    return check;
  }

  raycastToPlayer(x, y, segments){
    if (this.raycast(x, y, segments)==false && this.inSight==false){
      this.inSight = true;
      this.foundPath = [];
    }
    else if (this.raycast(x, y, segments)==true && this.inSight==true){
      this.inSight = false;
      this.smartPathFind();
    }

    if(this.inSight==true && this.wander==true){
      this.wander=false;
    }
  }
  smartPathFind(){
    let check = false;
    for(let i=0; i<zombies.length; i++){
      if(zombies[i].foundPath.length>0 && zombies[i].foundPath!=this.foundPath && zombies[i].foundPathCount>this.foundPathCount){
        if(zombies[i].inSight==false && zombies[i].wander==false && zombies[i].pos.x!=this.pos.x && this.bodyCast(zombies[i].foundPath[zombies[i].foundPath.length-1].x, zombies[i].foundPath[zombies[i].foundPath.length-1].y, this.raySegments)==false){
          // cast path to check if it can go to
          check=true;
          this.foundPath = zombies[i].foundPath;
          this.foundPathCount = zombies[i].foundPathCount;
          break;
        }
      }
    }
    if(check==false){
      this.pathFind();
    }
  }
  pathFind(){
    if(showPath==1||showPath==3){
      for(let i=0; i<this.foundPath.length; i++){
        terrain.layout[this.foundPath[i].y][this.foundPath[i].x].collide = false;
      }
    }

    this.path = []
    this.foundPath = []
    this.foundPathCount = pathCount;
    pathCount++
    // only go in range
    for(let i=0; i<terrainSize.y; i++){
      this.path.push([]);
      for(let k=0; k<terrainSize.x; k++){
        this.path[i].push(-1);
      }
    }
    let points = [createVector(round(this.pos.x/gridSize), round(this.pos.y/gridSize))] //craetevector for each coord
    let newPoints = [];
    this.path[points[0].y][points[0].x]=0;
    for(let c=1; c<25; c++){
      for(let i=0; i<points.length; i++){
        // top
        if(points[i].y>0){
          if((this.path[points[i].y-1][points[i].x]==-1||this.path[points[i].y-1][points[i].x]>c)&&terrain.layout[points[i].y-1][points[i].x].collide==false){
            this.path[points[i].y-1][points[i].x]=c;
            newPoints.push(createVector(points[i].x, points[i].y-1))
          }
        }
        // right
        if(points[i].x<terrainSize.x){
          if((this.path[points[i].y][points[i].x+1]==-1||this.path[points[i].y][points[i].x+1]>c)&&terrain.layout[points[i].y][points[i].x+1].collide==false){
            this.path[points[i].y][points[i].x+1]=c;
            newPoints.push(createVector(points[i].x+1, points[i].y))
          }
        }
        // bottom
        if(points[i].y<terrainSize.y){
          if((this.path[points[i].y+1][points[i].x]==-1||this.path[points[i].y+1][points[i].x]>c)&&terrain.layout[points[i].y+1][points[i].x].collide==false){
            this.path[points[i].y+1][points[i].x]=c;
            newPoints.push(createVector(points[i].x, points[i].y+1))
          }
        }
        // left
        if(points[i].x>0){
          if((this.path[points[i].y][points[i].x-1]==-1||this.path[points[i].y][points[i].x-1]>c)&&terrain.layout[points[i].y][points[i].x-1].collide==false){
            this.path[points[i].y][points[i].x-1]=c;
            newPoints.push(createVector(points[i].x-1, points[i].y))
          }
        }
      }
      points = [];
      for(let m=0; m<newPoints.length; m++){
        points.push(newPoints[m])
      }
      newPoints = [];
    }
    let currentPos = createVector(round(player.pos.x/gridSize), round(player.pos.y/gridSize))
    let firstNum = this.path[round(player.pos.y/gridSize)][round(player.pos.x/gridSize)]
    this.foundPath.push(currentPos)
    for(let i=0; i<firstNum; i++){
      //top
      if(this.path[currentPos.y-1][currentPos.x]<this.path[currentPos.y][currentPos.x] && this.path[currentPos.y-1][currentPos.x]!=-1){
        currentPos = createVector(currentPos.x, currentPos.y-1)
      }
      //right
      else if(this.path[currentPos.y][currentPos.x+1]<this.path[currentPos.y][currentPos.x] && this.path[currentPos.y][currentPos.x+1]!=-1){
        currentPos = createVector(currentPos.x+1, currentPos.y)
      }
      //bottom
      else if(this.path[currentPos.y+1][currentPos.x]<this.path[currentPos.y][currentPos.x] && this.path[currentPos.y+1][currentPos.x]!=-1){
        currentPos = createVector(currentPos.x, currentPos.y+1)
      }
      //left
      else if(this.path[currentPos.y][currentPos.x-1]<this.path[currentPos.y][currentPos.x] && this.path[currentPos.y][currentPos.x-1]!=-1){
        currentPos = createVector(currentPos.x-1, currentPos.y)
      }
      this.foundPath.push(currentPos)


      if(showPath==1||showPath==3){
        terrain.layout[currentPos.y][currentPos.x] = diamond_block.copy(currentPos.x, currentPos.x);
      }


    }
    // if path isnt found
    if(this.foundPath.length==1){
      this.wander=true;
      this.vel=createVector(0,0)
      this.acc=createVector(0,0)
    }
  }
  pathFollow(){
    let nearest = 0;
    for(let i=0; i<this.foundPath.length; i++){
      if(this.raycast(this.foundPath[i].x, this.foundPath[i].y, 2)==false){
        nearest = i;
        break;
      }
    }
    this.acc=p5.Vector.sub(p5.Vector.mult(this.foundPath[nearest], gridSize), this.pos).normalize();
    stroke(255);
    if (round(this.pos.x/gridSize)==this.foundPath[nearest].x && round(this.pos.y/gridSize)==this.foundPath[nearest].y){
      this.smartPathFind();
    }
  }
  render(){
    if(this.pos.x>camera.pos.x-this.size/2 && this.pos.x < camera.pos.x+width+this.size/2 && this.pos.y>camera.pos.y-this.size/2 && this.pos.y<camera.pos.y+height+this.size/2){
      if(entityShadows)
        image(shadow, this.pos.x-camera.pos.x-this.size*1, this.pos.y-camera.pos.y-this.size*1, this.size*2, this.size*2);
      image(zombieTexture, this.pos.x-camera.pos.x-this.size/2, this.pos.y-camera.pos.y-this.size/2, this.size, this.size);
      fill(250, 100, 100, this.overlayOpac)
      strokeWeight(3);
      stroke(125, 50, 50, this.overlayOpac)
      ellipse(this.pos.x-camera.pos.x, this.pos.y-camera.pos.y, this.size, this.size);
      textSize(20)
      fill(100,100,255, 150)
    }
    if(showHitboxes == 1 || showHitboxes == 3) rect(this.pos.x-camera.pos.x-this.size/2, this.pos.y-camera.pos.y-this.size/2, this.size, this.size);
    if(showCoords==1||showCoords==3){
      fill(255)
      text((floor(this.worldPos.x*10)/10+", "+floor(this.worldPos.y*10)/10),this.pos.x-camera.pos.x, this.pos.y-camera.pos.y);
    }
    stroke(255)
    if(this.foundPath.length>0)

    fill(100, 250, 200)
    if(showPath==2||showPath==3){
      for(let i=floor(camera.worldPos.y); i<floor(camera.worldPos.y+height/gridSize)+2; i++){
        for(let k=floor(camera.worldPos.x); k<floor(camera.worldPos.x+width/gridSize)+2; k++){
          textSize(20)
          fill(0)
          noStroke();
          if(this.path[i][k]!=-1){
            text(this.path[i][k], worldSpaceToScreenSpace(k,null),worldSpaceToScreenSpace(null, i))
          }
        }
      }
    }

  }
  run(){
    this.update();
    if(this.dead==false)
    this.render();
  }
}

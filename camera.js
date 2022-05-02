// CAMERA CLASS \\
class Camera{
  constructor(speed, d){
    this.speed = speed // 7
    this.damp = d;
    this.dynamic = true
    this.normPos = createVector(player.pos.x, player.pos.y);
    this.pos = createVector(player.pos.x, player.pos.y);
    this.shakeMod = createVector(0,0)
    this.currentShakeMod=  createVector(0,0)
    this.shakeSpeed = createVector(0,0);
    this.curShakeSpeed = 0;
    this.shakeState = "off" // in, out;
    this.worldPos = createVector(player.worldPos.x, player.worldPos.y);
  }
  update(){

    if(this.dynamic==true && this.gameState==1)  this.speed = lerp(this.speed, player.pos.dist(createVector(camera.normPos.x+width/2, camera.normPos.y+height/2))/100*(player.maxVel/player.defMaxVel), this.damp/100*frameMult*timeMult)
    if(gameState==1)
    camera.normPos = p5.Vector.lerp(camera.normPos, createVector(player.pos.x-width/2+(mouseX-width/2)/this.damp, player.pos.y-height/2+(mouseY-height/2)/this.damp), this.speed/100*frameMult*timeMult);
    else if (gameState==0){
      camera.normPos = p5.Vector.lerp(camera.normPos, createVector(followZom.pos.x-width/2+(mouseX-width/2)/this.damp, followZom.pos.y-height/2+(mouseY-height/2)/this.damp), this.speed/100*frameMult*timeMult);
    }

    if(camera.pos.x<gridSize/2) camera.pos.x=gridSize/2;
    if(camera.pos.y<gridSize/2) camera.pos.y =gridSize/2;
    if(camera.pos.x>terrainSize.x*gridSize-(width+gridSize*1.5)) camera.pos.x = terrainSize.x*gridSize-(width+gridSize*1.5);
    if(camera.pos.y>terrainSize.y*gridSize-(height+gridSize*1.5)) camera.pos.y = terrainSize.y*gridSize-(height+gridSize*1.5);

    if(this.shakeState!="off")
    this.currentShakeMod = p5.Vector.lerp(this.currentShakeMod, this.shakeMod, this.curShakeSpeed)

    if(this.shakeState=="in"){
      if(abs(this.currentShakeMod.mag()-this.shakeMod.mag())<this.shakeMod.mag()/5){
        this.shakeState=="out";
        this.curShakeSpeed = this.shakeSpeed.y;
        this.shakeMod = createVector(0,0)
      }
    }
    else if(this.shakeState=="out"){
      if(this.currentShakeMod.mag() > 10){
        this.shakeState=="off";
        this.curShakeSpeed = 0;
      }
    }
    this.pos = p5.Vector.add(this.normPos, p5.Vector.mult(this.currentShakeMod, deltaTime));

    camera.worldPos = createVector(this.pos.x/gridSize, this.pos.y/gridSize);
  }
  shake(inSpeed, outSpeed, dirx, diry){
    this.shakeState = "in"
    this.shakeMod = createVector(dirx, diry);
    this.shakeSpeed = createVector(inSpeed, outSpeed);
    this.curShakeSpeed = inSpeed;
  }
}

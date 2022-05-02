//stop particle movement as soon as on square with collision
class Splat{
  constructor(x, y, z, amnt, size, outvel, xvel, yvel, zvel, clr, range){
    this.pos = createVector(x, y, z)
    this.particles = [];
    this.follow = [];
    this.clr = clr;
    this.range = range/gridSize
    this.amnt = amnt;
    for(let i=0; i<amnt; i++){
      this.particles.push(new Particle(random(x-this.range/2, x+this.range/2), random(y-this.range/2, y+this.range/2), random(z-this.range/2, z+this.range/2), color(red(clr)+random(-10, 10), green(clr)+random(-10, 10), blue(clr)+random(-10,10)), random(size/2, size), random(-1, 1)*outvel+xvel, random(-1, 1)*outvel+yvel, random(0, 1)*outvel+zvel, 0,0,-.1, 255))
      this.follow.push(null)
    }
  }
  update(){
    if(this.particles.length<this.amnt/2){
      for(let i=0; i<splats.length; i++){
        if(splats[i].pos.equals(this.pos)){
          splats.splice(i, 1);
        }
      }
    }
    for(let i=0; i<this.particles.length; i++){
      if(this.particles[i].pos.z>0 && this.follow[i]==null && terrain.layout[round(this.particles[i].pos.y)][round(this.particles[i].pos.x)].collide==false){
        this.particles[i].vel.div(1.1)
        this.particles[i].update();
      }
      else{
        this.particles[i].size = lerp(this.particles[i].size, -this.particles[i].pos.z, 0.003*deltaTime);
        this.particles[i].opacity = lerp(this.particles[i].opacity, 0, 0.01*deltaTime);
      }
      if(this.follow[i]==null && this.particles[i].pos.z<=7.5 && this.particles[i].pos.z>.5){
        for(let m=zombies.length-1; m>=0; m--){
          if(createVector(this.particles[i].pos.x*gridSize, this.particles[i].pos.y*gridSize).dist(zombies[m].pos)<=zombies[m].size/2 && zombies[m].dead==false){
            this.follow[i]=zombies[m];
            this.size*=2;
            break;
          }
        }
      }


      if(this.particles[i].opacity<=50 || this.particles[i].pos.x*gridSize<camera.pos.x || this.particles[i].pos.x*gridSize>camera.pos.x+width || this.particles[i].pos.y*gridSize<camera.pos.y || this.particles[i].pos.y*gridSize > camera.pos.y+height){
        this.particles.splice(i, 1);
        this.follow.splice(i,1)
      }
    }
  }
  render(sect){
    for(let i=0; i<this.particles.length; i++){
      if(worldSpaceToScreenSpace(this.particles[i].pos.x, null)>0 && worldSpaceToScreenSpace(this.particles[i].pos.x, null)<width && worldSpaceToScreenSpace(null, this.particles[i].pos.y)>0 && worldSpaceToScreenSpace(null, this.particles[i].pos.y)<height){
        if(this.follow[i]!=null && sect==2){
          this.particles[i].vel=createVector(0,0,0);
          this.particles[i].pos.add(p5.Vector.div(this.follow[i].vel, gridSize))
          this.particles[i].pos.z=2;
          if(this.follow[i].dead==true){
            this.follow[i]=null;
          }

        }
        if((this.particles[i].pos.z<2 && sect==1) || (this.particles[i].pos.z>=2 && sect==2)){
          this.particles[i].clr = color(red(this.particles[i].defClr)+this.particles[i].pos.z*2.5, green(this.particles[i].defClr)+this.particles[i].pos.z*2.5, blue(this.particles[i].defClr)+this.particles[i].pos.z*2.5)
          this.particles[i].render();
        }
      }
    }
  }
  run(){
    this.update();
    this.render(1);
  }
}

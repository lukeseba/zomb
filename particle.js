class Particle{
  constructor(x, y, z, clr, size, xvel, yvel, zvel, xacc, yacc, zacc, opac){
    this.pos = createVector(x, y, z);
    this.vel = createVector(xvel, yvel, zvel);
    this.acc = createVector(xacc, yacc, zacc);
    this.size = size;
    this.defClr = clr;
    this.clr = clr;
    this.opacity = opac;
  }
  update(){
    this.vel.add(p5.Vector.mult(this.acc, deltaTime));
    this.pos.add(p5.Vector.mult(this.vel, deltaTime));
    if(this.opacity<10 || this.pos.z<0 || this.size<0.1){
      for(let i=0; i<particles.length; i++){
        if(particles[i].pos.equals(this.pos)){
          particles.splice(i, 1);
        }
      }
    }
  }
  render(){
    noStroke();
    fill(color(red(this.clr), green(this.clr), blue(this.clr), this.opacity));
    circle(worldSpaceToScreenSpace(this.pos.x, null), worldSpaceToScreenSpace(null, this.pos.y), this.size+this.pos.z);
  }
  run(){
    this.update();
    if(worldSpaceToScreenSpace(this.pos.x, null)>0 && worldSpaceToScreenSpace(this.pos.x, null)<width && worldSpaceToScreenSpace(null, this.pos.y)>0 && worldSpaceToScreenSpace(null, this.pos.y)<height)
    this.render();
  }
}

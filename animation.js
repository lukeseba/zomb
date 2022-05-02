class Animation{
  constructor(textures, frameWidth, gx, gy){
    this.gridSize = createVector(gx, gy)
    this.texture = textures;
    this.frame = [];
    this.count = 0;
    this.texture.loadPixels();
    for(let i=0; i<this.texture.width/frameWidth; i++){
      this.frame.push(createImage(frameWidth, this.texture.height));
      this.frame[i].loadPixels();
      for(let px =0; px<frameWidth; px++){
        for(let py=0; py<this.texture.height; py++){
          this.frame[i].set(px, py, this.texture.get(px+i*frameWidth, py))
        }
      }
      this.frame[i].updatePixels();
    }
    this.texture.updatePixels();
  }
  draw(x, y, wx, wy, speed){
    image(this.frame[floor(this.count)], x, y, wx, wy)
    this.count+=deltaTime/60*speed
    if(this.count>=this.frame.length){
      this.count=0;
    }
  }
  setFrame(){

  }
  play(){

  }
}

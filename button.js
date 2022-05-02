class Button{
  constructor(texture, x, y, w, h, func, txt){
    this.texture = texture;
    this.pos = createVector(x, y);
    this.size = createVector(w, h);
    this.defPos = createVector(x, y);
    this.defSize = createVector(w, h)
    this.modPos = createVector(0,0);
    this.modSize = createVector(0,0);
    this.currentSize = createVector(w,h);
    this.currentPos = createVector(x,y);
    this.func = func;
    this.txt;
    if(txt==undefined){
      this.txt=false;
    }

    this.validClick = true;

    this.changeMod = 1.1
    this.threshold = 1;
    this.moveSpeed = 0.2;
  }
  update(){

    // transformation  updates
    if(abs(this.currentPos.x-this.pos.x)<=this.threshold){
      this.currentPos.x=this.pos.x
    }
    else{
      this.currentPos.x = lerp(this.currentPos.x, this.pos.x, this.moveSpeed*frameMult  );
    }
    if(abs(this.currentPos.y-this.pos.y)<=this.threshold){
      this.currentPos.y=this.pos.y
    }
    else{
      this.currentPos.y = lerp(this.currentPos.y, this.pos.y, this.moveSpeed*frameMult);
    }

    if(abs(this.currentSize.x-this.size.x)<=this.threshold){
      this.currentSize.x=this.size.x
    }
    else{
      this.currentSize.x = lerp(this.currentSize.x, this.size.x, this.moveSpeed*frameMult);
    }
    if(abs(this.currentSize.y-this.size.y)<=this.threshold){
      this.currentSize.y=this.size.y
    }
    else{
      this.currentSize.y = lerp(this.currentSize.y, this.size.y, this.moveSpeed*frameMult);
    }

    //test if hover
    if(this.hover()==false){
      if(mouseIsPressed)
        this.validClick=false;
      else
        this.validClick=true;
    }
    else if(mouseIsPressed==false)
      this.validClick=true;

    if(this.hover()){
      this.size = createVector(this.defSize.x * this.changeMod, this.defSize.y * this.changeMod);
      this.pos = createVector(this.defPos.x - ((this.size.x-this.defSize.x) * this.changeMod)/2, this.defPos.y - ((this.size.y-this.defSize.y) * this.changeMod)/2);
      if(mouseIsPressed && this.validClick==true){
        this.func();
      }
    }
    else{
      this.size = createVector(this.defSize.x, this.defSize.y);
      this.pos = createVector(this.defPos.x, this.defPos.y);
    }
  }
  render(){
    if(this.txt==false){
      image(this.texture, this.currentPos.x+this.modPos.x, this.currentPos.y+this.modPos.y, this.currentSize.x+this.modSize.x, this.currentSize.y+this.modSize.y)
    }
    else{
      fill(150, 230)
      rect(this.currentPos.x+this.modPos.x, this.currentPos.y+this.modPos.y, this.currentSize.x+this.modSize.x, this.currentSize.y+this.modSize.y, 5);
      textSize((this.currentSize.y+this.modSize.y)/2  );
      fill(220);
      textAlign(CENTER, CENTER)
      text(this.texture, this.currentPos.x+this.modPos.x+(this.currentSize.x+this.modSize.x)/2, this.currentPos.y+this.modPos.y+(this.currentSize.y+this.modSize.y)/2)
    }
  }
  run(){
    this.update();
    this.render();
  }

  hover(){
    return (mouseX>this.pos.x && mouseX<this.pos.x+this.size.x && mouseY>this.pos.y && mouseY<this.pos.y+this.size.y)
  }
}

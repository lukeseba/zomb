// ITEM CLASS \\
class Block{
  constructor(name, health, shvLvl, axeLvl, picLvl, shvEff, axeEff, picEff, texture, collide, visible, randomRot, level, x, y){
    this.pos;
    this.randomRot = randomRot;
    this.rotValue = 0;
    if(x==undefined||y==undefined){
      this.pos = createVector(-1,-1);
    }
    else{
      this.pos = createVector(x, y)
      this.rotValue = floor(noise(x, y)*4);
    }
    this.visible = visible;
    this.name = name;
    this.texture = texture;
    this.collide = collide;
    this.health = health;
    this.maxHealth = health;
    this.shvLvl = shvLvl;
    this.axeLvl = axeLvl;
    this.picLvl = picLvl;
    this.shvEff = shvEff;
    this.axeEff = axeEff;
    this.picEff = picEff;
    this.level=level;
    this.timer = 0;
  }
  damage(amnt){
    this.timer = worldTimer;
    this.health-=amnt;
    if(this.health<=0 && this.level==0){
      terrain.floorLayout[this.pos.y][this.pos.x]=air.copy(this.pos.x, this.pos.y)
      this.dropItem();
    }
    if(this.health<=0 && this.level==1){
      terrain.layout[this.pos.y][this.pos.x]=air.copy(this.pos.x, this.pos.y)
      this.dropItem();
    }
    if(this.health<=0 && this.level==2){
      terrain.roofLayout[this.pos.y][this.pos.x]=air.copy(this.pos.x, this.pos.y)
      this.dropItem();
    }
  }
  copy(x, y){
    return new Block(this.name, this.maxHealth, this.shvLvl, this.axeLvl, this.picLvl, this.shvEff, this.axeEff, this.picEff, this.texture, this.collide, this.visible, this.randomRot, this.level, x, y);
  }
  dropItem(){
    renderItems.push(new BlockItem(this.copy(), 1, this.pos.x+random(-.2, .2), this.pos.y+random(-.2,.2)))
    renderItems[renderItems.length-1].vel = createVector(random(-.2, .2), random(-.2, .2))
  }
}

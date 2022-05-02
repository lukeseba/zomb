// ITEM CLASS \\
let itemDist, checkForItem, tempBlock;

class Item{
  constructor(name, amnt, type, texture, x, y){
    this.seed = itemVals;
    itemVals++;
    this.name = name;
    this.amnt = amnt;
    this.type = type;
    this.texture=texture
    this.pos = createVector(x, y, 0)
    this.vel = createVector(0,0, 0);
    this.acc = createVector(0,0, 0);
  }
  findInvNum(){
    for(let i=0; i<player.inventory.length; i++){
      if(player.inventory[i].seed==this.seed){
        return i;
      }
    }
    return false;
  }
  invRemove(){
    player.inventory.splice(this.findInvNum(), 1)
  }
  update(){
    this.vel.add(p5.Vector.mult(this.acc, 1))
    if(abs(this.vel.x)>0.001 || abs(this.vel.y)>0.001){
      this.vel.x/=1.2;
      this.vel.y/=1.2;
      if(terrain.layout[round(this.pos.y)][round(this.pos.x)].collide==true && this.acc.x==0 && this.acc.y==0){
        this.vel.x=0;
        this.vel.y=0;
      }
    }
    else if (abs(this.vel.x)>0 && abs(this.vel.y)>0){
      this.vel.x=0;
      this.vel.y=0;
    }
    this.pos.add(p5.Vector.mult(this.vel, deltaTime));
    itemDist = player.worldPos.dist(this.pos);
    if(itemDist<=3){
      this.acc = p5.Vector.sub(player.worldPos, this.pos).limit(.05);
    }
    else{
      this.acc.x = 0;
      this.acc.y = 0;
    }
    if(itemDist<=player.size/2/gridSize){
      checkForItem = false;
      for(let i=0; i<renderItems.length; i++){
        if(renderItems[i].seed==this.seed){
          renderItems.splice(i, 1);

          for(let k=0; k<player.inventory.length; k++){
            if(player.inventory[k]!=null && player.inventory[k].name==this.name){
              player.inventory[k].amnt++;
              checkForItem=true;
            }
          }

          if(checkForItem==false){
            if(this.type=="block"){
              this.block.health = this.block.maxHealth;
              player.inventory.push(new BlockItem(this.block, 1));
            }
          }
        }
      }
    }
  }
  render(){
    image(shadow, worldSpaceToScreenSpace(this.pos.x-.75, null), worldSpaceToScreenSpace(null, this.pos.y-.75), gridSize*1.5, gridSize*1.5);
    image(this.texture, worldSpaceToScreenSpace(this.pos.x-0.25, null), worldSpaceToScreenSpace(null, this.pos.y-0.25), gridSize/2, gridSize/2)
  }
  run(){
    this.update();
    this.render();
  }
}

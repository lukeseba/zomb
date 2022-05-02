// WEAOPON CLASS \\

class BlockItem extends Item{
  constructor(block, amount, x, y){
    super(block.name, amount, "block", block.texture[0][0], x, y);
    this.block = block;
  }
  place(){
    // make new copy of block object
    if(this.block.level == 0){
      if(terrain.floorLayout[round(screenSpaceToWorldSpace(null, mouseY))][round(screenSpaceToWorldSpace(mouseX, null))].name=="air"){
        this.amnt--;
        terrain.floorLayout[round(screenSpaceToWorldSpace(null, mouseY))][round(screenSpaceToWorldSpace(mouseX, null))] = this.block.copy(round(screenSpaceToWorldSpace(mouseX, null)),round(screenSpaceToWorldSpace(null, mouseY)));
      }
    }
    else if(this.block.level == 1){
      if(terrain.layout[round(screenSpaceToWorldSpace(null, mouseY))][round(screenSpaceToWorldSpace(mouseX, null))].name=="air"){
        this.amnt--;
        terrain.layout[round(screenSpaceToWorldSpace(null, mouseY))][round(screenSpaceToWorldSpace(mouseX, null))] = this.block.copy(round(screenSpaceToWorldSpace(mouseX, null)),round(screenSpaceToWorldSpace(null, mouseY)));
      }
    }
    else if(this.block.level == 2){
      if(terrain.roofLayout[round(screenSpaceToWorldSpace(null, mouseY))][round(screenSpaceToWorldSpace(mouseX, null))].name=="air"){
        this.amnt--;
        terrain.roofLayout[round(screenSpaceToWorldSpace(null, mouseY))][round(screenSpaceToWorldSpace(mouseX, null))] = this.block.copy(round(screenSpaceToWorldSpace(mouseX, null)),round(screenSpaceToWorldSpace(null, mouseY)));
      }
    }
    if(this.amnt==0){
      this.invRemove();
    }
  }
}

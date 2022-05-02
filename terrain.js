// TERRAIN CLASS \\
let noiseNum, textureVal, vislayer, transp, topDist

class Terrain{
  constructor(sx, sy){
    this.size = createVector(sx, sy);

    this.groundLayout = [];
    this.floorLayout = [];
    this.layout = [];
    this.roofLayout = [];

    for(let i=0; i<this.size.x; i++){
      this.groundLayout.push([]);
      this.floorLayout.push([]);
      this.layout.push([]);
      this.roofLayout.push([]);

      for(let k=0; k<this.size.y; k++){
        noiseNum = floor(noise(i/noiseAmnt, k/noiseAmnt)*3);
        if(noiseNum==0){
          this.groundLayout[i].push(stone.copy(k, i))
          this.floorLayout[i].push(water.copy(k, i))
          this.layout[i].push(air.copy(k, i))
          this.roofLayout[i].push(air.copy(k, i))
        }
        if(noiseNum==1){
          this.groundLayout[i].push(dirt.copy(k, i))
          this.floorLayout[i].push(grass.copy(k, i))
          this.layout[i].push(air.copy(k, i))
          this.roofLayout[i].push(air.copy(k, i))
        }
        if(noiseNum==2){
          this.groundLayout[i].push(dirt.copy(k, i))
          this.floorLayout[i].push(grass.copy(k, i))
          this.layout[i].push(stone.copy(k, i))
          this.roofLayout[i].push(air.copy(k, i))
        }
      }
    }
  }
  // render all layers, or at least the topmost layer
  render(layer){
    noStroke();
    // if ambient occlusion is on, else do it the faster way (to see if its causing stuttering)
    if(blockShadows==true){
        for(let i=floor(camera.worldPos.y); i<floor(camera.worldPos.y+height/gridSize)+2; i++){
          for(let k=floor(camera.worldPos.x); k<floor(camera.worldPos.x+width/gridSize)+2; k++){
            textSize(20)
            // render top layer
            if(this.roofLayout[i][k].visible && layer==4){
              transp = 0;
              topDist = floor(createVector(round(player.worldPos.x), round(player.worldPos.y)).dist(createVector(k, i)))
              if(topDist<5) transp = 5-topDist;
              if(this.roofLayout[i][k].randomRot==true){
                if(randomTextures==true) textureVal = this.roofLayout[i][k].rotValue;
                else textureVal = 0;
                image(this.roofLayout[i][k].texture[transp][textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
              else{
                image(this.roofLayout[i][k].texture[transp][0], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
              // block health
              if(this.roofLayout[i][k].health<this.roofLayout[i][k].maxHealth){
                fill(255, 255-(this.roofLayout[i][k].health/this.roofLayout[i][k].maxHealth)*255)
                rect(k*gridSize-camera.pos.x-gridSize/2, i*gridSize-camera.pos.y-gridSize/2, gridSize, gridSize)
                if(worldTimer-this.roofLayout[i][k].timer>=300){
                  this.roofLayout[i][k].health+=deltaTime;
                  if(this.roofLayout[i][k].health>this.roofLayout[i][k].maxHealth)
                    this.roofLayout[i][k].health = this.roofLayout[i][k].maxHealth;
                }
              }
            }
            // render blockshadows higher
            else if (layer==3 && this.roofLayout[i][k].visible && (this.roofLayout[i-1][k].visible==false || this.roofLayout[i+1][k].visible==false || this.roofLayout[i][k-1].visible==false || this.roofLayout[i][k+1].visible == false)){
              image(blockShadowHigh, worldSpaceToScreenSpace(k, null)-gridSize*3, worldSpaceToScreenSpace(null, i)-gridSize*3, gridSize*6, gridSize*6)
            }
            // render middle layer
            else if(this.layout[i][k].visible && layer==2 && !(this.roofLayout.visible)){
              if(this.layout[i][k].randomRot==true){
                if(randomTextures==true) textureVal = this.layout[i][k].rotValue;
                else textureVal = 0;
                image(this.layout[i][k].texture[0][textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
              else{
                image(this.layout[i][k].texture[0][0], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
              // block health
              if(this.layout[i][k].health<this.layout[i][k].maxHealth){
                fill(255, 255-(this.layout[i][k].health/this.layout[i][k].maxHealth)*255)
                rect(k*gridSize-camera.pos.x-gridSize/2, i*gridSize-camera.pos.y-gridSize/2, gridSize, gridSize)
                if(worldTimer-this.layout[i][k].timer>=300){
                  this.layout[i][k].health+=deltaTime;
                  if(this.layout[i][k].health>this.layout[i][k].maxHealth)
                    this.layout[i][k].health = this.layout[i][k].maxHealth;
                }
              }
            }
            // render block shadows
            else if (layer==1 && this.layout[i][k].visible && (this.layout[i-1][k].visible==false || this.layout[i+1][k].visible==false || this.layout[i][k-1].visible==false || this.layout[i][k+1].visible == false)){
              image(blockShadow, worldSpaceToScreenSpace(k, null)-gridSize*2, worldSpaceToScreenSpace(null, i)-gridSize*2, gridSize*4, gridSize*4)
            }
            // render floor layer
            else if(this.floorLayout[i][k].visible && layer==0 && !(this.layout[i][k].visible || this.roofLayout.visible)){
              if(this.floorLayout[i][k].randomRot==true){
                if(randomTextures==true) textureVal = this.floorLayout[i][k].rotValue;
                else textureVal = 0;
                image(this.floorLayout[i][k].texture[0][textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
              else{
                image(this.floorLayout[i][k].texture[0][0], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }//block health
              if(this.floorLayout[i][k].health<this.floorLayout[i][k].maxHealth){
                fill(255, 255-(this.floorLayout[i][k].health/this.floorLayout[i][k].maxHealth)*255)
                rect(k*gridSize-camera.pos.x-gridSize/2, i*gridSize-camera.pos.y-gridSize/2, gridSize, gridSize)
                if(worldTimer-this.floorLayout[i][k].timer>=300){
                  this.floorLayout[i][k].health+=deltaTime;
                  if(this.floorLayout[i][k].health>this.floorLayout[i][k].maxHealth)
                    this.floorLayout[i][k].health = this.floorLayout[i][k].maxHealth;
                }
              }
            }
            // render floor shadows
            else if (layer==-1 && this.floorLayout[i][k].visible && (this.floorLayout[i-1][k].visible==false || this.floorLayout[i+1][k].visible==false || this.floorLayout[i][k-1].visible==false || this.floorLayout[i][k+1].visible == false)){
              image(blockShadow, worldSpaceToScreenSpace(k, null)-gridSize*1.5, worldSpaceToScreenSpace(null, i)-gridSize*1.5, gridSize*3, gridSize*3)
            }
            // render ground layer
            else if(this.groundLayout[i][k].visible && layer==-2 && !(this.floorLayout[i][k].visible || this.layout.visible || this.roofLayout.visible)){
              if(this.groundLayout[i][k].randomRot==true){
                if(randomTextures==true) textureVal = this.groundLayout[i][k].rotValue;
                else textureVal = 0;
                image(this.groundLayout[i][k].texture[0][textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
              else{
                image(this.groundLayout[i][k].texture[0][0], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
              }
            }

            //text(this.blockLayout[i][k].health , k*gridSize-camera.pos.x, i*gridSize-camera.pos.y)
            if(showCoords==2||showCoords==3){
              fill(0)
              text((k+", "+i), k*gridSize-camera.pos.x, i*gridSize-camera.pos.y)
            }
          }
        }
    }
    // single layer rendering
    else if(layer==0){
      for(let i=floor(camera.worldPos.y); i<floor(camera.worldPos.y+height/gridSize)+2; i++){
        for(let k=floor(camera.worldPos.x); k<floor(camera.worldPos.x+width/gridSize)+2; k++){
          textSize(20)
          vislayer = 2;
          if(this.roofLayout[i][k].visible){
            vislayer=0;
            if(this.roofLayout[i][k].randomRot==true){
              if(randomTextures==true) textureVal = this.roofLayout[i][k].rotValue;
              else textureVal = 0;
              image(this.roofLayout[i][k].texture[textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
            }
            else{
              image(this.roofLayout[i][k].texture, worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
            }
            if(this.roofLayout[i][k].health<this.roofLayout[i][k].maxHealth){
              fill(255, 255-(this.roofLayout[i][k].health/this.roofLayout[i][k].maxHealth)*255)
              rect(k*gridSize-camera.pos.x-gridSize/2, i*gridSize-camera.pos.y-gridSize/2, gridSize, gridSize)
            }
          }
          else if(this.layout[i][k].visible){
            vislayer=1;
            if(this.layout[i][k].randomRot==true){
              if(randomTextures==true) textureVal = this.layout[i][k].rotValue;
              else textureVal = 0;
              image(this.layout[i][k].texture[textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
            }
            else{
              image(this.layout[i][k].texture, worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
            }

            if(this.layout[i][k].health<this.layout[i][k].maxHealth){
              fill(255, 255-(this.layout[i][k].health/this.layout[i][k].maxHealth)*255)
              rect(k*gridSize-camera.pos.x-gridSize/2, i*gridSize-camera.pos.y-gridSize/2, gridSize, gridSize)
            }
          }
          else if(this.floorLayout[i][k].visible){
            if(this.floorLayout[i][k].randomRot==true){
              if(randomTextures==true) textureVal = this.floorLayout[i][k].rotValue;
              else textureVal = 0;
              image(this.floorLayout[i][k].texture[textureVal], worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
            }
            else{
              image(this.floorLayout[i][k].texture, worldSpaceToScreenSpace(k, null)-gridSize/2, worldSpaceToScreenSpace(null, i)-gridSize/2)
            }

            if(this.floorLayout[i][k].health<this.floorLayout[i][k].maxHealth){
              fill(255, 255-(this.floorLayout[i][k].health/this.floorLayout[i][k].maxHealth)*255)
              rect(k*gridSize-camera.pos.x-gridSize/2, i*gridSize-camera.pos.y-gridSize/2, gridSize, gridSize)
            }
          }

          //text(this.blockLayout[i][k].health , k*gridSize-camera.pos.x, i*gridSize-camera.pos.y)
          if(showCoords==2||showCoords==3){
            fill(0)
            text((k+", "+i), k*gridSize-camera.pos.x, i*gridSize-camera.pos.y)
          }
        }
      }
    }
  }
}

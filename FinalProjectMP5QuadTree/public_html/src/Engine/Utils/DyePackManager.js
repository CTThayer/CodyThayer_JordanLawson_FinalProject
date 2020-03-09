/* 
 * File: DyePackManager.js
 * Manages the DyePack objects
 */

"use strict";

function DyePackManager(spriteTexture) {
    this.dyePackTexture = spriteTexture;
    this.dyePackArray = [];
}

DyePackManager.prototype.draw = function (aCamera) {
    var i;
    for(i = 0; i < this.dyePackArray.length; i++){
        this.dyePackArray[i].draw(aCamera);
    }
};

DyePackManager.prototype.spawnDyePack = function (position){
        var newPack = new DyePack(this.dyePackTexture, position);
        this.dyePackArray.push(newPack);
        this.dyePackCount++;
};


DyePackManager.prototype.update = function () {
    
    
    // While the first item in the array is ready for deletion, remove the first item in the array
    
    
    var i;
    for(i = 0; i < this.dyePackArray.length; i++){
        if(this.dyePackArray[0].deleteCheck){
            this.dyePackArray.shift();
            i--;
            continue;
        }
        this.dyePackArray[i].update();
    }
};
//</editor-fold>
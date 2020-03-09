/* 
 * File: DyePackManager.js
 * Manages the DyePack objects
 */

"use strict";

function DyePackManager(spriteTexture) {
    this.dyePackTexture = spriteTexture;
    this.dyePackArray = [];
    this.mQuadTree = null;
}

DyePackManager.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.dyePackArray.length; i++) {
        this.dyePackArray[i].draw(aCamera);
    }
};

DyePackManager.prototype.spawnDyePack = function (position) {
    var newPack = new DyePack(this.dyePackTexture, position);
    this.dyePackArray.push(newPack);
    this.dyePackCount++;

    if (this.mQuadTree !== null) {
        this.mQuadTree.insert(newPack);
    }
};

DyePackManager.prototype.setUpTree = function (QuadTree) {
    this.mQuadTree = QuadTree;
    var i;
    for (i = 0; i < this.dyePackArray.length; i++) {
        QuadTree.insert(this.dyePackArray[i]);
    }
};

DyePackManager.prototype.update = function () {


    // While the first item in the array is ready for deletion, remove the first item in the array


    var i;
    for (i = 0; i < this.dyePackArray.length; i++) {
        if (this.dyePackArray[0].deleteCheck) {
            var p = this.dyePackArray.shift();
            if (this.mQuadTree !== null) {
                this.mQuadTree.remove(p);
            }
            i--;
            continue;
        }
        this.dyePackArray[i].update();
    }
};
//</editor-fold>
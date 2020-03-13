/* 
 * file: BruteforceCollision.js
 * 
 * Implements bruteforce collision checking
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ObjectManager(objectArray, texture) {
    this.objectArray = objectArray;

    this.quadMode = false;
    this.mQuadtree = null;
};

ObjectManager.prototype.addObject = function (object) {
    this.objectArray.push(object);
};

ObjectManager.prototype.removeObject = function (object) {
    var i = this.objectArray.indexOf(object);
    this.objectArray.splice(i, 1);
};

ObjectManager.prototype.draw = function (camera) {
    for (var i = 0; i < this.objectArray.length; i++) {
        this.objectArray[i].draw(camera);
    }
};

ObjectManager.prototype.quadTreeMode = function () {
    this.quadMode = !this.quadMode;

    if (this.mQuadtree === null) {
        this.mQuadtree = new Quadtree([-100, 100, -75, 75], 4, 10);
    } else
        this.mQuadtree = null;
};

ObjectManager.prototype.updateQuadtree = function () {
    // Wipe the Tree
    this.quadTree.clear();

    // Reinsert objects into tree so they are in the correct locations
    for (var i = 0; i < this.objectArray.length; i++) {
        this.quadTree.insert(this.objectArray[i]);
    }
};

ObjectManager.prototype.collisionCheck = function () {

    for (var i = 0; i < this.objectArray.length; i++) {
        for (var j = i + 1; j < this.objectArray.length; j++) {
            var h = [];
            
            var object1 = this.objectArray[i];
            var object2 = this.objectArray[j];
            //var check = object1.pixelTouches[object2, h];
            
            if(this.objectArray[i].pixelTouches(this.objectArray[j], h)){
                this.objectArray[i].mDyePack.setColor([1,0,0,1]);
                this.objectArray[j].mDyePack.setColor([1,0,0,1]);
            }
        }
    }
};

ObjectManager.prototype.quadCollisionCheck = function () {

};

ObjectManager.prototype.update = function () {
    
    // Change to QuadTree
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mQuadTreeMode = !this.mQuadTreeMode;

        if (this.mQuadtree === null) {
            this.mQuadtree = new Quadtree([-100, 100, -75, 75], 5, 10);
        } else
            this.mQuadtree = null;
    }
    
    for (var i = 0; i < this.objectArray.length; i++) {
        this.objectArray[i].mDyePack.setColor([0,0,0,0]);
        this.objectArray[i].update();
    }

    this.collisionCheck();
};
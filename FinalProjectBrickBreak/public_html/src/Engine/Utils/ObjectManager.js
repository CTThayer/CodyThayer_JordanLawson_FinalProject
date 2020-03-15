/* 
 * file: BruteforceCollision.js
 * 
 * Implements bruteforce collision checking
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ObjectManager(objectArray, texture) {
    this.objectArray = objectArray;
    this.texture = texture;
    this.quadMode = false;
    this.quadTree = null;
    this.visualization = false;
}
;

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

    if (this.quadTree === null) {
        this.quadTree = new Quadtree([-100, 100, -75, 75], 4, 10);
    } else
        this.quadTree = null;
};

ObjectManager.prototype.updateTree = function () {
    // Wipe the Tree
    this.quadTree.clear();

    // Insert Tree Stuff
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

            if (this.objectArray[i].pixelTouches(this.objectArray[j], h)) {
                this.objectArray[i].mDyePack.setColor([1, 0, 0, 1]);
                this.objectArray[j].mDyePack.setColor([1, 0, 0, 1]);
            }
        }
    }
};

ObjectManager.prototype.quadCollisionCheck = function () {
    var collide = false;
    for(var i = 0; i < this.objectArray.length; i++){
        var collisionArray =  Array.from(this.quadTree.getObjectsNear(this.objectArray[i]));
        
        for(var j = 0; j < collisionArray.length; j++){
            var h = [];
            var object1 = this.objectArray[i];
            var object2 = collisionArray[j];
            var test = this.objectArray[i].pixelTouches(collisionArray[j], h);
            if(this.objectArray[i] !== collisionArray[j] && this.objectArray[i].pixelTouches(collisionArray[j], h)){
                collide = true;
                collisionArray[j].mDyePack.setColor([1, 0, 0, 1]);
            }
        }
        if(collide){
            this.objectArray[i].mDyePack.setColor([1, 0, 0, 1]);
        }
    }
};

ObjectManager.prototype.update = function () {

    // Create more DyePacks
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        var dyePack = new DyePack(this.texture);
        this.objectArray.push(dyePack);
    }

    // Change to QuadTree
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.quadMode = !this.quadMode;

        if (this.quadTree === null) {
            this.quadTree = new Quadtree([-100, 100, -75, 75], 4, 10);
            this.updateTree();
        } else
            this.quadTree = null;
    }

    // Turn On QuadTree Visualization
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Z)) {

        // Make sure that mQuadTree is on
        if (this.quadTree === null) {
            this.quadMode = !this.quadMode;
            this.quadTree = new Quadtree([-100, 100, -75, 75], 4, 10);
        }
        this.visualization = !this.visualization;
    }

    if (this.visualization) {
        var quadrant = this.mQuadTree.getObjectsNear(this.objectArray[0]);
        for (var i = 0; i < quadrant.length; i++) {
            quadrant[i].mDyePack.setColor([0, 1, 0, 1]);
        }
    }
    for (var i = 0; i < this.objectArray.length; i++) {
        this.objectArray[i].mDyePack.setColor([0, 0, 0, 0]);
        this.objectArray[i].update();
    }
    
    if(!this.quadMode)
        this.collisionCheck();
    else {
        this.updateTree();
        this.quadCollisionCheck();
    }
};
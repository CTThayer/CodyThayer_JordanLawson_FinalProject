/* 
 * File: PatrolManager.js
 * Manages the Patrol objects
 */

"use strict";

function PatrolManager(wingTexture, headTexture, boxTexture, initPosition, WCBounds, dyePackArray, hero) {
    this.wingTexture = wingTexture;
    this.headTexture = headTexture;
    this.boxTexture = boxTexture;
    this.initPosition = initPosition;
    this.WCBounds = WCBounds;

    // ONLY FOR CHECKING AND CALLING COLLISION
    this.dyePackArray = dyePackArray;

    this.hero = hero;

    this.patrolArray = [];
    this.patrolCount = 0;
    this.spawnMode = false;
    this.counter = 0;
    this.nextInterval;

    this.mQuadTree = null;
}

PatrolManager.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.patrolArray.length; i++) {
        this.patrolArray[i].draw(aCamera);
    }
};

PatrolManager.prototype.spawnPatrol = function () {
    console.log("Init Position = " + this.initPosition);
    var newPatrol = new Patrol(this.wingTexture, this.headTexture, this.boxTexture, this.initPosition, this.WCBounds);
    this.patrolArray.push(newPatrol);
    this.patrolCount++;

    if (this.mQuadTree !== null) {
        this.mQuadTree.insert(newPatrol);
    }
};

PatrolManager.prototype.setUpTree = function (QuadTree) {
    this.mQuadTree = QuadTree;
    var i;
    for (i = 0; i < this.patrolArray.length; i++) {
        QuadTree.insert(this.patrolArray[i]);
    }
};

PatrolManager.prototype.update = function () {

    // Spawn object
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        this.spawnPatrol();
    }

    // Turn on/off spawn mode
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        this.spawnMode = !this.spawnMode;
        this.counter = 0;
        this.nextInterval = (Math.random() * (180 - 120) + 120);
    }

    // Check if spawn mode is on and if it's been long enough
    if (this.spawnMode && this.counter >= this.nextInterval) {
        this.spawnPatrol();
        this.counter = 0;
        this.nextInterval = (Math.random() * (180 - 120) + 120);
    }

    if (this.mQuadTree !== null) {
        var i;
        for (i = 0; i < this.patrolArray.length; i++) {
            if (this.patrolArray[i].deleteCheck) {
                var p = this.patrolArray.shift();
                p.clear;
                i--;
                continue;
            }
            this.patrolArray[i].update();

            var objects = this.mQuadTree.getObjectsNear(this.patrolArray[i]);
            objects = Array.from(objects);

            var j;
            var h = [];
            for (j = 0; j < objects.length; j++) {
                if (objects[j].type === "DyePack") {
                    if (this.patrolArray[i].mHead.pixelTouches(objects[j], h)) {
                        this.patrolArray[i].mHead.collide();
                        objects[j].shake();
                    } else if (this.patrolArray[i].mBotWing.pixelTouches(objects[j], h)) {
                        var color = this.patrolArray[i].mBotWing.mWing.getColor();
                        color[3] += 0.2;
                        this.patrolArray[i].mBotWing.mWing.setColor(color);
                        objects.shake();
                    } else if (this.patrolArray[i].mTopWing.pixelTouches(objects[j], h)) {
                        var color = this.patrolArray[i].mTopWing.mWing.getColor();
                        color[3] += 0.2;
                        this.patrolArray[i].mTopWing.mWing.setColor(color);
                        objects.shake();
                    }
                } else if (objects[j].type === "Hero") {
                    if (this.patrolArray[i].mHead.pixelTouches(objects[j], h)) {
                        if (!objects[j].runOscillation) {
                            objects[j].runOscillation = true;
                        }
                    } else if (this.patrolArray[i].mBotWing.pixelTouches(objects[j], h)) {
                        if (!objects[j].runOscillation) {
                            objects[j].runOscillation = true;
                        }
                    } else if (this.patrolArray[i].mTopWing.pixelTouches(objects[j], h)) {
                        if (!objects[j].runOscillation) {
                            objects[j].runOscillation = true;
                        }
                    }
                }
            }
        }
    } else {
        var i;
        for (i = 0; i < this.patrolArray.length; i++) {
            if (this.patrolArray[i].deleteCheck) {
                var p = this.patrolArray.shift();
                if (this.mQuadTree !== null) {
                    this.mQuadTree.remove(p);
                }
                p.clear;
                i--;
                continue;
            }
            this.patrolArray[i].update();

            var j;
            for (j = 0; j < this.dyePackArray.length; j++) {

                if (!this.dyePackArray[j].collisionCheck) {
                    continue;
                }
                var h = [];
                if (this.patrolArray[i].mHead.pixelTouches(this.dyePackArray[j], h)) {
                    this.patrolArray[i].mHead.collide();
                    this.dyePackArray[j].shake();
                } else if (this.patrolArray[i].mBotWing.pixelTouches(this.dyePackArray[j], h)) {
                    var color = this.patrolArray[i].mBotWing.mWing.getColor();
                    color[3] += 0.2;
                    this.patrolArray[i].mBotWing.mWing.setColor(color);
                    this.dyePackArray[j].shake();
                } else if (this.patrolArray[i].mTopWing.pixelTouches(this.dyePackArray[j], h)) {
                    var color = this.patrolArray[i].mTopWing.mWing.getColor();
                    color[3] += 0.2;
                    this.patrolArray[i].mTopWing.mWing.setColor(color);
                    this.dyePackArray[j].shake();
                }


            }

            var h = [];
            if (this.patrolArray[i].mHead.pixelTouches(this.hero, h)) {
                if (!this.hero.runOscillation) {
                    this.hero.runOscillation = true;
                }
            } else if (this.patrolArray[i].mBotWing.pixelTouches(this.hero, h)) {
                if (!this.hero.runOscillation) {
                    this.hero.runOscillation = true;
                }
            } else if (this.patrolArray[i].mTopWing.pixelTouches(this.hero, h)) {
                if (!this.hero.runOscillation) {
                    this.hero.runOscillation = true;
                }
            }
        }
    }


    // keep this at the end of the update function
    this.counter++;
};
//</editor-fold>
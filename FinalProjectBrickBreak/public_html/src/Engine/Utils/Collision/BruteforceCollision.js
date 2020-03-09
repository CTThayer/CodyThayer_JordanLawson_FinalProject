/* 
 * file: BruteforceCollision.js
 * 
 * Implements bruteforce collision checking
 */

function BruteforceCollision(colliderArray) {
    this.colliders = colliderArray;
};

BruteforceCollision.prototype.collideAll = function(collisionFunc) {
    for(var i = 0; i < this.colliders.length; i++) {
        for(var j = 0; j < this.colliders.length; j++) {
            var currentResult = [];
            var hit = this.colliders[i].pixelTouches(this.colliders[j], currentResult);
            if (hit) {
                collisionFunc(this.colliders[i], this.colliders[j], currentResult);
            }
        }
    }
};

BruteforceCollision.prototype.collideSubset = function(subArray, collisionFunc) {
    for(var i = 0; i < this.subArray.length; i++) {
        for(var j = 0; j < this.colliders.length; j++) {
            var currentResult = [];
            var hit = this.subArray[i].pixelTouches(this.colliders[j], currentResult);
            if (hit) {
                collisionFunc(this.subArray[i], this.colliders[j], currentResult);
            }
        }
    }
};

BruteforceCollision.prototype.setColliderArray = function(colliderArray) {
    this.colliders = colliderArray;
};

BruteforceCollision.prototype.addObject = function(object) {
    this.colliders.push(object);
};

CollisionController.prototype.removeObject = function(object) {
    var i = this.colliders.indexOf(object);
    this.colliders.splice(i, 1);
};
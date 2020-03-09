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
            collisionFunc(this.colliders[i], this.colliders[j]);
        }
    }
};

BruteforceCollision.prototype.collideSubset = function(subArray, collisionFunc) {
    for(var i = 0; i < this.subArray.length; i++) {
        for(var j = 0; j < this.colliders.length; j++) {
            collisionFunc(this.subArray[i], this.colliders[j]);
        }
    }
};

BruteforceCollision.prototype.setColliderArray = function(colliderArray) {
    this.colliders = colliderArray;
};

BruteforceCollision.prototype.addObject = function(object) {
    this.colliders.push(object);
};

BruteforceCollision.prototype.removeObject = function(object) {
    var i = this.colliders.indexOf(object);
    this.colliders.splice(i, 1);
};
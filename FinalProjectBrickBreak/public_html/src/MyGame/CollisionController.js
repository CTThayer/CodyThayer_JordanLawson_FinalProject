/* 
 * file: CollisionControler.js
 */

function CollisionController(colliderArray) {
    this.colliders = colliderArray;
};

CollisionController.prototype.getCollisions = function() {
    var collisions = [];
    for(var i = 0; i < this.colliders.length; i++) {
        for(var j = i + 1; j < this.colliders.length; j++) {
            var currentResult = [];
            var hit = this.colliders[i].pixelTouches(this.colliders[i], currentResult);
            if (hit) {
                collisions.push(currentResult);
            }
        }
    }
    return collisions;
};

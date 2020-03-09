/* 
 * File: QuadtreeManager.js
 * 
 * Handles creation and deletion of static and dynamic objects in the Quadtree.
 */


function QuadtreeManager(staticObjects, dynamicObjects, bounds, objPerNode, maxDepth) {
    this.staticColliders = staticObjects;
    this.dynamicColliders = dynamicObjects;
    this.mQuadTree = new QuadTree(bounds, objPerNode, maxDepth);
    for(var i = 0; i < this.staticColliders.length; i++) {
        this.mQuadTree.insert(this.staticColliders[i]);
    }
    for(var j = 0; j < this.dynamicColliders.length; j++) {
        this.mQuadTree.insert(this.dynamicColliders[j]);
    }
};


QuadtreeManager.prototype.updateCollisions = function(collisionFunc) {
    // First, update all dynamics so they are in the correct parts of the tree
    this.updateDynamics();
    
    // Second, get possible collisions for each dynamic, test collision, and 
    // then call the collisionFunc on each possitive hit
    for(var i = 0; i < this.dynamicColliders.length; i++) {
        var hitSet = this.mQuadTree.getObjectsNear(this.dynamicColliders[i]);
        for(let item of hitSet) {
            var hitLoc = [];
            if (this.dynamicColliders[i].pixelTouches(item, hitLoc)) {
                collisionFunct(this.dynamicColliders[i]);
            }
        }
    }
};

// Naive implementation update of dynamic objects in quadtree
// Simply removes and re-inserts dynamic objects so that they are in the right
// locations of the quadtree after they move.
QuadtreeManager.prototype.updateDynamics = function() {
    for(var i = 0; i < this.dynamicColliders.length; i++) {
        this.mQuadTree.remove(this.dynamicColliders[i]);
        this.mQuadTree.insert(this.dynamicColliders[i]);
    }
};

QuadtreeManager.prototype.addStatic = function(object) {
    this.staticColliders.push(object);
    this.mQuadTree.insert(object);
};

QuadtreeManager.prototype.addDynamic = function(object) {
    this.dynamicColliders.push(object);
    this.mQuadTree.insert(object);
};

QuadtreeManager.prototype.removeStatic = function(object) {
    var i = this.staticColliders.indexOf(object);
    this.staticColliders.splice(i, 1);
    this.mQuadTree.remove(object);
};

QuadtreeManager.prototype.removeDynamic = function(object) {
    var i = this.dynamicColliders.indexOf(object);
    this.dynamicColliders.splice(i, 1);
    this.mQuadTree.remove(object);
};
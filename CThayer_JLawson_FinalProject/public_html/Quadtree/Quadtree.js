/* 
 * File: Quadtree.js
 * 
 * Class with methods for creating, maintaing and using a Quadtree.
 * 
 */

function Quadtree(maxBounds, maxObjs, maxDepth) {
    this.root = new QNode(maxBounds);
    this.maxObjects = maxObjs;
    this.maxDepth = maxDepth;
};

Quadtree.prototype.insert = function(object) {
    
};

Quadtree.prototype.remove = function(object) {
    
};

Quadtree.prototype.clear = function() {
    
};

Quadtree.prototype.getObjectsNear = function(object) {
    
};

Quadtree.prototype._insertHelper = function(node, object) {
    
};
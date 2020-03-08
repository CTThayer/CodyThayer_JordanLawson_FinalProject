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
    // Get object's bounds in [minX, maxX, minY, maxY] format
    var oBounds = _calcObjectBounds(object);
    
    // Use _traversalHelper method test objectBounds against tree nodes recursively
    // Pass _insertHelper method so it can be called at correct insert locations
    this._traversalHelper(this.root, object, oBounds, 0, null, _insertHelper);
};

Quadtree.prototype.remove = function(object) {
    // Get object's bounds in [minX, maxX, minY, maxY] format
    var oBounds = _calcObjectBounds(object);
    
    // Use _traversalHelper method test objectBounds against tree nodes recursively
    // Pass _insertHelper method so it can be called at correct insert locations
    this._traversalHelper(this.root, object, oBounds, 0, null, _removeHelper);
};

Quadtree.prototype.getObjectsNear = function(object) {
    // Create an array to store the nearby objects in
    var results = [];
    
    // Get object's bounds in [minX, maxX, minY, maxY] format
    var oBounds = _calcObjectBounds(object);
    
    // Use _traversalHelper method to recursively get to the object in the tree node(s)
    // Pass _getObjectsHelper method so other objects in the node(s) can be fetched
    this._traversalHelper(this.root, object, oBounds, 0, results, _getObjectsHelper);
    
    return results;
};

Quadtree.prototype.clear = function() {
    this.root.clear();
};

/****************************** Private Methods *******************************/

// Traverses the Quadtree using objBounds and executes func at destination nodes
Quadtree.prototype._traversalHelper = function(node, object, objBounds, d, out, func) {
    var depth = d + 1;
    if (node != null) {
        if (node.nodes.length == 4) {
            var quads = node.getQuadrants(objBounds);
            for(var i = 0; i < quads.length; i++) {
                _traversalHelper(node.nodes[i], object, objBounds, depth, func);
            }
        }
        if (node.nodes.length == 0 && node.testBounds(objBounds)) {
            func(node, object, depth, out);
        }
    }
};

// Inserts an object at a specified node and tests whether node should split
// UNUSED PARAMS: out
Quadtree.prototype._insertHelper = function(node, object, depth, out) {
    node.objects.push(object);
    if (node.objects.length >= this.maxObjects && depth < this.maxDepth) {
        node.split();
    }
};

// Inserts an object at a specified node and tests whether node should split
// UNUSED PARAMS: depth, out
Quadtree.prototype._removeHelper = function(node, object, depth, out) {
    if (node.objects != null) {
        var index = node.objects.indexOf(object);
        if (index != -1){
            node.objects[index];
        }
    }
};

// Adds all objects in the specified node to the out array
// UNUSED PARAMS: object, depth
Quadtree.prototype._getObjectsHelper = function(node, object, depth, out) {
    if (node.objects != null) {
        for(var i = 0; i < node.objects.length; i++) {
            out.push(node.objects[i]);
        }
    }
};

// Calculates the specified object's bounds in [minX, maxX, minY, maxY] format
Quadtree.prototype._calcObjectBounds = function(object) {
    var minX = object.getXform().getXPos() - (object.getXform().getWidth() / 2);
    var maxX = object.getXform().getXPos() + (object.getXform().getWidth() / 2);
    var minY = object.getXform().getYPos() - (object.getXform().getHeight() / 2);
    var maxY = object.getXform().getYPos() - (object.getXform().getHeight() / 2);
    return [minX, maxX, minY, maxY];
};

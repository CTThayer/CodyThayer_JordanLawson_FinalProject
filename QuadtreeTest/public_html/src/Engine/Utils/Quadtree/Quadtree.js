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
    
    this.quadLines = [];
};

Quadtree.prototype.insert = function(object) {
    // Get object's bounds in [minX, maxX, minY, maxY] format
    var oBounds = this._calcObjectBounds(object);
    
    // Use _traversalHelper method test objectBounds against tree nodes recursively
    // Pass _insertHelper method so it can be called at correct insert locations
    let _insert = this._insertHelper.bind(this);
    this._traversalHelper(this.root, object, oBounds, 0, null, _insert);
};

Quadtree.prototype.remove = function(object) {
    // Get object's bounds in [minX, maxX, minY, maxY] format
    var oBounds = this._calcObjectBounds(object);
    
    // Use _traversalHelper method test objectBounds against tree nodes recursively
    // Pass _insertHelper method so it can be called at correct insert locations
    let remove = this._removeHelper.bind(this);
    this._traversalHelper(this.root, object, oBounds, 0, null, remove);
};

Quadtree.prototype.getObjectsNear = function(object) {
    // Create an array or set to store the nearby objects in
    // Using set eliminates the need to cull duplicates isn the output array
//  var results = [];           // use if out is an array
    var results = new Set();    // use if out is a set

    
    // Get object's bounds in [minX, maxX, minY, maxY] format
    var oBounds = this._calcObjectBounds(object);
    
    // Use _traversalHelper method to recursively get to the object in the tree node(s)
    // Pass _getObjectsHelper method so other objects in the node(s) can be fetched
    let _getObjectsNear = this._getObjectsHelper.bind(this);
    this._traversalHelper(this.root, object, oBounds, 0, results, _getObjectsNear);
    
    return results;
};

Quadtree.prototype.clear = function() {
    this.root.clear();
    this.root = new QNode(maxBounds);
};

Quadtree.prototype.getQuadLines = function() {
    
    if (this.root === null || this.root.bounds === null) {
        console.log("ERROR: Invalid Root Node");
        return [];
    }
    
    // Create outermost border
    var top = new LineRenderable(this.root.bounds[0], this.root.bounds[3], this.root.bounds[1], this.root.bounds[3]);
    var bottom = new LineRenderable(this.root.bounds[0], this.root.bounds[2], this.root.bounds[1], this.root.bounds[2]);
    var left = new LineRenderable(this.root.bounds[0], this.root.bounds[2], this.root.bounds[0], this.root.bounds[3]);
    var right = new LineRenderable(this.root.bounds[1], this.root.bounds[2], this.root.bounds[1], this.root.bounds[3]);
    this.quadLines.push(top);
    this.quadLines.push(bottom);
    this.quadLines.push(left);
    this.quadLines.push(right);
    
    // Does NOT use _traversalHelper() because it needs a different type of
    // traversal in order to ensure ALL node borders are drawn
    this._linesHelper(this.root, -1, this.quadLines);
};

/****************************** Private Methods *******************************/

// Traverses the Quadtree using objBounds and executes func at destination nodes
Quadtree.prototype._traversalHelper = function(node, object, objBounds, d, out, func) {
    var depth = d + 1;
    if (node != null) {
        if (node.nodes.length == 4) {
            var quads = node.getQuadrants(objBounds);
            for(var i = 0; i < quads.length; i++) {
                //let _traverse = this._traversalHelper.bind(this);
                this._traversalHelper(node.nodes[quads[i]], object, objBounds, depth, out, func);
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
//          out.push(node.objects[i]);  // use if out is an array
            out.add(node.objects[i]);   // use if out is a set
        }
    }
};

// Calculates the specified object's bounds in [minX, maxX, minY, maxY] format
Quadtree.prototype._calcObjectBounds = function(object) {
    var minX = object.getXform().getXPos() - (object.getXform().getWidth() / 2);
    var maxX = object.getXform().getXPos() + (object.getXform().getWidth() / 2);
    var minY = object.getXform().getYPos() - (object.getXform().getHeight() / 2);
    var maxY = object.getXform().getYPos() + (object.getXform().getHeight() / 2);
    var bounds = [minX, maxX, minY, maxY];
    return bounds;
};

Quadtree.prototype._linesHelper = function(node, quadrant, lineArray) {
    if (node !== null) {
        if (node.nodes.length === 4) {
            for(var i = 0; i < 4; i++) {
                this._drawHelper(node.nodes[i], i, lineArray);
                if (i === 0) {
                    
                }
            }
                var top = new LineRenderable(node.bounds[0], node.bounds[3], node.bounds[1], node.bounds[3]);
                var bottom = new LineRenderable(node.bounds[0], node.bounds[2], node.bounds[1], node.bounds[2]);
                var left = new LineRenderable(node.bounds[0], node.bounds[2], node.bounds[0], node.bounds[3]);
                var right = new LineRenderable(node.bounds[1], node.bounds[2], node.bounds[1], node.bounds[3]);
                lineArray.push(top);
                lineArray.push(bottom);
                lineArray.push(left);
                lineArray.push(right);
        }
    }
};


Quadtree.prototype.getMaxObjsPerNode = function() { return this.maxObjects; };
Quadtree.prototype.getMaxDepth = function() { return this.maxDepth; };

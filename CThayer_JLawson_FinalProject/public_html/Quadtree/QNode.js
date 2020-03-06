/* 
 * File: QNode.js
 * 
 * The fundamental nodes that make up the Quadtree
 * 
 */

function QNode(bounds) {
    this.bounds = bounds;   // centerX, centerY, width, height
    this.nodes = [];
    this.objects = [];
};

QNode.prototype.split = function() {
    // Calculate bounds of new child nodes
    var quarterW = this.bounds[2] / 4;
    var quarterH = this.bounds[3] / 4;
    var tlBounds = [this.bounds[0] - quarterW, this.bounds[1] + quarterH, quarterW, quarterH];
    var trBounds = [this.bounds[0] + quarterW, this.bounds[1] + quarterH, quarterW, quarterH];
    var blBounds = [this.bounds[0] - quarterW, this.bounds[1] - quarterH, quarterW, quarterH];
    var brBounds = [this.bounds[0] + quarterW, this.bounds[1] - quarterH, quarterW, quarterH];
    
    // Create new child nodes
    this.nodes[0] = new QNode(tlBounds);
    this.nodes[1] = new QNode(trBounds);
    this.nodes[2] = new QNode(blBounds);
    this.nodes[3] = new QNode(brBounds);
    
    // Move objects from parent node into child nodes, then clear parent objects array
    var count = this.objects.length;
    for(var i = 0; i < count; i++) {
        var quads = this.getQuadrants(this.objects[i]);
        for(var j = 0; j < quads.length; j++) {
            this.nodes[j].push(this.objects[i]);
        }
    }
    this.objects = [];
};

QNode.prototype.testBounds = function(otherBounds) {
    var nHalfW = this.bounds[2] / 2;
    var nHalfH = this.bounds[3] / 2;
    var nMinX = this.bounds[0] - nHalfW;
    var nMaxX = this.bounds[0] + nHalfW;
    var nMinY = this.bounds[0] - nHalfH;
    var nMaxY = this.bounds[0] + nHalfW;
    
    var oHalfW = otherBounds[2] / 2;
    var oHalfH = otherBounds[3] / 2;
    var oMinX = otherBounds[0] - oHalfW;
    var oMaxX = otherBounds[0] + oHalfW;
    var oMinY = otherBounds[0] - oHalfH;
    var oMaxY = otherBounds[0] + oHalfW;
    
    if( nMinX < oMaxX && 
        nMaxX > oMinX && 
        nMinY < oMaxY && 
        nMaxY > oMinY ) {
            return true;
    } else {return false;}
};

QNode.prototype.getQuadrants = function(region) {
    if (this.nodes.length !== 4)
        return [-1];
    else {
        var quadrants = [];
        for(var i = 0; i < 4; i++) {
            if(this.nodes[0].testBounds(this.objects[i])) {
                quadrants.push(0);
            }
            if(this.nodes[1].testBounds(this.objects[i])) {
                quadrants.push(1);
            }
            if(this.nodes[2].testBounds(this.objects[i])) {
                quadrants.push(2);
            }
            if(this.nodes[3].testBounds(this.objects[i])) {
                quadrants.push(3);
            }
        }
    }
};
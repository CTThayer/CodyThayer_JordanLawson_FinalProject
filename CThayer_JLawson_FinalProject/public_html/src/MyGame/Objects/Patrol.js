/* 
Objects:
1 Head 7.5x5
2 Wings 10x8

Locations: both of the Wing object is tries to maintain to be located at 10 units to the right of the
Head, where the Top Wing is about 6 units above and the Bottom Wing is about 6 units below
the Head’s y position.

This can be achieved with the same system that Dye uses to follow mouse

Color: initialize all object color to [1, 1, 1, 0], note, color[3] is 0.

Behaviors:
Head Motion: The Patrol Head travels in random directions with a speed random between 5 to
10 units/second.
Wing Motion: The Wings interpolate from their current positions in an attempt to follow the
Head:
 Rate: 0.05
 Cycles: 120 frames
Animation: at least one of the Wing objects must have a simple sprite animation defined

Bound and Movement:

 Bound: The size of the control bound is defined as:

o Width: The combined width of the bounds of Head and Wing
o Height: 150% of the combined height of the bounds of Head and Wing
Here are a couple of close ups on the Patrol and a Patrol with bounds switched
on.

 Movement: When the bound of the entire bound touches the bounds of the WC, the
direction of the velocity reflects.
Hit: When a DyePack collides with

 Head: The position of the Head (only) is moved towards the right by 5 units.
 Wing: The alpha channel, color[3], of the colliding Wing is incremented by 0.2
 Lifespan: terminates if
 The entire bound is to the right of the WC window (can occur if being Hit on the Head
continuously)
 The Alpha channel of either of the Wing becomes equal or larger than 1.0
 */


function Patrol(texture1, texture2, outlineTexture, initPos, wcbounds) {
    // Store a copy of world coordinate bounds
    this.WCBounds = wcbounds;   // [minX, maxX, minY, maxY]

    // Create head and wing objects for this patrol
    this.mHead = new Head(texture2, initPos);
    this.mTopWing = new Wing(texture1, this.mHead, initPos, true);
    this.mBotWing = new Wing(texture1, this.mHead, initPos, false);
    
    // Padding value used to keep outline slightly larger than the objects inside it
    this.outlinePadding = 0.1;
    
    // Create an outline gameObject that marks the edges of the Patrol object
    this.mOutline = new TextureRenderable(outlineTexture);
    this.mOutline.getXform().setPosition(initPos[0], initPos[1]);
    this.mOutline.getXform().setSize();
    
    // Boolean that marks the item for deletion
    this.deleteCheck = false;
    
    // Initialize gameObject with  spriteAnimateRenderable
    GameObject.call(this, this.mTopWing);
    GameObject.call(this, this.mBotWing);
    GameObject.call(this, this.mHead);
}
gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.update = function() {
    var hXform = this.mHead.getXform();
    var twXform = this.mTopWing.getXform();
    var bwXform = this.mBotWing.getXform();
    
    // Get average of head and wing positions
    var avgXpos = (hXform.getXPos() + twXform.getXPos() + bwXform.getXPos()) / 3;
    var avgYpos = (hXform.getYPos() + twXform.getYPos() + bwXform.getYPos()) / 3;
    
    // Get dimensions
    var dimensions = this.getDimensions();
//    console.log("dimensions: " + dimensions);

    this.mHead.update();
    this.mTopWing.update();
    this.mBotWing.update();
    
    this.mOutline.getXform().setPosition(avgXpos, avgYpos);
    this.mOutline.getXform().setSize(dimensions);
    
    // Test for collision with world bounds; if none, simply update position and size
    // Test against left bound
    if (avgXpos - (dimensions[0] / 2) <= this.WCBounds[0]) {
//        console.log("Left edge x value (avgXpos - dim[0]): " + (avgXpos - dimensions[0]));
//        console.log("Collide Left, obj pos is " + this.mOutline.getXform().getPosition());
        this.CollideLeft();
        
        if (avgXpos + (dimensions[0] / 2) < this.WCBounds[0]) {
            this.deleteCheck = true;
        }
    }
    // Test against right bound
    if (avgXpos + (dimensions[0] / 2) >= this.WCBounds[1]) {
//        console.log("Right edge x value (avgXpos + dim[0]): " +(avgXpos + dimensions[ 0]));
//        console.log("Collide Right, obj pos is " + this.mOutline.getXform().getPosition());        
        this.CollideRight();
        
        if (avgXpos - (dimensions[0] / 2) > this.WCBounds[1]) {
            this.deleteCheck = true;
//            console.log("delete patrol b/c out of bounds");
        }
    }
    // Test against top bound
    if (avgYpos + (dimensions[1] / 2) >= this.WCBounds[3]) {
//        console.log("Top edge y value (avgYpos + dim[1]): " + (avgYpos + dimensions[1]));
//        console.log("Collide Bottom, obj pos is " + this.mOutline.getXform().getPosition());
        this.CollideTop();
        collided = true;
        
        if (avgYpos - (dimensions[1] / 2) > this.WCBounds[3]) {
            this.deleteCheck = true;
        }
    }
    // Test against bottom bound
    if (avgYpos - (dimensions[1] / 2) <= this.WCBounds[2]) {
//        console.log("Bottom edge y value (avgYpos - dim[1]): " + (avgYpos - dimensions[1]));
//        console.log("Collide Top, obj pos is " + this.mOutline.getXform().getPosition());
        this.CollideBottom();
        collided = true;
        
        if (avgYpos + (dimensions[1] / 2) < this.WCBounds[2]) {
            this.deleteCheck = true;
        }
    }
    
    // Check if wing is destroyed
    var tColor = this.mTopWing.getRenderable().getColor();
    var bColor = this.mBotWing.getRenderable().getColor();
    if (tColor[3] === 1.0 || bColor[3] === 1.0)
    {
        this.deleteCheck = true;
    }
    
};

Patrol.prototype.draw = function(camera) {
    this.mOutline.draw(camera);
    this.mTopWing.draw(camera);
    this.mBotWing.draw(camera);
    this.mHead.draw(camera);
};

Patrol.prototype.getDimensions = function() {
    var headXform = this.mHead.getXform();
    var topWXform = this.mTopWing.getXform();
    var botWXform = this.mBotWing.getXform();
    var backWing;
    if (topWXform.getPosition()[0] >= botWXform.getPosition()[0]) {
        backWing = topWXform;
    } else {
        backWing = botWXform;
    }
    var front = headXform.getXPos() - (headXform.getWidth() / 2);
    var back = backWing.getXPos() + (backWing.getWidth() / 2);
    var width = back - front;
    
    var top = topWXform.getYPos() + (topWXform.getHeight() / 2);
    var bottom = botWXform.getYPos() - (botWXform.getHeight() / 2);
    var height = top - bottom;
    
    var dims = [width, height];
    return dims;
};

Patrol.prototype.getPosition = function() {
    return this.getXform.getPosition();
};

Patrol.prototype.CollideLeft = function() {
    this.mHead.reflect(0);
};

Patrol.prototype.CollideRight = function() {
    this.mHead.reflect(1);
};

Patrol.prototype.CollideTop = function() {
    this.mHead.reflect(2);
};

Patrol.prototype.CollideBottom = function() {
    this.mHead.reflect(3);
};

Patrol.prototype.clear = function() {
    delete this.mOutline;
    delete this.mTopWing;
    delete this.mBotWing;
    delete this.mHead;
    delete this;
}

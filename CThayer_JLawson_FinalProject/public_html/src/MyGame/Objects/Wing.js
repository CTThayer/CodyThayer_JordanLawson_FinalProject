/* 
 *  File: Wing.js
 * 
 *  Contains code for the "wing" component of each Patrol object.
 *  Wing components follow the head component using interpolation.
 *  
 */

function Wing(texture, head, position, isTop) {
    
    this.kCycles = 120;
    this.kRate = 0.05;
    
    // Initialize mWing spriteAnimateRenderable object
    this.mWing = new SpriteAnimateRenderable(texture);
    this.mWing.setColor([1, 1, 1, 0]);
    this.mWing.getXform().setPosition(position[0], position[1]);
    this.mWing.getXform().setSize(10, 8);
    this.mWing.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
                                 204, 164,   // widthxheight in pixels
                                 5,          // number of elements in this sequence
                                 0);         // horizontal padding in between
    this.mWing.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mWing.setAnimationSpeed(30);

    // Setup interpolate for following head object
    this.mInterpolatePos = new InterpolateVec2([position[0], position[1]], this.kCycles, this.kRate);

    // Store head reference
    this.mHead = head;
    
    // Set offset values based on whether this is the top wing or bottom wing.
    // Offset is used to establish a "standard distance" that the head and wings
    // try to stay apart.
    if (isTop === true) {
        this.offset = [8.75, 4];
    } else {
        this.offset = [8.75, -4];
    }

    // Initialize gameObject with this.mWing spriteAnimateRenderable
    GameObject.call(this, this.mWing);
}
gEngine.Core.inheritPrototype(Wing, GameObject);

Wing.prototype.update = function () {
    
    // Update this.mWing's animation
    this.mWing.updateAnimation();
    
    // Interpolate and move towards head location
    //var targetPos = vec2.add(this.mHead.returnXform().getPosition(), this.offset);
    var headPos = this.mHead.returnXform().getPosition();
    var tX = headPos[0] + this.offset[0];
    var tY = headPos[1] + this.offset[1];
    var targetPos = [tX, tY];

    this.mInterpolatePos.setFinalValue(targetPos);
    this.mInterpolatePos.updateInterpolation();
    var pos = this.mInterpolatePos.getValue();
    this.mWing.getXform().setPosition(pos[0], pos[1]);
};

/* 
DyePack: This is the DyePack. Always spawned at the Hero’s location (e.g., from her hand).
    Size: 2x3.25
    Behaviors:
        Motion: Travel at a constant speed in the positive-X direction.
            Speed: 120 units per second
            Slows down: When pressing D speed deaccelerates at a constant of
            0.1-unit/frame (NOTE: this is a decrease by a constant number, not a constant rate)
        Hit: When pixel collide with a Patrol. A DyePack will oscillates according to our damped
        harmonic function where:
            X/Y Amplitude: 4, 0.2
            Frequency: 20
            Duration: 300 frames [we can grade this behavior]
        Lifespan:
            Maximum lifespan of 5 seconds.
            Terminates if
                travels outside of the World Bound
                speed reaches 0 (or less)
                after Hit (hitting a Patrol (details later))
    User Input:
        D: D-Key pressed (NOTE: this is key pressed) triggers slow down
        S: S-Key click triggers a Hit event for ALL DyePack currently on in the world
 */


/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function DyePack(spriteTexture, position) {
    this.kRefWidth = 80;
    this.kRefHeight = 130;
    this.kDelta = 2.0;
    this.counter = 0;
    this.origin = null;

    this.collisionCheck = true;
    this.mDyePack = new SpriteRenderable(spriteTexture);
    this.mDyePack.setColor([1, 1, 1, 0.1]);
    this.mDyePack.getXform().setPosition(position[0], position[1]);
    this.mDyePack.getXform().setSize(2, 3.25);
    this.mDyePack.getXform().incRotationByRad(1.5708);
    this.mDyePack.setElementPixelPositions(510, 595, 23, 153);
    GameObject.call(this, this.mDyePack);
    this.mObjectShake = null;
}
gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.shake = function () {
    if(this.mObjectShake === null){
            this.origin = this.mDyePack.getXform().getPosition();
            this.mObjectShake = new ShakePosition(4, 0.2, 20, 300);
            this.collisionCheck = false;
    }
};

DyePack.prototype.update = function () {
    this.counter++;
    var xform = this.getXform();
    
    if(this.kDelta <= 0){
        this.deleteCheck = true;
    }
    
    if(this.mObjectShake !== null && !this.mObjectShake.shakeDone()){
        var ds = this.mObjectShake.getShakeResults();
        this.mDyePack.getXform().setPosition(this.origin[0]+ds[0], this.origin[1]+ds[1]);
    } else if(this.origin !== null) this.mDyePack.getXform().setPosition(this.origin[0], this.origin[1]);
    
    if(this.mObjectShake !== null && this.mObjectShake.shakeDone()){
        this.deleteCheck = true;
        this.origin = null;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        this.shake();
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if(this.kDelta >= 0){
            this.kDelta += -0.1;
        }
    }
    
    if(this.mObjectShake === null){
    
        // Check if it is time to delete the object
        // I couldn't be bothered to use the Date.now() function so we know that we refresh 60 times per second
        // So 5*60 is 300 updates, so after 300 updates we know 5 seconds has passed so delete object
        if(this.counter >= 300){
            this.deleteCheck = true;
            // No need to perform any other updates
            return;
        } else if (this.mDyePack.getXform().getXPos() >= 100){
            this.deleteCheck = true;
            return;
        }

        xform.incXPosBy(this.kDelta);

    }
};


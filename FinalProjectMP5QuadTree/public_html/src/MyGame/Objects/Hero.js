/* 
 *  File: Hero.js
 *  
 *  Contains code for hero movement and spawning DyePacks at the hero location
 *  
 */

function Hero(texture, position, dyePackManager, camera) {

    
    // Initialize mHero SpriteRenderable
    this.mHero = new SpriteRenderable(texture);
    this.mHero.setColor([1, 1, 1, 0]);
    this.mHero.getXform().setPosition(position[0], position[1]);
    this.mHero.getXform().setSize(9, 12);
    this.mHero.setElementPixelPositions(0, 120, 0, 180);
    this.type = "Hero";
    
    this.kCycles = 120;
    this.kRate = 0.05;
    this.mInterpolatePos = new InterpolateVec2(position, this.kCycles, this.kRate);
    
    this.mDyePackManager = dyePackManager;
    this.mCamera = camera;
    
    GameObject.call(this, this.mHero);
    
    // Set osciallation (shake) values
    this.mShake = new ShakePosition(4.5, 6, 4, 60);
    this.runOscillation = false;
}
gEngine.Core.inheritPrototype(Hero, GameObject);


Hero.prototype.update = function () {

    var heroPos = this.getXform().getPosition();
    
    // Interpolate and move towards mouse location
    if (this.mCamera.isMouseInViewport()) {
        var mouseX = this.mCamera.mouseWCX();
        var mouseY = this.mCamera.mouseWCY();
        var targetPos = vec2.fromValues(mouseX, mouseY);
        this.mInterpolatePos.setFinalValue(targetPos);
        this.mInterpolatePos.updateInterpolation();
        var pos = this.mInterpolatePos.getValue();
        this.mHero.getXform().setPosition(pos[0], pos[1]);
    }
    
    // Handle spacebar input
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.mDyePackManager.spawnDyePack(heroPos);
    }
    
    // Handle Q-key input
    // Oscillate size if Q-key is clicked (for testing on-hit behavior)
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q) && this.runOscillation == false) {
        this.runOscillation = true;
    }
    
    if (this.runOscillation == true) {
        if (!this.mShake.shakeDone()) {
            this.oscillate();
        } else {
            this.mHero.getXform().setSize(9, 12);
            this.mShake.resetNumCylces(60);
            this.runOscillation = false;
        }
    }
};

Hero.prototype.oscillate = function() {
    var size = this.mHero.getXform().getSize();
    var results = this.mShake.getShakeResults();
    var sizeX = size[0] + results[0];
    var sizeY = size[1] + results[1];
    this.mHero.getXform().setSize(sizeX, sizeY);
};


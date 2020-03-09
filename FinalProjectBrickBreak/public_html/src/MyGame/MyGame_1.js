/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
 FontRenderable, SpriteRenderable, LineRenderable,
 GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame_1() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatformSprite = "assets/platform.png";
    this.WCBounds = [-100, 100, -75, 75]; // [minX, maxX, minY, maxY]

    // The camera to view the scene
    this.mCamera = null;
    
    this.mDyePackArray;

    this.mPlatform = null;
    this.mPlatformArray = [];

    this.mQuadtreeManager = null;
    this.mQuadTreeMode = false;
    
    this.bfCollisionManager = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame_1.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
            vec2.fromValues(0, 0), // position of the camera
            200, // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
            );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    // Create platforms
    this.mPlatform = null;
    var i;
    for (i = 0; i < 1000; i++) {
        this.mPlatform = new Platform(this.kPlatformSprite, [0, 0]);
        this.mPlatformArray.push(this.mPlatform);
    }

    // Create DyePacks
    for (var j = 0; j < 3; j++) {
        this.mDyePackArray[j] = new DyePack(this.kMinionSprite, this.mPlatformArray);
    }

    // Setup mQuadtreeManager
    var bounds = [-100, 100, -75, 75];
    var maxObjPerNode = 8;
    var maxDepth = 5;
    this.mQuadTreeManager = new QuadtreeManager(this.mPlatformArray, this.mDyePackArray, bounds, maxObjPerNode, maxDepth);

    // Setup bruteforce collision manager
    var allObjs = this.mPlatformArray.slice(0, this.mPlatformArray.length - 1);
    allObjs = allObjs.concat(this.mDyePackArray);
    this.mBruteforceCollision = new BruteforceCollision(allObjs);

    this.mPlatform = null;

};


MyGame_1.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

MyGame_1.prototype.unloadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame_1.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();

    var i;
    for (i = 0; i < this.mPlatformArray.length; i++) {
        this.mPlatformArray[i].draw(this.mCamera);
    }
    var j;
    for (j = 0; j < this.mDyePackArray.length; i++) {
        this.mDyePackArray[j].draw(this.mCamera);
    }

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame_1.prototype.update = function () {

    // Create more platforms
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        var newPlatform = new Platform(this.kPlatformSprite, [Math.random() * (75 - (-75)) + (-75), Math.random() * (100 - (-100)) + (-100)]);
        this.mPlatformArray.push(newPlatform);
    }

    // Change to QuadTree Mode
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mQuadTreeMode = !this.mQuadTreeMode;
    }
    
    // Run collision based on collision mode
    if(this.mQuadTreeMode) { // && this.mQuadtreeManager !== null){
        this.mQuadTreeMode.updateCollisions();
    }
    else {
        this.mBruteforceCollision.collideAll();
    }
    
    // Update dyepacks
    for (var j = 0; j < this.mDyePackArray.length; j++) {
        this.mDyePackArray[j].update();
    }
    
    gUpdateFrame();
};

MyGame_1.prototype.collideReaction = function (objA, objB, hitLoc) {
    objA.setColor([1, 0, 0, 0]);
};

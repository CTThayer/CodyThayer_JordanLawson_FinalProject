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

function MyGame() {
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
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function () {
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


    this.mPlatform = null;

};


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatformSprite);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();

    this.mDyePack1.draw(this.mCamera);
    this.mDyePack2.draw(this.mCamera);
    this.mDyePack3.draw(this.mCamera);

    var i;
    for (i = 0; i < this.mPlatformArray.length; i++) {
        this.mPlatformArray[i].draw(this.mCamera);
    }

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

    // Create more platforms
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        var newPlatform = new Platform(this.kPlatformSprite, [Math.random() * (75 - (-75)) + (-75), Math.random() * (100 - (-100)) + (-100)]);
        this.mPlatformArray.push(newPlatform);
    }

    // Change to QuadTree
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.mQuadTreeMode = !this.mQuadTreeMode;
    }
    
    
    if(this.mQuadTreeMode) { // && this.mQuadtreeManager !== null){
        this.mQuadTreeMode.updateCollisions();
    }
    else {

        var i = 0;
        // Check for platform collisions
        var skip1 = false;
        var skip2 = false;
        var skip3 = false;
        for (i = 0; i < this.mPlatformArray.length; i++) {
            var h = [];
            if (this.mDyePack1.pixelTouches(this.mPlatformArray[i], h)) {
                this.mDyePack1.mDyePack.setColor([1, 0, 0, 1]);
                skip1 = true;
            } else if (!skip1) {
                this.mDyePack1.mDyePack.setColor([0, 0, 0, 0]);
            }
            if (this.mDyePack2.pixelTouches(this.mPlatformArray[i], h)) {
                this.mDyePack2.mDyePack.setColor([1, 0, 0, 1]);
                skip2 = true;
            } else if (!skip2) {
                this.mDyePack2.mDyePack.setColor([0, 0, 0, 0]);
            }
            if (this.mDyePack3.pixelTouches(this.mPlatformArray[i], h)) {
                this.mDyePack3.mDyePack.setColor([1, 0, 0, 1]);
                skip3 = true;
            } else if (!skip3) {
                this.mDyePack3.mDyePack.setColor([0, 0, 0, 0]);
            }
        }
        var h = [];
        if (this.mDyePack1.pixelTouches(this.mDyePack2, h) || this.mDyePack1.pixelTouches(this.mDyePack3, h)) {
            this.mDyePack1.mDyePack.setColor([1, 0, 0, 1]);
            skip1 = true;
        } else if (!skip1) {
            this.mDyePack1.mDyePack.setColor([0, 0, 0, 0]);
        }

        if (this.mDyePack2.pixelTouches(this.mDyePack1, h) || this.mDyePack1.pixelTouches(this.mDyePack3, h)) {
            this.mDyePack2.mDyePack.setColor([1, 0, 0, 1]);
            skip2 = true;
        } else if (!skip2) {
            this.mDyePack2.mDyePack.setColor([0, 0, 0, 0]);
        }

        if (this.mDyePack3.pixelTouches(this.mDyePack1, h) || this.mDyePack1.pixelTouches(this.mDyePack2, h)) {
            this.mDyePack3.mDyePack.setColor([1, 0, 0, 1]);
            skip3 = true;
        } else if (!skip3) {
            this.mDyePack3.mDyePack.setColor([0, 0, 0, 0]);
        }
    }

    this.mDyePack1.update();
    this.mDyePack2.update();
    this.mDyePack3.update();

    gUpdateFrame();
};

MyGame.prototype.collideReaction = function (reactingObj) {
    reactingObj.setColor([0, 0, 0, 0]);
};